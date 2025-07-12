"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { BarberPole } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { isAuthenticated, user, logout, isAdmin, isBarber } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <BarberPole className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">Shear Genius</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {!isAdmin && !isBarber && (
               <Link href="/book" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                Book Now
              </Link>
            )}
            {isAuthenticated && !isAdmin && !isBarber && (
              <Link href="/dashboard/appointments" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                My Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                Admin Panel
              </Link>
            )}
            {isBarber && (
              <Link href="/barber" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                My Schedule
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {isAuthenticated ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                     <DropdownMenuItem onClick={() => router.push('/admin/profile')}>My Profile</DropdownMenuItem>
                  ) : isBarber ? (
                     <DropdownMenuItem onClick={() => router.push('/barber')}>My Schedule</DropdownMenuItem>
                  ) : (
                     <DropdownMenuItem onClick={() => router.push('/dashboard/appointments')}>My Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
