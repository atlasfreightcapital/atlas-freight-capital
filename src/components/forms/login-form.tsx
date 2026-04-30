"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, SUPABASE_SETUP_MESSAGE } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEmailPassword(formData: FormData) {
    try {
      setLoading(true);
      setMessage("");
      if (!isSupabaseConfigured()) {
        setMessage(SUPABASE_SETUP_MESSAGE);
        setLoading(false);
        return;
      }
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      router.push("/auth/redirect");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed. Check Supabase configuration.");
      setLoading(false);
    }
  }

  async function sendMagicLink() {
    try {
      setLoading(true);
      setMessage("");
      if (!isSupabaseConfigured()) {
        setMessage(SUPABASE_SETUP_MESSAGE);
        setLoading(false);
        return;
      }
      const email = (document.getElementById("email") as HTMLInputElement | null)?.value;
      if (!email) {
        setMessage("Enter email first.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      setMessage(error ? error.message : "Magic link sent.");
      setLoading(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Magic link failed. Check Supabase configuration.");
      setLoading(false);
    }
  }

  return (
    <form action={handleEmailPassword} className="grid gap-4 rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold text-[#162026]">Atlas Account Login</h1>
      <Input id="email" name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />
      <Button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>
      <button
        type="button"
        onClick={sendMagicLink}
        className="text-left text-sm text-[#0a7c86] underline underline-offset-4"
      >
        Send magic link
      </button>
      <Link href="/signup" className="text-sm text-[#0a7c86] underline underline-offset-4">
        Create carrier account
      </Link>
      <p className="text-sm text-[#40515a]">{message}</p>
    </form>
  );
}
