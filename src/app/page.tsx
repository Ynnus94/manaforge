export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          🃏 MTG Deck Builder
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          The future of Magic: The Gathering deck building with AI superpowers
        </p>
        
        <div className="grid text-center lg:grid-cols-3 gap-4 mb-8">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🎯 Git-Style Validation
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Stage changes, review, commit. You're always in control.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🧠 Superbrew Analysis
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              AI finds decks you can build with your collection.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🚀 Real-Time Updates
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Live collaboration powered by Supabase.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Ready to start building? Check{' '}
            <code className="font-mono font-bold">docs/CURRENT_TASK.md</code>{' '}
            for Week 1 tasks.
          </p>
        </div>
      </div>
    </main>
  );
}
