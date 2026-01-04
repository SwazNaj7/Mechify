import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, MessageSquare, Shield } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">Mechify</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold tracking-tight">
            Master Your Trading with{' '}
            <span className="text-primary">AI-Powered</span> Journaling
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your trades, analyze your charts with GPT-4 Vision, and get
            personalized feedback based on the PB Blake Mechanical Trading Model.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8">
                Start Free Today
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Smart Trade Logging</h3>
            <p className="text-sm text-muted-foreground">
              Upload screenshots and let AI analyze your setups automatically
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Track win rates, grade distribution, and session performance
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI Trading Buddy</h3>
            <p className="text-sm text-muted-foreground">
              Chat with an AI trained on mechanical trading principles
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your trade data is encrypted and never shared
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p> {new Date().getFullYear()} Mechify. Built for serious traders.</p>
        </footer>
      </div>
    </div>
  );
}
