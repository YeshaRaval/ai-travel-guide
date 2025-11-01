'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Plane, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27]">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Welcome Card */}
        <div className="hidden md:flex flex-col items-center justify-center animate-slide-in-up">
          <div className="w-full glass rounded-3xl p-12 text-center">
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto mb-6 flex items-center justify-center">
                <img
                  src="/globe.gif"
                  alt="Globe Animation"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-4">Welcome Back!</h2>
            <p className="text-gray-400 text-lg mb-6">
              Continue your journey with AI-powered travel planning
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Personalized itineraries</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>AI travel assistant</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Save & edit your trips</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="glass rounded-3xl p-8 sm:p-12 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Plane className="w-10 h-10 text-primary mr-3" />
            <span className="text-3xl font-bold gradient-text">TravelAI</span>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-gray-400 text-center mb-8">Access your personalized itineraries</p>

          {error && (
            <div className="mb-6 p-4 glass rounded-xl border border-red-500/50 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-surface text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-gray-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary-hover transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
