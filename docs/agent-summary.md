# Agent Summary - Quick Reference

**Fast reference for using the agent system**

---

## 🎭 The Four Agents

| Agent | Role | When to Use | Prompt File |
|-------|------|-------------|-------------|
| 🎨 **Planner** | Architect | New features, complex changes | `cursor-prompts/planner.md` |
| 🔨 **Builder** | Developer | Write code, implement features | `cursor-prompts/builder.md` |
| 🔍 **Looker** | Reviewer | Code review, quality check | `cursor-prompts/looker.md` |
| 📚 **Pusher** | Writer | Update documentation | `cursor-prompts/pusher.md` |

---

## ⚡ Quick Start Templates

### New Feature (Full Workflow)
```bash
# 1. Plan it
@planner.md I need git-style staging for deck changes. 
Requirements: stage changes, review diff, commit with message, history view.
Context: Using Supabase real-time. Please create implementation plan.

# 2. Build it  
@builder.md Implement git-style staging per docs/CURRENT_TASK.md.
Start with useStagingArea hook.

# 3. Review it
@looker.md Review StagingArea.tsx and useStagingArea.ts.
Check staging flow and commit logic.

# 4. Document it
@pusher.md Git-style staging is done. Update docs with usage examples.
```

### Bug Fix (Fast Track)
```bash
# Build
@builder.md Fix bug in [file] line [N]: [description]

# Review
@looker.md Quick review of bug fix in [file]
```

### Documentation Update
```bash
@pusher.md Update docs for [change]. Files: [list]
```

---

## 🎨 Planner Cheat Sheet

**Use for**: Features, architecture, refactoring, complex changes

**Typical Flow**:
1. Describe what you want
2. Provide context (existing code, constraints)
3. Get comprehensive plan
4. Review and refine
5. Plan saved to `docs/CURRENT_TASK.md`

**Example**:
```
@planner.md Add superbrew analysis showing:
- Decks user can build with their collection
- Popular decks they're close to completing (% complete)
- Missing pieces with prices
- Budget alternatives

Must work with existing Supabase collection schema.
Should cache results for performance.
```

**Output**: Complete plan with AI analysis engine, UI components, caching strategy

---

## 🔨 Builder Cheat Sheet

**Use for**: Writing code, implementing features, fixing bugs

**Best Practices**:
- Work incrementally (one component at a time)
- Follow the plan from Planner
- Write tests alongside code
- Handle edge cases
- Ask questions if stuck

**Example**:
```
@builder.md Implement git-style staging from plan.
Requirements:
- useStagingArea hook with stage/commit/rollback
- StagingArea component showing diffs
- Integrate with Supabase deck_history table
- Real-time updates on commit
```

**Builder will**:
- Create typed hooks and components
- Add Supabase integration
- Write tests for staging logic
- Follow shadcn/ui patterns
- Handle edge cases (conflicts, errors)

---

## 🔍 Looker Cheat Sheet

**Use for**: Code review, quality assurance, catching issues

**Review Layers**:
1. ✅ Functionality - Does it work?
2. 🎯 Code Quality - Is it maintainable?
3. 🧪 Testing - Is it tested?
4. ⚡ Performance - Is it fast?
5. ♿ Accessibility - Is it usable?
6. 🔒 Security - Is it safe?

**Example**:
```
@looker.md Review src/components/staging/StagingArea.tsx
and src/hooks/useStagingArea.ts.
Check git-style flow, Supabase integration, and error handling.
```

**Looker provides**:
- Pass/warning/fail for each layer
- Specific issues: "Staging doesn't validate deck before commit"
- Required vs. suggested changes
- Approval status: "Needs changes - add validation"

---

## 📚 Pusher Cheat Sheet

**Use for**: Updating documentation, keeping knowledge fresh

**Updates**:
- PROJECT_OVERVIEW.md (vision, features)
- CURRENT_TASK.md (progress, status)
- API_DOCS.md (API changes)
- CHANGELOG.md (version history)
- README.md (user-facing)
- Code comments (complex logic)

**Example**:
```
@pusher.md Feature complete: Git-Style Deck Staging
- Hook: useStagingArea with stage/commit/rollback
- Component: StagingArea with diff UI
- Supabase: deck_history table integration
- Real-time updates working

Update all relevant docs and create commit message.
```

**Pusher will**:
- Mark tasks complete in CURRENT_TASK.md
- Update feature list in PROJECT_OVERVIEW.md
- Add to CHANGELOG.md
- Write commit message: "feat(staging): add git-style deck validation"
- Document git-style flow for future reference

---

## 🔄 Decision Tree

```
Need to...
│
├─ Start new feature?
│  └─> Use Planner first
│
├─ Implement code?
│  └─> Use Builder (follow plan if exists)
│
├─ Fix small bug?
│  └─> Use Builder directly
│
├─ Review code?
│  └─> Use Looker
│
├─ Update docs?
│  └─> Use Pusher
│
└─ Refactor code?
   └─> Planner (plan) → Builder (do) → Looker (check)
```

---

## 📊 Complexity Guide

### Tiny (< 1 hour)
- Small bug fixes
- Minor UI tweaks
- Documentation updates

**Workflow**: Builder only (+ quick Looker check)

### Small (1-3 hours)
- New UI component
- Simple feature
- Utility function

**Workflow**: Builder → Looker

### Medium (3-8 hours)
- Complex component
- Feature with multiple files
- Integration work

**Workflow**: Planner → Builder → Looker

### Large (8+ hours)
- Major feature
- Architecture change
- System integration

**Workflow**: Planner → Builder (phases) → Looker (per phase) → Pusher

---

## 🎯 Quality Checklist

Before considering feature "done":

- [ ] ✅ **Planned** (if needed)
- [ ] ✅ **Implemented** by Builder
- [ ] ✅ **Tests written** and passing
- [ ] ✅ **Reviewed** by Looker
- [ ] ✅ **Issues addressed**
- [ ] ✅ **Docs updated** by Pusher
- [ ] ✅ **Manual testing** completed
- [ ] ✅ **No TypeScript errors**
- [ ] ✅ **No ESLint warnings**

---

## 💡 Pro Tips

### Planner Tips
- ✅ Be specific about requirements
- ✅ Mention edge cases you know about
- ✅ Provide examples of similar features
- ✅ Review plan before approving

### Builder Tips
- ✅ Implement incrementally
- ✅ Test as you go
- ✅ Follow existing patterns
- ✅ Ask questions early

### Looker Tips
- ✅ Review thoroughly
- ✅ Prioritize feedback (critical vs. minor)
- ✅ Explain the "why" behind suggestions
- ✅ Acknowledge good work

### Pusher Tips
- ✅ Update docs immediately after features ship
- ✅ Keep examples current
- ✅ Make docs scannable
- ✅ Check for broken links

---

## 🚫 Common Mistakes

| Mistake | Impact | Solution |
|---------|--------|----------|
| Skipping planning for complex features | Messy code, rework | Use Planner first |
| No tests written | Bugs in production | Builder writes tests always |
| Ignoring Looker feedback | Technical debt | Address critical issues |
| Stale documentation | Team confusion | Pusher updates after each feature |
| Not following plan | Inconsistent architecture | Reference CURRENT_TASK.md |

---

## 📁 File Quick Reference

| File | Purpose | Updated By |
|------|---------|------------|
| `docs/PROJECT_OVERVIEW.md` | Project vision, architecture | Pusher |
| `docs/CURRENT_TASK.md` | Active work, roadmap | All agents |
| `docs/WORKFLOW_GUIDE.md` | How to use agents | Pusher |
| `docs/AGENT_SUMMARY.md` | This file | Pusher |
| `cursor-prompts/*.md` | Agent instructions | Manual edit |
| `.cursorrules` | Project standards | Manual edit |

---

## 🔗 Links

- **Full Workflow**: See [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)
- **Project Details**: See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **Current Work**: See [CURRENT_TASK.md](./CURRENT_TASK.md)
- **Agent Prompts**: See `cursor-prompts/` directory

---

## 🎓 Learning Path

**Week 1**: Use Planner → Builder → Looker for everything
- Get familiar with each agent's strengths
- Learn what good plans look like
- Understand review criteria

**Week 2**: Start shortcuts for simple tasks
- Use Builder directly for small changes
- Quick Looker reviews for minor updates
- Skip Planner for obvious implementations

**Week 3**: Master the workflow
- Know when to use full vs. partial workflow
- Agents become natural extensions of your process
- Focus on building, let agents handle process

---

**Print this page and keep it handy for the first week!**

For detailed information, read [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)
