# Workflow Guide - Agent System

**How to build features using the Planner → Builder → Looker → Pusher workflow**

---

## 🎭 Meet Your Team

### 🎨 Planner - The Architect
**Role**: Designs features and creates implementation plans  
**When to use**: Starting any new feature or significant change  
**Prompt location**: `cursor-prompts/planner.md`

### 🔨 Builder - The Craftsman
**Role**: Writes production-ready code from plans  
**When to use**: Implementing planned features  
**Prompt location**: `cursor-prompts/builder.md`

### 🔍 Looker - The Reviewer
**Role**: Reviews code for quality, performance, and correctness  
**When to use**: After Builder completes implementation  
**Prompt location**: `cursor-prompts/looker.md`

### 📚 Pusher - The Documentarian
**Role**: Updates documentation and keeps knowledge fresh  
**When to use**: After features ship, or when docs need updates  
**Prompt location**: `cursor-prompts/pusher.md`

---

## 🔄 The Complete Workflow

### Step 1: Plan the Feature 🎨
**Agent**: Planner  
**Duration**: 30-60 minutes

#### What You Do
1. Open Cursor AI
2. Load the Planner agent: Reference `cursor-prompts/planner.md`
3. Describe what you want to build
4. Provide context: current codebase, constraints, user needs

#### What Planner Does
- Analyzes requirements
- Designs component architecture
- Creates data models
- Plans implementation steps
- Identifies edge cases
- Documents the plan in `docs/CURRENT_TASK.md`

#### Example Prompt
```
@planner.md I need to add git-style staging for deck modifications. 
Users should be able to:
- Add/remove cards and see them in a "staging area"
- Review all staged changes before applying
- Commit changes with a message (like git commit -m)
- View deck history
- Rollback to previous versions

Context:
- We're using Supabase for database
- We need real-time updates
- This must work with our existing DeckBuilder component
- We want this to feel like GitHub's PR review UI

Please create a comprehensive implementation plan.
```

#### Planner Output Example
```markdown
## Feature: Git-Style Deck Staging

### Overview
Implement a staging area for deck modifications that gives users complete control
before applying changes. Like git, users stage changes, review them, and commit
with a message.

### Components
- StagingArea.tsx - Shows pending changes with diff UI
- CommitDialog.tsx - Modal for commit message
- HistoryView.tsx - Shows commit history
- useStagingArea.ts - Hook for staging logic

### Data Model
```typescript
interface StagedChange {
  id: string; // Temporary UUID
  action: 'add' | 'remove' | 'update' | 'move';
  scryfall_id: string;
  quantity: number;
  old_quantity?: number;
  category: 'commander' | 'mainboard' | 'sideboard' | 'maybeboard';
  old_category?: string;
  timestamp: number;
}

interface DeckHistoryEntry {
  id: string;
  deck_id: string;
  changes: StagedChange[];
  message: string;
  committed_at: string;
  committed_by: string;
}
```

### Implementation Steps
1. Create useStagingArea hook with stage/discard/commit functions
2. Build StagingArea component with diff visualization
3. Add CommitDialog with message input
4. Implement commit logic (apply + save to history)
5. Create HistoryView component
6. Add rollback functionality

### Edge Cases & Validation
- Empty staging area (disable commit button)
- Conflicting changes (adding and removing same card)
- Validation before commit (deck must be legal)
- Network errors during commit
- Optimistic UI updates

[... detailed plan continues ...]
```

---

### Step 2: Build the Feature 🔨
**Agent**: Builder  
**Duration**: 2-8 hours (depends on complexity)

#### What You Do
1. Review Planner's output in `docs/CURRENT_TASK.md`
2. Load the Builder agent: Reference `cursor-prompts/builder.md`
3. Point Builder to the plan
4. Work through implementation step by step

#### What Builder Does
- Writes TypeScript code following plan
- Creates components, hooks, utilities
- Adds error handling
- Writes tests
- Follows project conventions
- Documents complex logic

#### Example Prompt
```
@builder.md Please implement the Mana Curve Visualization feature 
according to the plan in docs/CURRENT_TASK.md.

Let's start with Phase 1: Create the mana calculation utility.
```

#### Builder's Process
Builder works incrementally:
1. **Create types and interfaces**
2. **Build utility functions**
3. **Write tests for utilities**
4. **Create components**
5. **Connect to state**
6. **Add styling**
7. **Handle edge cases**

#### Tips for Working with Builder
- ✅ **One step at a time**: Don't ask for everything at once
- ✅ **Review as you go**: Check each piece before moving forward
- ✅ **Ask questions**: If something's unclear, ask Builder to explain
- ✅ **Iterate**: Request changes if something doesn't feel right
- ❌ **Don't skip tests**: Builder should write tests alongside code

---

### Step 3: Review the Code 🔍
**Agent**: Looker  
**Duration**: 30-60 minutes

#### What You Do
1. Builder marks feature as "Ready for Review" in `docs/CURRENT_TASK.md`
2. Load the Looker agent: Reference `cursor-prompts/looker.md`
3. Ask Looker to review the implementation
4. Address any issues found

#### What Looker Does
- Reviews functionality (does it work?)
- Checks code quality (is it maintainable?)
- Verifies testing (is it tested?)
- Audits performance (is it fast?)
- Validates accessibility (is it usable?)
- Checks security (is it safe?)

#### Example Prompt
```
@looker.md Please review the Mana Curve Visualization implementation.
The code is in:
- src/components/deck/ManaCurve.tsx
- src/hooks/useManaCalculation.ts
- src/lib/utils/manaCalculations.ts

Check against the plan in docs/CURRENT_TASK.md.
```

#### Looker Output Example
```markdown
## Code Review: Mana Curve Visualization

### ✅ Functionality - PASS
- Core feature works as specified
- All acceptance criteria met
- Edge cases handled

### ⚠️ Code Quality - WARNING
- ManaCurve component is 180 lines (good)
- Found one `any` type in chart config
- Consider extracting chart options to constant

### ✅ Testing - PASS
- 85% coverage
- All utility functions tested
- Component rendering tested

### ⚠️ Performance - WARNING  
- Calculations run on every render
- Recommend memoizing getManaCurve function

### Required Changes:
1. Remove `any` type in chart config
2. Add useMemo to manaCalculation hook

### Approved: YES (with minor fixes)
```

#### Handling Review Feedback
1. **Critical issues**: Must fix before shipping
2. **Important issues**: Should fix now or create follow-up task
3. **Minor suggestions**: Can address or document as tech debt

---

### Step 4: Update Documentation 📚
**Agent**: Pusher  
**Duration**: 15-30 minutes

#### What You Do
1. After Looker approval and fixes
2. Load the Pusher agent: Reference `cursor-prompts/pusher.md`
3. Ask Pusher to update relevant docs

#### What Pusher Does
- Updates `docs/CURRENT_TASK.md`
- Updates `docs/PROJECT_OVERVIEW.md` if needed
- Adds to CHANGELOG
- Updates README if user-facing
- Creates/updates API docs
- Adds code comments where helpful

#### Example Prompt
```
@pusher.md The Mana Curve Visualization feature is complete and reviewed.
Please update all relevant documentation.

Feature details:
- Added ManaCurve component
- New hook: useManaCalculation
- Real-time updates
- Accessible and responsive
```

#### Pusher Output
Updates multiple files:
- ✅ Marks task complete in CURRENT_TASK.md
- ✅ Adds feature to PROJECT_OVERVIEW.md
- ✅ Updates CHANGELOG.md with new feature
- ✅ Adds JSDoc comments to public APIs
- ✅ Updates README if needed

---

## 🎯 Common Scenarios

### Scenario 1: Quick Bug Fix
**Don't need full workflow**

```
# Just use Builder directly
@builder.md There's a bug in CardImage.tsx on line 47. 
When imageUrl is undefined, it crashes. Please fix with a fallback image.
```

Then quick Looker check:
```
@looker.md Quick review of the bug fix in CardImage.tsx
```

---

### Scenario 2: New Component (No Architecture)
**Skip Planner, use Builder + Looker**

```
@builder.md Create a loading spinner component:
- Name: LoadingSpinner
- Props: size ('sm' | 'md' | 'lg'), color (optional)
- Use Tailwind for styling
- Export from src/components/ui/LoadingSpinner.tsx
```

---

### Scenario 3: Large Feature (Full Workflow)
**Use all four agents**

1. **Planner**: Design the architecture
2. **Builder**: Implement in phases
3. **Looker**: Review each phase
4. **Pusher**: Document everything

Example: "Add Superbrew Analysis"
- This is complex: AI analyzes collection, finds buildable decks, calculates completion %
- Multiple components: Analysis engine, UI, caching
- MCP server integration needed
- Performance considerations (analyzing 1000+ cards)
- Needs comprehensive testing

---

### Scenario 4: Refactoring Existing Code
**Planner + Builder + Looker**

```
@planner.md The DeckBuilder component is 400 lines and hard to maintain.
Please create a plan to split it into smaller components.

Current structure: [paste or describe]
```

Then Builder implements, Looker reviews.

---

### Scenario 5: Documentation Update
**Just Pusher**

```
@pusher.md The API_DOCS.md is out of date. We added two new functions
to scryfall.ts: getCardsBySet and getRandomCard. Please update the docs.
```

---

## 🎨 Working with Each Agent

### Tips for Planner 🎨
- **Be specific about requirements**: What does success look like?
- **Provide context**: What exists already? What are constraints?
- **Mention non-functionals**: Performance? Accessibility? Mobile?
- **Ask questions**: Planner can help clarify requirements
- **Review the plan**: Don't let Builder start until you're happy

### Tips for Builder 🔨
- **Follow the plan**: Don't improvise major changes
- **Go step by step**: Implement incrementally
- **Write tests**: Don't skip testing
- **Ask for help**: If stuck, describe the issue
- **Manual test**: Run the code, don't just assume it works
- **Use examples**: "Make it work like component X"

### Tips for Looker 🔍
- **Review thoroughly**: Don't rubber-stamp
- **Be specific**: Point to exact lines/files
- **Explain why**: Help Builder learn
- **Prioritize feedback**: Critical vs. nice-to-have
- **Approve confidently**: If it's good, say so!

### Tips for Pusher 📚
- **Keep docs current**: Update as features ship
- **Write for humans**: Clear, scannable, helpful
- **Use examples**: Show, don't just tell
- **Link things**: Connect related docs
- **Check accuracy**: Make sure docs match code

---

## 📋 Quick Reference Prompts

### Start a Feature
```
@planner.md I want to add [feature description].
Current context: [what exists]
Requirements: [must-haves]
Please create an implementation plan.
```

### Implement Planned Feature
```
@builder.md Implement [feature name] per the plan in docs/CURRENT_TASK.md.
Let's start with [first step].
```

### Review Implementation
```
@looker.md Review [feature/file names].
Check against plan in docs/CURRENT_TASK.md.
Focus on [any specific concerns].
```

### Update Docs
```
@pusher.md Feature [name] is complete.
Update all relevant documentation.
Key changes: [summary of what changed].
```

---

## 🚀 Best Practices

### Do's ✅
- **Read the agent prompts**: They have detailed instructions
- **Reference existing code**: "Make it similar to X"
- **Work iteratively**: Small steps, frequent checks
- **Keep CURRENT_TASK.md updated**: Single source of truth
- **Run tests often**: Catch issues early
- **Communicate clearly**: Specific requests get better results

### Don'ts ❌
- **Don't skip planning** for complex features
- **Don't skip testing** or review
- **Don't ignore Looker feedback** without discussion
- **Don't let docs get stale**
- **Don't ask agents to do unrelated things**
- **Don't make major changes without updating the plan**

---

## 🐛 Troubleshooting

### "Builder wrote code that doesn't match the plan"
→ Remind Builder: "Please follow the plan in docs/CURRENT_TASK.md"

### "Planner's plan is too vague"
→ Ask for more detail: "Can you be more specific about [aspect]?"

### "Looker is too picky"
→ That's their job! But you can say: "Approve with suggestions" if minor

### "Pusher updated wrong docs"
→ Be specific: "Update CURRENT_TASK.md only, not README"

### "Agent seems confused"
→ Provide more context, reference existing code, or rephrase

---

## 📊 Success Metrics

You're using the workflow well when:
- ✅ Features are planned before implementation
- ✅ Code is reviewed before shipping
- ✅ Documentation stays current
- ✅ Fewer bugs reach production
- ✅ New contributors can onboard quickly
- ✅ Codebase remains maintainable

---

**Remember**: The agents are tools to help you build better software faster. Use them strategically, and don't be afraid to adapt the workflow to your needs!

For more details on each agent, see:
- [Agent Summary](./AGENT_SUMMARY.md) - Quick reference
- [Planner Agent](../cursor-prompts/planner.md) - Full prompt
- [Builder Agent](../cursor-prompts/builder.md) - Full prompt
- [Looker Agent](../cursor-prompts/looker.md) - Full prompt
- [Pusher Agent](../cursor-prompts/pusher.md) - Full prompt
