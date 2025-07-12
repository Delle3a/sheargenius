
"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useTranslation } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export function HeroActionButton() {
  const { isAuthenticated, isAdmin, isBarber } = useAuth();
  const { t } = useTranslation();

  let href = "/book";
  let text = t('bookNow');

  if (isAuthenticated) {
    if (isAdmin) {
      href = "/admin";
      text = t('adminPanel');
    } else if (isBarber) {
      href = "/barber";
      text = t('mySchedule');
    }
  }


  return (
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Link href={href}>{text}</Link>
    </Button>
  );
}
