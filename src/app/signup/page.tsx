"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowser();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding");
  };

  return (
    <ThemeProvider>
      <CustomCursor />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-0 text-2xl font-bold tracking-tight mb-12 justify-center">
            <span className="text-text">RG</span>
            <span className="text-blue">.</span>
            <span className="text-text">DEVS</span>
          </Link>

          <div className="bg-card border border-border p-8">
            <div className="mb-8">
              <span className="font-mono text-blue text-xs tracking-wider">
                / SIGN UP
              </span>
              <h1 className="font-anton text-3xl uppercase mt-2 text-text">
                Get <span className="text-blue">Started.</span>
              </h1>
              <p className="text-offwhite text-xs mt-2">
                Invited by the RG Devs team? Create your account below.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs font-mono">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors duration-300 disabled:opacity-50 mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link
                href="/login"
                className="block text-xs text-offwhite hover:text-blue transition-colors font-mono"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
