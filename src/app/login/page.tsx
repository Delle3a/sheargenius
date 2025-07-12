"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = (role: 'customer' | 'admin' | 'barber') => {
    login(role);
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'barber') {
      router.push('/barber');
    } else {
      router.push('/dashboard/appointments');
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account. For this demo, you can log in as a customer, barber, or admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" defaultValue="demo@example.com" disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" defaultValue="password" disabled />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={() => handleLogin('customer')}>
            Login as Customer
          </Button>
           <Button className="w-full" variant="secondary" onClick={() => handleLogin('barber')}>
            Login as Barber
          </Button>
          <Button className="w-full" variant="outline" onClick={() => handleLogin('admin')}>
            Login as Admin
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
