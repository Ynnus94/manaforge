# Agent Summary

Quick reference for AI agents in this project.

## Available Agents

| Agent | File | Purpose | When to Use |
|-------|------|---------|-------------|
| 🎯 Planner | `@planner.md` | Feature planning & task breakdown | Before starting new features |
| 🔨 Builder | `@builder.md` | Feature implementation | When implementing code |
| 👀 Reviewer | `@looker.md` | Code review & analysis | After implementation or when debugging |
| 📝 Documenter | `@pusher.md` | Documentation updates | After completing features |

## Quick Commands

### Planning
```bash
@planner.md Add [feature]
@planner.md Break down [complex task]
```

### Building
```bash
@builder.md Implement [feature] per CURRENT_TASK.md
@builder.md Create [component/file]
@builder.md Fix [issue]
```

### Reviewing
```bash
@looker.md Review [file/feature]
@looker.md Explain [code/pattern]
@looker.md Debug [issue]
```

### Documenting
```bash
@pusher.md Feature complete: [feature name]
@pusher.md Update docs after [changes]
```

## Workflow Examples

### New Feature
```
@planner.md → @builder.md → @looker.md → @pusher.md
```

### Bug Fix
```
@looker.md (identify) → @builder.md (fix) → @looker.md (verify)
```

### Quick Change
```
@builder.md (implement small change)
```

## Remember
- Agents read project documentation
- Always keep docs updated
- Use specific, clear instructions
- Reference file paths when possible

