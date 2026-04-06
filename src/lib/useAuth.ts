"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "./supabase-browser";
import { Profile } from "./types";
import { User } from "@supabase/supabase-js";

export function useAuth(requiredRole?: "admin" | "client") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const init = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      setUser(authUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);

        // Role-based redirect
        if (requiredRole === "admin" && profileData.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        if (requiredRole === "client" && profileData.role === "admin") {
          // Admins can still view client dashboard, no redirect
        }
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, requiredRole]);

  const signOut = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return { user, profile, loading, signOut };
}
