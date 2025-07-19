
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("client@test.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.push('/admin');
      } else if (user?.role === 'barber') {
        router.push('/barber');
      } else {
        router.push('/dashboard/appointments');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const loggedInUser = await login(email, password);
       if (loggedInUser.role === 'admin') {
        router.push('/admin');
      } else if (loggedInUser.role === 'barber') {
        router.push('/barber');
      } else {
        router.push('/dashboard/appointments');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur de connexion",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Connexion</CardTitle>
            <CardDescription>
              Entrez votre e-mail ci-dessous pour vous connecter à votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">
              Se connecter
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>Ou utilisez un compte de démonstration :</p>
              <Button variant="link" size="sm" onClick={() => { setEmail('client@test.com'); setPassword('password'); }}>Client</Button>
              |
              <Button variant="link" size="sm" onClick={() => { setEmail('coiffeur@test.com'); setPassword('password'); }}>Coiffeur</Button>
              |
              <Button variant="link" size="sm" onClick={() => { setEmail('admin@test.com'); setPassword('password'); }}>Admin</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
