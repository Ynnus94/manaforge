/**
 * Homepage / Landing Page
 * 
 * - Authenticated users → Redirect to /dashboard
 * - Non-authenticated users → Show landing page
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit, Sparkles, Zap, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // Landing page for non-authenticated users
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="text-7xl">🃏</span>
            <br />
            MANAFORGE
          </h1>
          <p className="text-2xl text-muted-foreground">
            The future of MTG deck building with AI superpowers
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build Commander decks with git-style validation, AI-powered suggestions,
            and never hallucinate card names again.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-primary" />
                Git-Style Staging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stage deck changes, review your edits, and commit with confidence.
                Full history tracking and rollback support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Deck Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get intelligent suggestions powered by Claude AI with real card data
                from Scryfall. No hallucinations, ever.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Real-Time Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Instant format validation, legality checks, and deck analysis.
                Build legal decks every time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">Ready to forge your decks?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of players building better Commander decks with AI.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
