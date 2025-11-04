/**
 * AI Context Builder
 * 
 * Builds system prompts with user context
 */

import type { UserContext } from '@/types/ai';

export function buildSystemPrompt(context: Partial<UserContext>): string {
  const {
    current_screen = 'dashboard',
    collection_summary,
    active_deck_id,
    preferences,
    recent_activity = [],
  } = context;

  const collectionInfo = collection_summary
    ? `- Collection: ${collection_summary.total_cards} cards (${collection_summary.unique_cards} unique) worth $${collection_summary.total_value.toFixed(2)}`
    : '- Collection: No data available';

  const deckInfo = active_deck_id
    ? `- Currently viewing deck: ${active_deck_id}`
    : '- Not currently viewing a deck';

  const prefInfo = preferences
    ? `- Preferred formats: ${preferences.formats.join(', ') || 'None specified'}
- Budget preference: ${preferences.budget_preference}
- Playstyle: ${preferences.playstyle || 'Not specified'}`
    : '- No preferences set';

  return `You are an expert Magic: The Gathering assistant with deep knowledge of the game, cards, formats, and strategies.

USER CONTEXT:
- Current screen: ${current_screen}
${collectionInfo}
${deckInfo}
${prefInfo}

YOUR CAPABILITIES:
You have access to tools that let you:
1. Search for MTG cards (real data from Scryfall)
2. View and analyze the user's collection
3. View and analyze the user's decks
4. Get current card prices
5. Add/remove cards from decks
6. Validate deck legality
7. Suggest decks based on collection
8. Calculate deck statistics

IMPORTANT RULES:
1. **Never hallucinate card names** - Always use the search_cards tool to verify cards exist
2. **Always show changes before applying** - Get user confirmation before modifying decks
3. **Explain your reasoning** - Tell users WHY you suggest something
4. **Be encouraging and friendly** - MTG players love their hobby!
5. **Use real data only** - Tools provide accurate information, never guess
6. **Ask clarifying questions** - If unsure, ask before acting
7. **Respect user's budget** - Consider their budget_preference when suggesting cards
8. **Format matters** - Always check format legality when building decks

RESPONSE STYLE:
- Be conversational and enthusiastic
- Use emojis sparingly (🎴 🃏 💰 ✨)
- Format card names in **bold**
- Show prices when relevant
- Break down complex concepts simply

${recent_activity.length > 0 ? `\nRECENT CONVERSATION:\n${recent_activity.join('\n')}` : ''}

Remember: You're here to help players build better decks and manage their collection. Make it fun!`;
}

export function getQuickActions(screen: UserContext['current_screen']): string[] {
  const actions: Record<typeof screen, string[]> = {
    dashboard: [
      'Show me decks I can build',
      'What\'s my collection worth?',
      'Which of my cards spiked in price?',
      'Suggest a budget deck for me',
    ],
    collection: [
      'Find my most expensive cards',
      'Show me cards I should sell',
      'What decks can I build?',
      'Find all my blue cards',
    ],
    deck_list: [
      'Build a new Commander deck',
      'Show me budget modern decks',
      'What\'s the best deck for beginners?',
      'Compare my decks',
    ],
    deck_builder: [
      'Fix my mana base',
      'Suggest cards for this deck',
      'Is this deck legal?',
      'What\'s the mana curve?',
    ],
    landing: [
      'What can MANAFORGE do?',
      'How does AI help with deck building?',
      'Tell me about git-style validation',
      'What formats are supported?',
    ],
  };

  return actions[screen] || actions.dashboard;
}

