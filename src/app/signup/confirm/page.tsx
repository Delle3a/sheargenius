
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, Loader2, AlertCircle } from 'lucide-react';
import { getUsers, updateUser } from '@/lib/firebase/users';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      setStatus('loading');
      const verifyToken = async () => {
        try {
          const allUsers = await getUsers();
          const userToVerify = allUsers.find(u => u.verificationToken === token);

          if (!userToVerify) {
            setStatus('error');
            setMessage("Jeton de vérification invalide ou expiré.");
            return;
          }

          if (userToVerify.isVerified) {
             setStatus('success');
             setMessage("Ce compte a déjà été vérifié. Vous pouvez vous connecter.");
             return;
          }

          await updateUser(userToVerify.id, { isVerified: true, verificationToken: '' });

          setStatus('success');
          setMessage("Compte vérifié avec succès ! Vous pouvez maintenant vous connecter.");
          toast({
            title: "Compte confirmé !",
            description: "Vous pouvez maintenant vous connecter.",
          });
        } catch (error) {
          console.error("Error confirming account: ", error);
          setStatus('error');
          setMessage("Une erreur est survenue lors de la vérification. Veuillez réessayer.");
          toast({
            title: "Erreur de confirmation",
            description: "Une erreur est survenue. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      };
      verifyToken();
    }
  }, [token, toast, router]);

  if (token) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="items-center">
            {status === 'loading' && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
            {status === 'success' && <MailCheck className="h-16 w-16 text-green-500" />}
            {status === 'error' && <AlertCircle className="h-16 w-16 text-destructive" />}
            <CardTitle className="text-2xl font-headline">Vérification du compte</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-lg">{message}</p>
            {status === 'success' && (
              <Button asChild>
                <Link href="/login">Aller à la page de connexion</Link>
              </Button>
            )}
             {status === 'error' && (
              <Button asChild variant="secondary">
                <Link href="/signup">Retour à l'inscription</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // This part is shown if the user navigates to /signup/confirm directly
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <MailCheck className="h-16 w-16 text-primary" />
          <CardTitle className="text-2xl font-headline">Confirmez votre adresse e-mail</CardTitle>
          <CardDescription>
            Nous avons envoyé un e-mail de confirmation à l'adresse que vous avez fournie. Veuillez consulter votre boîte de réception et cliquer sur le lien pour activer votre compte.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function ConfirmEmailPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ConfirmEmailContent />
        </Suspense>
    )
}
