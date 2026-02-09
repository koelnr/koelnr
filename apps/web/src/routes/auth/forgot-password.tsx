import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/logo";
import { getFirebaseError } from "@/lib/utils";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo className="h-10" />
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>
              {sent
                ? "Check your email for a reset link"
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>

          {!sent ? (
            <CardContent>
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
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We sent a reset link to <span className="font-medium text-foreground">{email}</span>.
                If you don&apos;t see it, check your spam folder.
              </p>
            </CardContent>
          )}

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Back to{" "}
              <Link
                to="/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
