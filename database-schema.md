# Mechify — Database Schema & AI Integration

> **Mechanical Trading Journal** — AI-powered trade grading using the PB Blake Model.

---

## 1. Project Overview

| Aspect | Description |
|--------|-------------|
| **Purpose** | Remove emotion from trading by quantifying confluence with AI |
| **Grading Model** | PB Blake Mechanical Trading Model |
| **Database** | Supabase (PostgreSQL) with Row Level Security |

### Core Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  INGEST  │ → │ ANALYZE  │ → │  GRADE   │ → │  STORE   │
│  Upload  │    │  GPT-4o  │    │  A+/A/A- │    │ Supabase │
│  Chart   │    │  Vision  │    │  Score   │    │ Postgres │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## 2. Database Schema

> **Setup:** Apply via Supabase Migrations → `npx supabase migration new initial_schema`
> **Security:** RLS enabled — users can ONLY access their own data.

---

### 📋 Table: `profiles`

*Syncs with `auth.users` automatically via trigger or manual creation.*

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key, references `auth.users` |
| `email` | `text` | User email |
| `full_name` | `text` | Display name |
| `created_at` | `timestamptz` | Account creation time (UTC) |

#### SQL Definition

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile" 
  on public.profiles for select 
  using ( auth.uid() = id );

create policy "Users can update own profile" 
  on public.profiles for update 
  using ( auth.uid() = id );
```

---

### 📈 Table: `trades`

*The core journaling table for all trade entries.*

#### Schema Overview

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | `uuid` | ✅ | Auto-generated primary key |
| `user_id` | `uuid` | ✅ | Foreign key to `profiles` |
| `instrument` | `text` | ✅ | e.g., `EURUSD`, `NQ`, `BTC` |
| `timeframe` | `text` | ✅ | e.g., `15m`, `1h`, `4h` |
| `direction` | `text` | — | `long` or `short` |
| `result` | `enum` | ✅ | `break_even`, `take_profit`, `stopped_out` |
| `entry_price` | `numeric` | — | Optional manual entry |
| `exit_price` | `numeric` | — | Optional manual entry |
| `open_time` | `timestamptz` | ✅ | Trade open (stored as UTC) |
| `close_time` | `timestamptz` | ✅ | Trade close (stored as UTC) |
| `image_url` | `text` | ✅ | Supabase Storage URL |
| `setup_grade` | `text` | — | `A+`, `A`, `A-`, `B`, `C` |
| `ai_confidence` | `text` | — | `high`, `medium`, `low` |
| `ai_reasoning` | `text` | — | AI explanation (the "Why") |
| `overlay_entry_x` | `numeric` | — | Entry point X coordinate (0-100%) |
| `overlay_entry_y` | `numeric` | — | Entry point Y coordinate (0-100%) |
| `notes` | `text` | — | User notes |
| `created_at` | `timestamptz` | ✅ | Record creation time |

#### SQL Definition

```sql
-- Create Enum for consistent results
create type trade_result_type as enum ('break_even', 'take_profit', 'stopped_out');

create table public.trades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Trade Details
  instrument text not null,
  timeframe text not null,
  direction text check (direction in ('long', 'short')),
  result trade_result_type not null,
  
  -- Prices (Optional)
  entry_price numeric,
  exit_price numeric,
  
  -- Timeline (Always UTC)
  open_time timestamp with time zone not null,
  close_time timestamp with time zone not null,
  
  -- AI Analysis Data
  image_url text not null,
  setup_grade text check (setup_grade in ('A+', 'A', 'A-', 'B', 'C')),
  ai_confidence text,
  ai_reasoning text,
  
  -- Chart Overlay Coordinates (0-100% relative to image)
  overlay_entry_x numeric, 
  overlay_entry_y numeric,
  
  -- User Notes
  notes text,
  
  created_at timestamp with time zone default timezone('utc', now()) not null
);
```

#### Indexes (Performance)

```sql
create index trades_user_id_idx on public.trades(user_id);
create index trades_result_idx on public.trades(result);
create index trades_grade_idx on public.trades(setup_grade);
```

#### Row Level Security

```sql
alter table public.trades enable row level security;

create policy "Users can CRUD their own trades"
  on public.trades for all
  using ( auth.uid() = user_id );
```

---

### 🗂️ Storage: `trade-images` Bucket

| Setting | Value |
|---------|-------|
| **Bucket Name** | `trade-images` |
| **Access** | Authenticated users can upload |
| **Isolation** | Users can only read their own folder |

---

## 3. Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────────────────────┐
│   auth.users    │       │              trades                 │
├─────────────────┤       ├─────────────────────────────────────┤
│ id (uuid) PK    │──┐    │ id (uuid) PK                        │
│ email           │  │    │ user_id (uuid) FK ──────────────────┤
│ ...             │  │    │ instrument, timeframe, direction    │
└─────────────────┘  │    │ result (enum)                       │
                     │    │ entry_price, exit_price             │
┌─────────────────┐  │    │ open_time, close_time (UTC)         │
│    profiles     │  │    │ image_url                           │
├─────────────────┤  │    │ setup_grade, ai_confidence          │
│ id (uuid) PK ───┼──┘    │ ai_reasoning                        │
│ email           │       │ overlay_entry_x, overlay_entry_y    │
│ full_name       │       │ notes                               │
│ created_at      │       │ created_at                          │
└─────────────────┘       └─────────────────────────────────────┘
```

---

## 4. AI Integration

### Vision API Response Schema

> Enforce JSON responses — do NOT parse plain text.

```typescript
type AIResponse = {
  market_bias: "bullish" | "bearish" | "neutral";
  structures_detected: {
    liquidity_sweep: boolean;
    fair_value_gap: boolean;
    market_structure_shift: boolean;
    smt_divergence: boolean;
  };
  grading: {
    score: "A+" | "A" | "A-" | "B" | "C";
    confidence: number; // 1-100
    missing_confluence: string[]; // e.g., ["No HTF PD Array"]
  };
  chart_overlay: {
    entry_point: { x: number; y: number }; // % coordinates
    stop_loss: { x: number; y: number };   // % coordinates
  };
  reasoning_summary: string; // Max 2 sentences
};
```

---

### PB Blake Grading Logic (Chain of Thought)

The AI must verify these steps **in order** before assigning a grade:

| Step | Check | Required For |
|------|-------|--------------|
| 1️⃣ | **Narrative** — Is there a Higher Timeframe (HTF) objective? | All grades |
| 2️⃣ | **Sweep** — Did price take Liquidity (BSL/SSL)? | All grades |
| 3️⃣ | **Shift** — Did a Market Structure Shift (MSS) occur with displacement? | A- and above |
| 4️⃣ | **Return** — Did price return to a PD Array (FVG/Block)? | A and above |
| 5️⃣ | **SMT** — Is there divergence? | A+ only |

#### Grade Assignment

| Grade | Requirements |
|-------|--------------|
| **A+** | All 5 steps confirmed |
| **A** | Steps 1-4 confirmed |
| **A-** | Steps 1-3 confirmed |
| **B** | Steps 1-2 confirmed |
| **C** | Only Step 1 or incomplete |

---

## 5. Development Guidelines

| Guideline | Implementation |
|-----------|----------------|
| **Type Safety** | Run `npx supabase gen types typescript` after DB changes |
| **Mutations** | Use Next.js Server Actions for all DB operations |
| **Timezones** | Store as UTC, convert to EST on frontend only |
| **Components** | Use shadcn/ui — avoid custom inputs unless necessary |

---

*Last updated: January 2026*