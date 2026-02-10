"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFirebaseError } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);

    try {
      const { auth } = await import("@/lib/firebase");
      await sendPasswordResetEmail(auth, emailValue);
      setSent(true);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getFirebaseError(err.code));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">
        We sent a reset link to{" "}
        <span className="font-medium text-foreground">{email}</span>. If you
        don&apos;t see it, check your spam folder.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
