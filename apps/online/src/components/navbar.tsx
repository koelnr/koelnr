"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import type { SiteConfig } from "@/config/site";
import Logo from "@/assets/logo";

export function Navbar({ config }: { config: SiteConfig }) {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 text-xl font-bold tracking-tight"
        >
          <Logo className="size-10" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {config.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}

          {!loading && (
            <div className="ml-4 flex items-center gap-2">
              {user ? (
                <>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/dashboard" className="gap-1.5">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="size-4" />
                      )}
                      {user.displayName || user.email?.split("@")[0]}
                    </Link>
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => signOut()}
                    aria-label="Sign out"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/sign-up">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-border/40 bg-background px-4 pb-4 md:hidden">
          {config.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          {!loading && (
            <div className="mt-2 grid gap-2">
              {user ? (
                <>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="size-4" />
                      )}
                      {user.displayName || user.email?.split("@")[0]}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/sign-up" onClick={() => setOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
