# Development Guide

## Repository Information

**Git Repository**: `git@github.com:Ynnus94/manaforge.git`

```bash
# Clone the repository
git clone git@github.com:Ynnus94/manaforge.git
cd manaforge
```

## Initial Setup

### Prerequisites
- Node.js 20+ (recommended: use nvm)
- npm or pnpm
- Git
- Supabase account
- Anthropic API key (for AI features)

### Environment Setup

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (for AI features)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: For development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Initialize shadcn/ui components**
```bash
npx shadcn-ui@latest init
```

4. **Run development server**
```bash
npm run dev
```

Visit http://localhost:3000

## Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(deck): add mana curve visualization
fix(collection): correct CSV import validation
docs(readme): add deployment instructions
refactor(hooks): extract staging logic to useStagingArea
```

### Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/deck-builder
```

2. **Make changes and commit regularly**
```bash
git add .
git commit -m "feat(deck): add card search functionality"
```

3. **Keep branch updated**
```bash
git fetch origin
git rebase origin/main
```

4. **Push your branch**
```bash
git push origin feature/deck-builder
```

5. **Create Pull Request**
- Use PR template (if available)
- Reference related issues
- Request review from team

## Code Quality

### Before Committing

Run these checks:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Tests
npm test
```

### Pre-Commit Checklist
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code formatted with Prettier
- [ ] Tests passing
- [ ] No console.logs (except in debug utilities)

## Supabase Setup

### Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema documentation.

1. **Create Supabase project** at https://supabase.com

2. **Run SQL migrations** from `docs/DATABASE_SCHEMA.md`:
   - Open Supabase SQL Editor
   - Copy and run table creation SQL
   - Apply Row Level Security policies
   - Create indexes and triggers

3. **Generate TypeScript types**:
```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/types.ts
```

4. **Verify connection** at `/test-connection`

### Row Level Security (RLS)

Ensure RLS policies are enabled for all tables:
- Users can only access their own data
- No need to manually filter by `user_id` in queries
- RLS handles security automatically

## Scryfall API

### Rate Limits
- 10 requests per second
- Use caching to minimize calls
- Batch requests when possible

### Best Practices
```typescript
// ✅ GOOD: Debounced search
const debouncedQuery = useDebounce(query, 300);

// ✅ GOOD: Cache results
const { data } = useQuery({
  queryKey: ['cards', query],
  queryFn: () => searchCards(query),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// ✅ GOOD: Batch fetch
const cards = await fetch('https://api.scryfall.com/cards/collection', {
  method: 'POST',
  body: JSON.stringify({ identifiers: ids })
});
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Writing Tests

```typescript
// Unit test example
import { calculateManaCurve } from './manaCalculations';

describe('calculateManaCurve', () => {
  it('calculates correct distribution', () => {
    const cards = [
      { cmc: 1, quantity: 10 },
      { cmc: 2, quantity: 8 },
    ];
    
    const curve = calculateManaCurve(cards);
    expect(curve).toEqual({ 1: 10, 2: 8 });
  });
});

// Component test example
import { render, screen } from '@testing-library/react';
import { CardGrid } from './CardGrid';

describe('CardGrid', () => {
  it('renders cards correctly', () => {
    const cards = [{ id: '1', name: 'Lightning Bolt' }];
    render(<CardGrid cards={cards} />);
    expect(screen.getByText('Lightning Bolt')).toBeInTheDocument();
  });
});
```

## Debugging

### Next.js Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Node inspector
NODE_OPTIONS='--inspect' npm run dev
```

### Supabase Debugging
```typescript
// Enable query logging
const { data, error } = await supabase
  .from('decks')
  .select('*')
  .explain(); // Shows query plan
```

### React DevTools
- Install React DevTools browser extension
- Use Profiler to identify performance issues
- Check component tree and props

## Performance

### Bundle Analysis
```bash
npm run build
npm run analyze
```

### Optimization Checklist
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code splitting for routes
- [ ] Memoization for expensive calculations
- [ ] Virtual scrolling for long lists
- [ ] API response caching
- [ ] Debounced inputs

## Deployment

### Vercel (Recommended)

1. **Connect repository**
```bash
vercel login
vercel link
```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
```bash
vercel --prod
```

### Environment Variables (Production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Troubleshooting

### Common Issues

**Supabase connection fails**
```bash
# Check environment variables
cat .env.local

# Test connection
npm run dev
# Visit /test-connection
```

**TypeScript errors**
```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id YOUR_ID > src/lib/supabase/types.ts

# Clear cache
rm -rf .next
npm run dev
```

**Build fails**
```bash
# Check for type errors
npm run type-check

# Check for lint errors
npm run lint

# Clear and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Scryfall API](https://scryfall.com/docs/api)
- [shadcn/ui](https://ui.shadcn.com/)

### Project Documentation
- [Project Overview](./PROJECT_OVERVIEW.md)
- [Current Tasks](./CURRENT_TASK.md)
- [Workflow Guide](./WORKFLOW_GUIDE.md)
- [API Documentation](./API_DOCS.md)
- [Database Schema](./DATABASE_SCHEMA.md)

## Contributing

### Code Review Process
1. Create feature branch
2. Implement changes
3. Run all quality checks
4. Push and create PR
5. Address review feedback
6. Merge after approval

### Getting Help
- Check project documentation first
- Ask in team chat/discussions
- Use AI agents for guidance:
  - `@planner.md` for feature planning
  - `@builder.md` for implementation
  - `@looker.md` for code review
  - `@pusher.md` for documentation

---

**Built with 🦄 unicorn-grade standards**

