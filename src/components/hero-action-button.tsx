
"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function HeroActionButton() {
  const { isAuthenticated, isAdmin, isBarber } = useAuth();

  let href = "/book";
  let text = "Réserver maintenant";

  if (isAuthenticated) {
    if (isAdmin) {
      href = "/admin";
      text = "Panneau d'administration";
    } else if (isBarber) {
      href = "/barber";
      text = "Mon horaire";
    }
  }


  return (
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Link href={href}>{text}</Link>
    </Button>
  );
}
