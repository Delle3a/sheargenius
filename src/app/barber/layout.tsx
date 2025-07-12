"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export default function BarberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isBarber, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && !isBarber) {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    }
  }, [isBarber, isAuthenticated, user, router]);

  if (!isBarber) {
    return (
      <div className="container flex items-center justify-center h-screen">
        <p>Checking credentials...</p>
      </div>
    );
  }
  
  const navItems = [
    { href: "/barber", label: "My Schedule", icon: Calendar },
    { href: "/barber/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-10">
        <aside>
          <h2 className="text-2xl font-bold font-headline mb-4">Barber Dashboard</h2>
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <Button
                key={item.label}
                variant={pathname === item.href ? "default" : "ghost"}
                asChild
                className="justify-start gap-2"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
