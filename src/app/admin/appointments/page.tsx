
"use client";

import { useState, useEffect } from "react";
import { getBookings, updateBookingStatus } from "@/lib/firebase/bookings";
import { getServices } from "@/lib/firebase/services";
import { getBarbers } from "@/lib/firebase/barbers";
import { getUsers } from "@/lib/firebase/users";
import type { Booking, Service, Barber, User } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const statusTranslations: { [key in Booking['status']]: string } = {
  upcoming: 'à venir',
  completed: 'terminé',
  cancelled: 'annulé'
};

export default function AdminAppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsFromDb, servicesFromDb, barbersFromDb, usersFromDb] = await Promise.all([
          getBookings(),
          getServices(),
          getBarbers(),
          getUsers(),
        ]);
        setBookings(bookingsFromDb);
        setServices(servicesFromDb);
        setBarbers(barbersFromDb);
        setUsers(usersFromDb);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    const originalBookings = [...bookings];
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    setBookings(updatedBookings);

    try {
      await updateBookingStatus(bookingId, status);
      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été marqué comme ${statusTranslations[status]}.`,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      setBookings(originalBookings);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Tous les rendez-vous</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Coiffeur</TableHead>
              <TableHead>Date et heure</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const user = users.find((u) => u.id === booking.userId);
              const service = services.find((s) => s.id === booking.serviceId);
              const barber = barbers.find((b) => b.id === booking.barberId);
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{user?.name || `User ID: ${booking.userId}`}</TableCell>
                  <TableCell>{service?.name || "N/A"}</TableCell>
                  <TableCell>{barber?.name || "N/A"}</TableCell>
                  <TableCell>
                    {format(new Date(booking.date), "d MMM yyyy", { locale: fr })} - {booking.time}
                  </TableCell>
                  <TableCell>
                     <Badge variant={booking.status === "upcoming" ? "default" : "secondary"} className={booking.status === "cancelled" ? "bg-destructive text-destructive-foreground" : ""}>
                       {statusTranslations[booking.status]}
                     </Badge>
                  </TableCell>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
