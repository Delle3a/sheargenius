
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { getBookings, updateBookingStatus } from "@/lib/firebase/bookings";
import { getServices } from "@/lib/firebase/services";
import { getUsers } from "@/lib/firebase/users";
import { getBarbers, updateBarber } from "@/lib/firebase/barbers";
import type { Booking, Barber, Service, User } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const statusTranslations: { [key in Booking['status']]: string } = {
  upcoming: 'à venir',
  completed: 'terminé',
  cancelled: 'annulé'
};


export default function BarberSchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [barberDetails, setBarberDetails] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [allBarbers, allBookings, allServices, allUsers] = await Promise.all([
            getBarbers(),
            getBookings(),
            getServices(),
            getUsers(),
          ]);

          const barberData = allBarbers.find(b => b.id === user.id) ?? null;
          setBarberDetails(barberData);
          
          const barberBookings = allBookings.filter(b => b.barberId === user.id);
          setMyBookings(barberBookings);

          setServices(allServices);
          setUsers(allUsers);

        } catch (error) {
            console.error("Error fetching barber data: ", error);
            toast({ title: "Erreur", description: "Impossible de charger les données du coiffeur.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, toast]);
  
  const handleAvailabilityChange = async (isAvailable: boolean) => {
    if (barberDetails) {
        const originalDetails = { ...barberDetails };
        const updatedBarber = { ...barberDetails, isAvailable };
        setBarberDetails(updatedBarber);
        try {
            await updateBarber(barberDetails.id, { isAvailable });
        } catch(error) {
            console.error("Error updating availability: ", error);
            setBarberDetails(originalDetails);
            toast({ title: "Erreur", description: "Impossible de mettre à jour la disponibilité.", variant: "destructive" });
        }
    }
  };
  
  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    const originalBookings = [...myBookings];
    const updatedBookings = myBookings.map(b => b.id === bookingId ? { ...b, status } : b);
    setMyBookings(updatedBookings);
    
    try {
      await updateBookingStatus(bookingId, status);
      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été marqué comme ${statusTranslations[status]}.`,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      setMyBookings(originalBookings);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const upcoming = myBookings
      .filter((b) => b.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = myBookings
      .filter((b) => b.status !== 'upcoming')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcomingBookings: upcoming, pastBookings: past };
  }, [myBookings]);


  const AppointmentsTable = ({ bookingsToShow, isUpcoming }: { bookingsToShow: Booking[], isUpcoming: boolean }) => (
     <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date et heure</TableHead>
              <TableHead>Statut</TableHead>
              {isUpcoming && <TableHead><span className="sr-only">Actions</span></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsToShow.length > 0 ? (
              bookingsToShow.map((booking) => {
                const customer = users.find((u) => u.id === booking.userId);
                const service = services.find((s) => s.id === booking.serviceId);
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{customer?.name || `User ID: ${booking.userId}`}</TableCell>
                    <TableCell>{service?.name}</TableCell>
                    <TableCell>
                      {format(new Date(booking.date), "d MMM yyyy", { locale: fr })} - {booking.time}
                    </TableCell>
                    <TableCell>
                       <Badge variant={booking.status === 'upcoming' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'}>
                         {statusTranslations[booking.status]}
                       </Badge>
                    </TableCell>
                     {isUpcoming && (
                        <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                                  Marquer comme terminé
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                                  Annuler
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                     )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={isUpcoming ? 5 : 4} className="h-24 text-center">
                  Aucun rendez-vous dans cette catégorie.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  );
  
  if (loading) {
      return <div>Chargement de l'horaire...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
         <h1 className="text-3xl font-bold font-headline">Mon Horaire</h1>
         {barberDetails && (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id="availability" 
                            checked={barberDetails.isAvailable} 
                            onCheckedChange={handleAvailabilityChange}
                        />
                        <Label htmlFor="availability" className="font-medium">
                            {barberDetails.isAvailable ? "Disponible pour les réservations" : "Indisponible"}
                        </Label>
                    </div>
                </CardContent>
            </Card>
         )}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
            <AppointmentsTable bookingsToShow={upcomingBookings} isUpcoming={true} />
        </TabsContent>
        <TabsContent value="history">
            <AppointmentsTable bookingsToShow={pastBookings} isUpcoming={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
