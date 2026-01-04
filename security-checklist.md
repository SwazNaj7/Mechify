# Mechify — Security Checklist & Debugging Guide

> Security audit checklist for the Mechify trading journal application.
> **Stack:** Next.js + Supabase + OpenAI

---

## 1. Quick Security Audit

### ✅ Pre-Launch Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Environment** | All API keys in `.env.local` (not committed) | ⬜ |
| **Environment** | `.env.local` added to `.gitignore` | ⬜ |
| **Environment** | No `NEXT_PUBLIC_` prefix on secret keys | ⬜ |
| **Supabase** | RLS enabled on ALL tables | ⬜ |
| **Supabase** | RLS policies tested with different users | ⬜ |
| **Supabase** | Anon key only used client-side | ⬜ |
| **Supabase** | Service role key only used server-side | ⬜ |
| **Auth** | Password requirements enforced | ⬜ |
| **Auth** | Email confirmation enabled | ⬜ |
| **Storage** | Bucket policies restrict user access | ⬜ |
| **API** | Rate limiting configured | ⬜ |
| **API** | Input validation on all endpoints | ⬜ |
| **Frontend** | No sensitive data in client bundle | ⬜ |

---

## 2. Environment Variables

### ✅ Correct Setup

```bash
# .env.local (NEVER commit this file)

# Public (safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Private (server-only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ⚠️ NO NEXT_PUBLIC_ prefix!
OPENAI_API_KEY=sk-...                  # ⚠️ NO NEXT_PUBLIC_ prefix!
```

### ❌ Common Mistakes

| Mistake | Risk | Fix |
|---------|------|-----|
| `NEXT_PUBLIC_OPENAI_API_KEY` | API key exposed in browser | Remove `NEXT_PUBLIC_` prefix |
| Service key in client component | Full DB access exposed | Use only in Server Actions |
| `.env.local` committed to git | All secrets leaked | Add to `.gitignore` immediately |

### 🔍 Debugging: Check for Exposed Keys

```bash
# Search for accidentally exposed keys in your bundle
# Run after building
npx next build
grep -r "sk-" .next/static
grep -r "service_role" .next/static
```

---

## 3. Supabase Row Level Security (RLS)

### ✅ Required Policies

#### `profiles` Table

```sql
-- Users can only view their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  using ( auth.uid() = id );

-- Users can only update their own profile
create policy "Users can update own profile" 
  on public.profiles for update 
  using ( auth.uid() = id );
```

#### `trades` Table

```sql
-- Users can only CRUD their own trades
create policy "Users can CRUD their own trades"
  on public.trades for all
  using ( auth.uid() = user_id );
```

### 🔍 Debugging: Verify RLS is Enabled

```sql
-- Run in Supabase SQL Editor
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Expected Output:**
| tablename | rowsecurity |
|-----------|-------------|
| profiles | true |
| trades | true |

### 🔍 Debugging: Test RLS Policies

```sql
-- Test as a specific user (replace with actual UUID)
SET request.jwt.claims = '{"sub": "user-uuid-here"}';

-- This should only return that user's trades
SELECT * FROM public.trades;

-- Reset
RESET request.jwt.claims;
```

### 🔍 Debugging: Check Existing Policies

```sql
-- View all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

---

## 4. Supabase Storage Security

### ✅ Bucket Policy for `trade-images`

```sql
-- Allow authenticated users to upload to their own folder
create policy "Users can upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'trade-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own images
create policy "Users can view own images"
  on storage.objects for select
  using (
    bucket_id = 'trade-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own images
create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'trade-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 📁 File Path Convention

```
trade-images/
└── {user_id}/
    └── {trade_id}.webp
```

This ensures users can only access files in their own folder.

---

## 5. Input Validation

### ✅ Server Action Validation

Always validate inputs in Server Actions before database operations.

```typescript
// lib/validations.ts
import { z } from 'zod';

export const tradeSchema = z.object({
  instrument: z.string().min(1).max(20),
  timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', 'D']),
  direction: z.enum(['long', 'short']),
  result: z.enum(['break_even', 'take_profit', 'stopped_out']),
  entry_price: z.number().positive().optional(),
  exit_price: z.number().positive().optional(),
  open_time: z.string().datetime(),
  close_time: z.string().datetime(),
  notes: z.string().max(5000).optional(),
});

// In your Server Action
export async function createTrade(formData: FormData) {
  const validated = tradeSchema.safeParse({
    instrument: formData.get('instrument'),
    // ... other fields
  });

  if (!validated.success) {
    return { error: 'Invalid input', details: validated.error };
  }

  // Proceed with validated.data
}
```

### ❌ Common Vulnerabilities

| Vulnerability | Risk | Prevention |
|---------------|------|------------|
| **SQL Injection** | Database compromise | Use Supabase client (parameterized queries) |
| **XSS** | Script injection | React auto-escapes; sanitize `dangerouslySetInnerHTML` |
| **CSRF** | Unauthorized actions | Next.js Server Actions have built-in CSRF protection |
| **Path Traversal** | File access | Validate file paths; use UUIDs for filenames |

---

## 6. API Security

### ✅ Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

### ✅ OpenAI API Protection

```typescript
// Only call OpenAI from Server Actions (never client-side)
'use server';

export async function analyzeChart(imageUrl: string) {
  // Validate user is authenticated
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Validate the image belongs to this user
  const isOwner = await verifyImageOwnership(user.id, imageUrl);
  if (!isOwner) {
    throw new Error('Forbidden');
  }

  // Now safe to call OpenAI
  const response = await openai.chat.completions.create({
    // ...
  });
}
```

---

## 7. Authentication Security

### ✅ Supabase Auth Configuration

| Setting | Recommended Value | Location |
|---------|-------------------|----------|
| **Email Confirmation** | Required | Supabase Dashboard → Auth → Settings |
| **Password Min Length** | 8+ characters | Supabase Dashboard → Auth → Settings |
| **JWT Expiry** | 3600 seconds (1 hour) | Supabase Dashboard → Auth → Settings |
| **Refresh Token Rotation** | Enabled | Supabase Dashboard → Auth → Settings |

### ✅ Protected Routes (Next.js Middleware)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie config */ } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

---

## 8. Security Debugging Commands

### 🔍 Check for Secrets in Git History

```bash
# Search for accidentally committed secrets
git log -p | grep -i "sk-"
git log -p | grep -i "service_role"
git log -p | grep -i "password"
```

### 🔍 Audit npm Dependencies

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix
```

### 🔍 Supabase Logs

```bash
# View auth logs (via Supabase CLI)
npx supabase logs --project-ref your-project-ref

# Or check in Dashboard → Logs → Auth
```

### 🔍 Test RLS from Client

```typescript
// Temporarily add this to test RLS
const { data, error } = await supabase
  .from('trades')
  .select('*');

console.log('Trades visible:', data?.length);
// Should only show current user's trades
```

---

## 9. Production Hardening

### ✅ Before Going Live

| Task | Command/Action | Status |
|------|----------------|--------|
| Run security audit | `npm audit` | ⬜ |
| Test RLS policies | SQL queries above | ⬜ |
| Verify env variables | Check Vercel dashboard | ⬜ |
| Enable Supabase Auth email confirmation | Dashboard setting | ⬜ |
| Set up error monitoring | Sentry or similar | ⬜ |
| Configure rate limiting | Upstash or Vercel | ⬜ |
| Review storage bucket policies | Supabase Dashboard | ⬜ |
| Test with multiple user accounts | Manual QA | ⬜ |

### ✅ Monitoring

| What to Monitor | Tool |
|-----------------|------|
| Failed auth attempts | Supabase Auth Logs |
| API errors | Vercel Logs / Sentry |
| Database queries | Supabase Query Performance |
| Rate limit hits | Upstash Dashboard |

---

## 10. Incident Response

### 🚨 If API Key is Exposed

1. **Immediately rotate the key** in respective dashboard (OpenAI, Supabase)
2. Update `.env.local` and Vercel environment variables
3. Redeploy application
4. Check logs for unauthorized usage
5. If Supabase service key: audit database for unauthorized changes

### 🚨 If User Data is Accessed

1. Document the incident
2. Check Supabase Auth logs for suspicious activity
3. Review RLS policies
4. Notify affected users if required
5. Patch the vulnerability

---

*Last updated: January 2026*
