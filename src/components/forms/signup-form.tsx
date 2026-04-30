"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, SUPABASE_SETUP_MESSAGE } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(formData: FormData) {
    try {
      setLoading(true);
      setMessage("");
      if (!isSupabaseConfigured()) {
        setMessage(SUPABASE_SETUP_MESSAGE);
        setLoading(false);
        return;
      }

      const fullName = String(formData.get("full_name") || "");
      const email = String(formData.get("email") || "");
      const phone = String(formData.get("phone") || "");
      const password = String(formData.get("password") || "");
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Account created. Check your email if confirmation is enabled, then log in.");
      setLoading(false);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Signup failed. Check Supabase configuration.");
      setLoading(false);
    }
  }

  return (
    <form action={handleSignup} className="grid gap-4 rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold text-[#162026]">Carrier Account Signup</h1>
      <p className="text-sm leading-6 text-[#40515a]">
        Create a carrier login for the Atlas portal. Broker checks and load uploads unlock after your carrier account is
        onboarded.
      </p>
      <Input name="full_name" placeholder="Full name" required />
      <Input name="phone" placeholder="Phone" />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" minLength={6} required />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create carrier account"}
      </Button>
      <Link href="/login" className="text-sm text-[#0a7c86] underline underline-offset-4">
        Already have an account? Login
      </Link>
      {message ? <p className="text-sm text-[#40515a]">{message}</p> : null}
    </form>
  );
}
