import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">🃏 MTG Deck Builder</h1>
          <p className="text-muted-foreground text-sm">
            The future of deck building with AI superpowers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="login" />

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{' '}
              </span>
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

