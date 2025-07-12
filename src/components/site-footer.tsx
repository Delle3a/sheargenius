import Link from "next/link";
import { BarberPole } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <BarberPole className="h-6 w-6 text-primary" />
            <p className="text-lg font-bold font-headline">Shear Genius</p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/#services" className="hover:text-foreground">Services</Link>
            <Link href="/#barbers" className="hover:text-foreground">Barbers</Link>
            <Link href="/book" className="hover:text-foreground">Book Now</Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Shear Genius. All rights reserved.</p>
          <p className="mt-1">123 Classic Cut, Styleburg, 45678</p>
        </div>
      </div>
    </footer>
  );
}
