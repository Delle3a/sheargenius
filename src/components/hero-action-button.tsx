"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function HeroActionButton() {
  const { isAuthenticated, isAdmin } = useAuth();

  const href = isAuthenticated && isAdmin ? "/admin" : "/book";
  const text = isAuthenticated && isAdmin ? "Go to Admin Panel" : "Book Now";

  return (
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Link href={href}>{text}</Link>
    </Button>
  );
}
