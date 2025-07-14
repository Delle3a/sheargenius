
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { bookings as allBookings, services as staticServices } from "@/lib/data";
import type { Booking, Barber } from "@/lib/data";
import { getBarbers } from "@/lib/firebase/barbers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusTranslations: { [key in Booking['status']]: string } = {
  upcoming: 'à venir',
  completed: 'terminé',
  cancelled: 'annulé'
};


export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          const barbersFromDb = await getBarbers();
          setBarbers(barbersFromDb);
          setUserBookings(allBookings.filter((b) => b.userId === user?.id));
        } catch(e) {
            toast({
              title: "Erreur",
              description: "Impossible de charger les données.",
              variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
      }
      fetchData();
    }
  }, [isAuthenticated, user, router, toast]);

  const handleCancel = (bookingId: string) => {
    setUserBookings(
      userBookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
    toast({
      title: "Rendez-vous annulé",
      description: "Votre rendez-vous a été annulé avec succès.",
    });
  };

  const upcomingBookings = userBookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status === "upcoming"
  );
  const pastBookings = userBookings.filter(
    (b) => new Date(b.date) < new Date() || b.status !== "upcoming"
  );

  if (loading) {
    return <div className="container py-12 text-center">Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <p>Redirection vers la page de connexion...</p>
      </div>
    );
  }

  const AppointmentCard = ({ booking }: { booking: Booking }) => {
    const service = staticServices.find((s) => s.id === booking.serviceId);
    const barber = barbers.find((b) => b.id === booking.barberId);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex justify-between items-start">
            <span>{service?.name || "Service"}</span>
             <Badge variant={booking.status === "upcoming" ? "default" : "secondary"} className={booking.status === "cancelled" ? "bg-destructive text-destructive-foreground" : ""}>
               {statusTranslations[booking.status]}
             </Badge>
          </CardTitle>
          <CardDescription>
            {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })} à {booking.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            avec <strong>{barber?.name || "Coiffeur"}</strong>
          </p>
        </CardContent>
        {booking.status === "upcoming" && (
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="destructive">Annuler</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cela annulera définitivement votre rendez-vous.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Retour</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancel(booking.id)}>
                    Oui, annuler
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>
    );
  };
  
  const NoAppointments = () => (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <h2 className="text-xl font-medium text-muted-foreground">Aucun rendez-vous ici.</h2>
      <Button asChild className="mt-4">
        <Link href="/book">Réservez votre première visite</Link>
      </Button>
    </div>
  )

  return (
    <div>
       <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
        Mes rendez-vous
      </h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <AppointmentCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <NoAppointments />
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {pastBookings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <AppointmentCard key={booking.id} booking={booking} />
              ))}
            </div>
           ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-medium text-muted-foreground">Aucun historique de rendez-vous.</h2>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
