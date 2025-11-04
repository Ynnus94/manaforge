/**
 * Test page to verify Supabase connection
 * 
 * Visit http://localhost:3000/test-connection after starting dev server
 * 
 * This is a simple check that your environment variables are set correctly.
 * Once confirmed working, you can delete this file.
 */
export default function TestConnectionPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const hasUrl = !!url;
  const hasKey = !!key;
  const connectionStatus = hasUrl && hasKey ? 'Configured ✅' : 'Not Configured ❌';
  
  // Extract project reference from URL
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = match ? match[1] : 'unknown';
  
  let errorMessage = '';
  if (!hasUrl) errorMessage = 'NEXT_PUBLIC_SUPABASE_URL is not set';
  if (!hasKey) errorMessage = 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set';
  if (!hasUrl && !hasKey) errorMessage = 'Both environment variables are missing';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            🔌 Supabase Connection Test
          </h1>
          <p className="text-muted-foreground">
            Testing connection to your Supabase project
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Status:</span>
            <span className="text-lg">{connectionStatus}</span>
          </div>

          {projectRef && (
            <div className="flex items-center justify-between">
              <span className="font-semibold">Project:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {projectRef}
              </code>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-semibold">URL:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded truncate max-w-xs">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </code>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Key:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...`
                : 'Not set'}
            </code>
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="font-semibold text-destructive mb-2">Error:</p>
              <code className="text-sm">{errorMessage}</code>
            </div>
          )}

          {connectionStatus === 'Configured ✅' && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-700 dark:text-green-300">
                ✅ Success! Supabase environment variables are configured.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You can now proceed to create your database schema in Supabase.
              </p>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <a
            href="/"
            className="inline-block text-sm text-primary hover:underline"
          >
            ← Back to Home
          </a>
          <br />
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-muted-foreground hover:underline"
          >
            Open Supabase Dashboard →
          </a>
        </div>
      </div>
    </main>
  );
}

