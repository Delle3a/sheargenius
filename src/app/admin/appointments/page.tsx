"use client";

import { useState } from "react";
import {
  bookings as initialBookings,
  services,
  barbers,
  users,
} from "@/lib/data";
import type { Booking } from "@/lib/data";
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

const statusTranslations: { [key in Booking['status']]: string } = {
  upcoming: 'à venir',
  completed: 'terminé',
  cancelled: 'annulé'
};

export default function AdminAppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleStatusChange = (bookingId: string, status: Booking['status']) => {
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    setBookings(updatedBookings);
    // In a real app, you'd also update the source `initialBookings` array or a database
    const bookingIndex = initialBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex > -1) {
      initialBookings[bookingIndex].status = status;
    }
  };
  
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
                  <TableCell>{service?.name}</TableCell>
                  <TableCell>{barber?.name}</TableCell>
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
