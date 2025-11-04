/**
 * CTA Section - Final call to action
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center space-y-8 bg-gradient-to-br from-primary/10 via-background to-primary/10 rounded-3xl p-8 sm:p-12 md:p-16 border">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Ready to forge your decks?
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground">
            Join thousands of players building better Commander decks with AI.
            <br className="hidden sm:block" />
            Free to start. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg" asChild>
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/login">
                I Have an Account
              </Link>
            </Button>
          </div>

          <div className="pt-8 border-t border-border/50">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">10,000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Cards Tracked</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">5,000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Decks Built</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

