# Workflow Guide

## Working with AI Agents

This project uses specialized AI agent prompts to streamline development. Each agent has a specific role.

### Agent Files (in `/cursor-prompts/`)

#### 1. `@planner.md` - The Planner
**When to use**: Planning new features or breaking down complex tasks

**Example**:
```
@planner.md I need to add a deck builder interface with drag-and-drop
```

**What it does**:
- Analyzes the request
- Breaks down into subtasks
- Creates implementation plan
- Updates `docs/CURRENT_TASK.md`

#### 2. `@builder.md` - The Builder
**When to use**: Implementing features based on the plan

**Example**:
```
@builder.md Implement the deck builder UI per docs/CURRENT_TASK.md
```

**What it does**:
- Reads current task documentation
- Implements the feature
- Follows project conventions
- Creates necessary files

#### 3. `@looker.md` - The Reviewer
**When to use**: Reviewing code quality and consistency

**Example**:
```
@looker.md Review the deck builder components
```

**What it does**:
- Checks code quality
- Ensures consistency
- Identifies potential issues
- Suggests improvements

#### 4. `@pusher.md` - The Documenter
**When to use**: After completing features to update documentation

**Example**:
```
@pusher.md Feature complete: deck builder with drag-and-drop
```

**What it does**:
- Updates documentation
- Marks tasks as complete
- Creates new task items
- Maintains project knowledge

## Development Workflow

### Standard Flow

1. **Plan** 📋
   ```
   @planner.md Add [feature description]
   ```

2. **Build** 🔨
   ```
   @builder.md Implement [feature] per docs/CURRENT_TASK.md
   ```

3. **Review** 👀
   ```
   @looker.md Review [files/feature]
   ```

4. **Document** 📝
   ```
   @pusher.md Feature done: [feature name]
   ```

### Quick Fixes

For small changes, you can skip the planner:
```
@builder.md Fix the button styling on the landing page
```

### Exploratory Work

When you need to understand the codebase:
```
@looker.md Explain how the deck state management works
```

## Best Practices

### DO:
- ✅ Use agents in sequence for complex features
- ✅ Reference documentation in prompts
- ✅ Be specific about what you want
- ✅ Update docs after major changes

### DON'T:
- ❌ Skip the planner for complex features
- ❌ Make changes without updating docs
- ❌ Use vague instructions
- ❌ Ignore the reviewer's suggestions

## Common Patterns

### Adding a New Feature
```bash
# 1. Plan it
@planner.md Add user profile page with avatar upload

# 2. Check the plan
# Read docs/CURRENT_TASK.md to see the breakdown

# 3. Build it
@builder.md Implement user profile per current task

# 4. Review it
@looker.md Review profile components and API routes

# 5. Document it
@pusher.md User profile feature complete
```

### Debugging
```bash
# 1. Identify the issue
@looker.md Why isn't the deck saving to the database?

# 2. Fix it
@builder.md Fix the deck save functionality based on the issue found

# 3. Verify
@looker.md Verify the deck save functionality works correctly
```

### Refactoring
```bash
# 1. Plan the refactor
@planner.md Refactor deck components to use composition pattern

# 2. Get review before starting
@looker.md Review current deck component structure

# 3. Execute refactor
@builder.md Refactor per plan in CURRENT_TASK.md

# 4. Verify
@looker.md Review refactored deck components
```

## Tips

- **Be Specific**: Instead of "add a button", say "add a primary button to save deck changes in the deck builder"
- **Reference Files**: "Update the DeckCard component in src/components/deck/DeckCard.tsx"
- **Follow the Plan**: When building, always reference the current task documentation
- **Keep Docs Updated**: Documentation is your project memory

## Emergency Recovery

If you get lost:
```bash
# 1. Get current state
@looker.md What's the current state of the project?

# 2. Review docs
# Read docs/PROJECT_OVERVIEW.md and docs/CURRENT_TASK.md

# 3. Reset focus
@planner.md Review current progress and create next steps
```

