"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    needs: "",
    preferred_colors: "",
    domain: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("contacts").insert([
        {
          name: form.business_name,
          email: user.email || "",
          message: `Onboarding:\nNeeds: ${form.needs}\nColors: ${form.preferred_colors}\nDomain: ${form.domain}`,
        },
      ]);
    }

    router.push("/dashboard");
  };

  return (
    <ThemeProvider>
      <CustomCursor />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-12">
            <span className="text-text text-2xl font-bold">RG</span>
            <span className="text-blue text-2xl font-bold">.</span>
            <span className="text-text text-2xl font-bold">DEVS</span>
          </div>

          <div className="bg-card border border-border p-8">
            <div className="mb-8">
              <span className="font-mono text-blue text-xs tracking-wider">
                / ONBOARDING
              </span>
              <h1 className="font-anton text-3xl uppercase mt-2 text-text">
                Tell Us About
                <br />
                <span className="text-blue">Your Project.</span>
              </h1>
              <p className="text-offwhite text-xs mt-2">
                Help us understand what you need. We&apos;ll follow up within 24h.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={form.business_name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, business_name: e.target.value }))
                  }
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  What do you need?
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.needs}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, needs: e.target.value }))
                  }
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors resize-none"
                  placeholder="Website, web app, ERP system, booking platform..."
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  Preferred Colors / Brand Style
                </label>
                <input
                  type="text"
                  value={form.preferred_colors}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      preferred_colors: e.target.value,
                    }))
                  }
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors"
                  placeholder="e.g. Blue and white, modern, minimal"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-offwhite tracking-wider uppercase mb-2">
                  Domain (if purchased)
                </label>
                <input
                  type="text"
                  value={form.domain}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, domain: e.target.value }))
                  }
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none transition-colors"
                  placeholder="e.g. mybusiness.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors duration-300 disabled:opacity-50 mt-2"
              >
                {loading ? "Submitting..." : "Submit & Go to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
