
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
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const NavLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
  <Link 
    href={href}
    onClick={onClick}
    className="flex items-center text-lg font-medium text-muted-foreground hover:text-foreground md:text-sm"
  >
    {children}
  </Link>
);


export function SiteHeader() {
  const { isAuthenticated, user, logout, isAdmin, isBarber } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    closeSheet();
  };

  const closeSheet = () => setIsSheetOpen(false);

  const renderNavLinks = () => (
    <>
      {isAuthenticated && !isAdmin && !isBarber && (
        <>
          <NavLink href="/book" onClick={closeSheet}>Réserver maintenant</NavLink>
          <NavLink href="/dashboard/appointments" onClick={closeSheet}>Mes rendez-vous</NavLink>
        </>
      )}
      {!isAuthenticated && (
        <NavLink href="/book" onClick={closeSheet}>Réserver maintenant</NavLink>
      )}
      {isAdmin && (
        <NavLink href="/admin" onClick={closeSheet}>Panneau d'administration</NavLink>
      )}
      {isBarber && (
        <NavLink href="/barber" onClick={closeSheet}>Mon horaire</NavLink>
      )}
    </>
  );

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
            <BarberPole className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">Shear Genius</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {renderNavLinks()}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
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
                   <DropdownMenuItem onClick={() => router.push('/admin/profile')}>Mon profil</DropdownMenuItem>
                ) : isBarber ? (
                   <DropdownMenuItem onClick={() => router.push('/barber/profile')}>Mon profil</DropdownMenuItem>
                ) : (
                   <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>Mon profil</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <nav className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">S'inscrire</Link>
                </Button>
            </nav>
          )}

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 pt-8">
                {renderNavLinks()}
                <hr />
                {!isAuthenticated && (
                   <div className="flex flex-col gap-4">
                     <Button variant="outline" asChild onClick={closeSheet}>
                       <Link href="/login">Connexion</Link>
                     </Button>
                     <Button asChild onClick={closeSheet}>
                       <Link href="/signup">S'inscrire</Link>
                     </Button>
                   </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
