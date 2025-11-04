# 🤖 MVP PLAN: AI-First, Responsive MTG Deck Builder

**Vision**: The first MTG app where **AI is the interface**. Ask anything, get instant answers.

**Differentiator**: Instead of clicking through 5 screens, you just ask.

---

## 🎯 THE NEW ARCHITECTURE

### Core Principle: AI-Powered Everything

```
User Intent → AI Chatbot → Tools/Functions → Database → Response
                  ↓
            (Context-aware based on current screen)
```

**Every feature is accessible via chat OR traditional UI.**

---

## 🏗️ RESPONSIVE LAYOUT SYSTEM

### Desktop (1024px+): Spatial + Chat Sidebar

```
┌────────────────────────────────────────────────────────────┐
│  [🃏 Logo] 🔍 Search... [💬 AI] [Notifications] [Profile]  │
├─────┬──────────────────────────────────────┬───────────────┤
│ NAV │                                      │  💬 AI Chat   │
│     │                                      │               │
│ 🏠  │         MAIN CONTENT                 │  "How can I   │
│ 🎴  │        (Dashboard, Deck,             │  help you?"   │
│ 📚  │         Collection, etc.)            │               │
│ ⚙️  │                                      │  Quick:       │
│     │                                      │  [Buildable]  │
│ 💬  │                                      │  [Prices]     │
│     │                                      │               │
│     │                                      │  [Type msg... │
└─────┴──────────────────────────────────────┴───────────────┘
 20%              50%                             30%
```

### Mobile (<768px): Bottom Nav + Floating Chat

```
┌────────────────────────────────────┐
│  ☰  🔍 Search...  [💬]  [Profile]  │ ← Top bar
├────────────────────────────────────┤
│                                    │
│         MAIN CONTENT               │
│        (Single view)               │
│                                    │
│                                    │
│                                [💬]│ ← Floating chat button
└────────────────────────────────────┘
[🏠] [🎴] [📚] [⋮]  ← Bottom nav
```

Tap 💬 → Full-screen chat interface

---

## 🤖 AI CHATBOT ARCHITECTURE

### Backend: Claude API + MCP Tools

**Already aligned with `.cursorrules`!**

```typescript
// src/lib/ai/chatbot.ts
import Anthropic from '@anthropic-ai/sdk';
import { mcpTools } from '@/lib/ai/mcp-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chat(
  messages: Message[],
  context: UserContext
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: buildSystemPrompt(context),
    messages,
    tools: mcpTools, // PWN API tools!
    stream: true,
  });

  return response;
}
```

### MCP Tools (From PWN API)

```typescript
// src/lib/ai/mcp-tools.ts
export const mcpTools = [
  {
    name: 'get_user_collection',
    description: 'Get all cards in user\'s collection',
    input_schema: { /* ... */ },
  },
  {
    name: 'get_user_decks',
    description: 'Get all user\'s decks',
    input_schema: { /* ... */ },
  },
  {
    name: 'search_cards',
    description: 'Search Scryfall for cards',
    input_schema: { /* ... */ },
  },
  {
    name: 'analyze_deck',
    description: 'Analyze deck for improvements',
    input_schema: { /* ... */ },
  },
  {
    name: 'add_card_to_deck',
    description: 'Add card to a specific deck',
    input_schema: { /* ... */ },
  },
  {
    name: 'get_card_prices',
    description: 'Get current card prices',
    input_schema: { /* ... */ },
  },
  {
    name: 'get_meta_data',
    description: 'Get current meta decks and trends',
    input_schema: { /* ... */ },
  },
  {
    name: 'validate_deck_format',
    description: 'Check if deck is legal in format',
    input_schema: { /* ... */ },
  },
  // ... 20+ more tools
];
```

### Context Injection

```typescript
interface UserContext {
  user_id: string;
  current_screen: 'dashboard' | 'deck_builder' | 'collection' | 'deck_list';
  active_deck_id?: string;
  active_card_id?: string;
  collection_summary: {
    total_cards: number;
    total_value: number;
    unique_cards: number;
  };
  preferences: {
    formats: string[];
    budget_preference: 'budget' | 'mid' | 'high' | 'unlimited';
    playstyle: 'aggro' | 'control' | 'midrange' | 'combo';
  };
  recent_activity: string[];
}

function buildSystemPrompt(context: UserContext): string {
  return `You are an expert Magic: The Gathering assistant.

USER CONTEXT:
- Current screen: ${context.current_screen}
- Collection: ${context.collection_summary.total_cards} cards worth $${context.collection_summary.total_value}
- Active deck: ${context.active_deck_id || 'None'}
- Formats: ${context.preferences.formats.join(', ')}
- Budget: ${context.preferences.budget_preference}

CAPABILITIES:
You can:
- Search for cards
- Analyze decks
- Suggest improvements
- Add/remove cards from decks
- Get prices and meta data
- Answer rules questions
- Help build new decks

RULES:
- Always show changes before applying them
- Explain your reasoning
- Ask clarifying questions if unsure
- Use tools to get accurate data (never guess)
- Be friendly and encouraging

Current conversation context:
${context.recent_activity.join('\n')}
`;
}
```

---

## 🎨 CHATBOT UI COMPONENTS

### Desktop: Sidebar Chat Panel

```typescript
// src/components/ai/ChatSidebar.tsx
'use client';

import { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    // Stream AI response
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    // Handle streaming...
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full border-l bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">💬 AI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <QuickActions onSelect={handleSend} />
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))
        )}
        {isLoading && <ChatMessage message={{ role: 'assistant', content: '...' }} isTyping />}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
```

### Mobile: Full-Screen Chat

```typescript
// src/components/ai/ChatMobile.tsx
'use client';

export function ChatMobile() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <button onClick={onClose}>←</button>
        <h1 className="font-bold">AI Assistant</h1>
        <button>⋮</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Same as desktop */}
      </div>

      {/* Input (fixed at bottom) */}
      <div className="p-4 border-t bg-background">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
```

### Quick Actions Component

```typescript
// src/components/ai/QuickActions.tsx
const quickActions = [
  {
    icon: '🎴',
    label: 'Show me decks I can build',
    query: 'What decks can I build with my collection?',
  },
  {
    icon: '💰',
    label: 'Collection value',
    query: 'What is my collection worth?',
  },
  {
    icon: '🔍',
    label: 'Find budget deck',
    query: 'Find me a budget modern deck under $100',
  },
  {
    icon: '📈',
    label: 'Price movers',
    query: 'Which of my cards changed price this week?',
  },
];

export function QuickActions({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Quick actions:</p>
      {quickActions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.query)}
          className="w-full text-left p-3 rounded-lg border hover:bg-muted transition"
        >
          <span className="mr-2">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

---

## 🚀 PHASED IMPLEMENTATION

### Phase 0: Foundation (Weeks 1-4) - SAME AS BEFORE

✅ Types, hooks, utils (unicorn-grade foundation)
✅ Responsive layout system
✅ Supabase + auth
✅ Bug fixes (P0 tasks)

### Phase 1: Core Features + Basic AI (Weeks 5-12)

**1A: Responsive Pages (Weeks 5-8)**
- Dashboard (desktop 3-col, mobile stack)
- Collection (desktop grid, mobile list)
- Deck list (responsive cards)

**1B: AI Chatbot MVP (Weeks 9-12)** 🦄
- ✅ Chat UI (sidebar desktop, fullscreen mobile)
- ✅ Claude API integration
- ✅ MCP tool definitions (10 core tools)
- ✅ Context injection
- ✅ Streaming responses
- ✅ Quick actions

**Supported queries**:
- "Show me decks I can build"
- "What's my collection worth?"
- "Find me a [budget] [format] deck"
- "Add [card] to [deck]"
- "Search for [card name]"

**Deliverable**: AI chatbot can answer questions and perform basic actions

---

### Phase 2: Deck Builder + Advanced AI (Weeks 13-20)

**2A: Deck Builder (Weeks 13-16)**
- Desktop: 3-panel layout
- Mobile: Tabbed interface
- Git-style staging area
- Card search with AI assist

**2B: Advanced AI (Weeks 17-20)** 🦄
- ✅ "Fix mana base" command
- ✅ "Suggest cards for my deck"
- ✅ "Convert [deck] to [commander]"
- ✅ "What beats [deck]?" (meta analysis)
- ✅ Apply changes with user confirmation
- ✅ Explain recommendations

**Deliverable**: AI can modify decks intelligently

---

### Phase 3: Mobile Enhancements + Collection AI (Weeks 21-26)

**3A: Mobile Power (Weeks 21-23)**
- Touch gestures
- Camera card scanner
- Voice input for chat
- Haptic feedback

**3B: Collection AI (Weeks 24-26)** 🦄
- ✅ Weekly collection summaries
- ✅ Price movement alerts
- ✅ "What happened to my collection?"
- ✅ Trade recommendations
- ✅ Rotation warnings

**Deliverable**: Mobile experience + collection insights

---

### Phase 4: Polish + Advanced Features (Weeks 27-32)

**4A: Desktop Power (Weeks 27-29)**
- Keyboard shortcuts
- Multi-window support
- Deck comparison
- Advanced analytics

**4B: Learning Assistant (Weeks 30-32)** 🦄
- ✅ Rules Q&A with examples
- ✅ Strategy advice
- ✅ "Teach me about [topic]"
- ✅ Interactive tutorials
- ✅ Format primers

**Deliverable**: Complete AI-powered MTG assistant

---

## 🎯 MVP SCOPE (First 12 Weeks)

### Must-Have
- ✅ Responsive layout (desktop + mobile)
- ✅ Collection management
- ✅ Basic deck builder
- ✅ **AI Chatbot with 10 core tools** 🦄
- ✅ Quick actions
- ✅ Context-aware suggestions

### AI Capabilities (MVP)
1. Answer questions about collection
2. Search for cards
3. Suggest decks user can build
4. Get card prices
5. Add/remove cards from decks
6. Basic deck analysis
7. Answer rules questions
8. Get meta information
9. Format validation
10. Explain card interactions

---

## 📋 UPDATED BUILDER TASKS

### NEW Priority Order:

**Phase 0: Foundation (Same as before)**
- Tasks 1-7: Bug fixes (P0)
- Tasks 8-12: Types, hooks, utils, Scryfall

**Phase 1: Responsive Pages + AI**
- Task 13: Responsive layout system
- Task 14: Dashboard (responsive)
- Task 15: Collection (responsive)
- Task 16: Deck list (responsive)
- **Task 17: AI Chatbot Backend** 🦄 NEW!
  - Claude API integration
  - MCP tools setup
  - Context injection
  - Tool calling logic
- **Task 18: AI Chatbot UI (Desktop)** 🦄 NEW!
  - Sidebar chat panel
  - Message components
  - Quick actions
  - Streaming UI
- **Task 19: AI Chatbot UI (Mobile)** 🦄 NEW!
  - Full-screen chat
  - Floating button
  - Voice input
  - Touch-optimized

**Phase 2: Deck Builder + Advanced AI**
- Task 20: Deck builder (responsive)
- Task 21: Staging area (git-style)
- Task 22: Advanced AI tools (fix mana, convert deck)
- Task 23: Card components
- Task 24: Stats/charts

**Phase 3-4: Polish**
- Tasks 25-30: Mobile enhancements, polish, accessibility

---

## 🤖 AI TOOL DEFINITIONS (Priority Order)

### Tier 1: Core Tools (Week 9-10)
1. `get_user_collection` - Get all user's cards
2. `get_user_decks` - Get all user's decks
3. `search_cards` - Search Scryfall
4. `get_card_details` - Get specific card data
5. `get_card_prices` - Get current prices

### Tier 2: Deck Tools (Week 11)
6. `add_card_to_deck` - Add card
7. `remove_card_from_deck` - Remove card
8. `analyze_deck` - Get deck stats
9. `validate_deck_format` - Check legality
10. `suggest_decks_from_collection` - Buildable decks

### Tier 3: Advanced (Week 12)
11. `get_meta_data` - Current meta
12. `fix_mana_base` - Optimize lands
13. `suggest_cards_for_deck` - Recommendations
14. `get_price_history` - Price trends
15. `answer_rules_question` - Rules engine

### Tier 4: Pro Features (Phase 2)
16. `convert_deck_commander` - Convert deck
17. `compare_to_meta_deck` - Comparison
18. `get_sideboard_guide` - Matchup advice
19. `bulk_add_cards` - Import from list
20. `trade_recommendation` - Trade analysis

---

## 💡 EXAMPLE USER FLOWS

### Flow 1: New User
```
1. Sign up
2. Chatbot greets: "👋 Let's start by adding your collection!"
3. User: "I have about 500 cards"
4. AI: "Great! You can:
   • Import from CSV
   • Scan cards with camera (mobile)
   • Add manually
   Which would you prefer?"
5. User imports CSV
6. AI: "✓ Added 523 cards! Your collection is worth $1,247.
   💡 You can build 12 complete decks! Want to see them?"
```

### Flow 2: Building a Deck
```
1. User: "I want to build a modern deck"
2. AI: "I can help! Quick questions:
   • Budget? [Under $100] [$100-300] [No limit]
   • Playstyle? [Aggro] [Control] [Combo]"
3. User: [Under $100] [Aggro]
4. AI: "Perfect! Mono Red Burn fits you:
   • $89 total
   • You own 54/60 cards (only $15 more!)
   • Fast, competitive deck
   [Build This Deck] [See Alternatives]"
5. User: [Build This Deck]
6. AI creates deck, shows missing cards
```

### Flow 3: Deck Help
```
1. User viewing "Rakdos Midrange" deck
2. User: "Fix mana base"
3. AI: "Analyzing... You need:
   • 2 more black sources
   • 1 more red source
   
   I recommend:
   • +2 Blackcleave Cliffs (you own 4x) ✓
   • +1 Blood Crypt (need to buy $12) ⚠️
   • -2 Mountain, -1 Swamp
   
   [Apply Changes] [Explain Math]"
4. User: [Apply Changes]
5. AI stages changes, user reviews, commits
```

---

## ✅ SUCCESS METRICS

### Engagement
- **Chat sessions per user**: Target 3+ per day
- **Messages per session**: Target 5+
- **Tool calls per session**: Target 2+
- **User returns after first chat**: Target 80%+

### AI Quality
- **Response time**: <2 seconds
- **Tool call success rate**: >95%
- **User satisfaction** (👍/👎): >90% positive
- **Queries handled without errors**: >98%

### Feature Adoption
- **% users using AI**: Target 80%+ (within first week)
- **% decks built with AI help**: Target 50%+
- **% users who return to chat**: Target 70%+

---

## 🎨 DESIGN TOKENS (AI-Specific)

### AI Chat Colors
```css
/* AI message background */
--ai-message-bg: hsl(220 13% 96%);

/* User message background */
--user-message-bg: hsl(220 70% 50%);
--user-message-fg: white;

/* Thinking/loading */
--ai-thinking: hsl(220 70% 50% / 0.1);

/* Tool call highlight */
--tool-call: hsl(142 76% 36%);

/* Error state */
--ai-error: hsl(0 84% 60%);
```

### Chat Spacing
```css
/* Message padding */
--chat-message-p: 1rem;

/* Message gap */
--chat-message-gap: 1rem;

/* Input height */
--chat-input-h: 3rem;
```

---

## 🔐 SECURITY & PRIVACY

### Data Access
- AI can only access user's own data (RLS enforced)
- No cross-user data leakage
- Tool calls validated server-side

### Rate Limiting
- Max 100 chat messages per hour (free tier)
- Max 1,000 per day
- Premium: Unlimited

### Content Moderation
- Filter inappropriate queries
- Block abuse patterns
- Log all tool calls for audit

---

## 💰 MONETIZATION (Future)

### Free Tier
- 100 AI chats per month
- Basic tool access
- Standard features

### Premium ($9.99/month)
- Unlimited AI chats
- Advanced AI tools (deck conversion, meta analysis)
- Priority responses
- Voice input
- Export features

### Pro ($19.99/month)
- Everything in Premium
- Multi-window support
- Advanced analytics
- Bulk operations
- API access

---

## 🚀 HANDOFF TO BUILDER

**Builder, here's your updated mission:**

1. **Read this AI chatbot plan** (this file)
2. **Read UNICORN_GRADE_CHECKLIST.md** (foundation requirements)
3. **Read BUILDER_MVP_TASKS.md** (will be updated with new AI tasks)

**New task priority**:
```
P0: Fix bugs (Tasks 1-7)
P1: Foundation (Tasks 8-12)
P2: Responsive pages (Tasks 13-16)
P3: 🦄 AI CHATBOT (Tasks 17-19) ← THE DIFFERENTIATOR!
P4: Deck builder + staging
P5: Polish
```

The AI chatbot is now a **Phase 1 deliverable**, not Phase 5!

---

**This plan changes everything. MANAFORGE is now:**

❌ NOT: "Another MTG deck builder"  
✅ YES: "Your AI-powered MTG assistant that happens to build decks"

🦄🤖✨

