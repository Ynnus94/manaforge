/**
 * Features Section
 * 
 * Showcase key features with responsive grid
 */

import { 
  Sparkles, 
  GitCommit, 
  Zap, 
  MessageSquare,
  Shield,
  TrendingUp
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-First Interface',
      description: 'Ask questions in plain English. Get instant, accurate answers powered by Claude AI with real MTG data from Scryfall.',
      highlight: true,
    },
    {
      icon: GitCommit,
      title: 'Git-Style Validation',
      description: 'Stage deck changes, review diffs, and commit with confidence. Full history tracking and rollback support.',
    },
    {
      icon: MessageSquare,
      title: 'Conversational Deck Building',
      description: '"Fix my mana base" — AI analyzes your deck, suggests changes, and explains its reasoning. You stay in control.',
    },
    {
      icon: Shield,
      title: 'Never Hallucinate',
      description: 'AI only uses real data from your collection, Scryfall, and meta databases. No made-up cards or bad suggestions.',
    },
    {
      icon: TrendingUp,
      title: 'Price Tracking & Meta',
      description: 'Track card prices, get alerts on spikes, and stay current with meta trends. Know what to buy and when.',
    },
    {
      icon: Zap,
      title: 'Blazing Fast',
      description: 'Real-time format validation, instant search, and sub-2-second AI responses. Mobile-optimized with offline support.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Why MANAFORGE?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            The only MTG app that puts AI at the center of everything
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

