/**
 * Hero Section - Landing Page
 * 
 * UNICORN-GRADE responsive hero with:
 * - Animated gradient background
 * - Large emoji icon
 * - Compelling headline
 * - AI-first value prop
 * - CTA buttons
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px] dark:bg-grid-slate-400/[0.05]" />
      
      <div className="container relative mx-auto px-4 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <span className="text-8xl sm:text-9xl md:text-[12rem] animate-pulse">
                🃏
              </span>
              <div className="absolute -right-4 -top-4 bg-primary rounded-full p-2">
                <Sparkles className="h-8 w-8 text-primary-foreground animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              MANAFORGE
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">
              Your AI-Powered MTG Assistant
            </p>
          </div>

          {/* Value Prop */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop clicking through menus. Just ask.{' '}
            <span className="text-foreground font-semibold">
              "Show me decks I can build"
            </span>{' '}
            — and watch the magic happen.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
              🤖 AI-First Interface
            </div>
            <div className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
              🎴 Git-Style Validation
            </div>
            <div className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
              📱 Mobile & Desktop
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-muted-foreground">
            Join thousands of players building better decks with AI
          </p>
        </div>
      </div>
    </section>
  );
}

