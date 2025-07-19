
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from 'lucide-react';
import { updateUser } from '@/lib/firebase/users';
import { useToast } from '@/hooks/use-toast';

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const { toast } = useToast();

  const handleConfirmation = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "ID utilisateur manquant. Impossible de confirmer le compte.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUser(userId, { isVerified: true });
      toast({
        title: "Compte confirmé !",
        description: "Vous pouvez maintenant vous connecter.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error confirming account: ", error);
      toast({
        title: "Erreur de confirmation",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <MailCheck className="h-16 w-16 text-primary" />
          <CardTitle className="text-2xl font-headline">Confirmez votre adresse e-mail</CardTitle>
          <CardDescription>
            Ceci est une confirmation d'e-mail simulée. Dans une application réelle, un lien serait envoyé à votre boîte de réception.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Cliquez sur le bouton ci-dessous pour vérifier votre compte et continuer.
          </p>
          <Button onClick={handleConfirmation}>Confirmer le compte</Button>
        </CardContent>
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
