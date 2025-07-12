"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { bookings, services, users } from "@/lib/data";
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
import { format } from "date-fns";

export default function BarberSchedulePage() {
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      // Filter bookings for the currently logged-in barber
      const barberBookings = bookings.filter(b => b.barberId === user.id && b.status === 'upcoming');
      setMyBookings(barberBookings);
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">My Upcoming Appointments</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myBookings.length > 0 ? (
              myBookings.map((booking) => {
                const customer = users.find((u) => u.id === booking.userId);
                const service = services.find((s) => s.id === booking.serviceId);
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{customer?.name || `User ID: ${booking.userId}`}</TableCell>
                    <TableCell>{service?.name}</TableCell>
                    <TableCell>
                      {format(new Date(booking.date), "MMM d, yyyy")} - {booking.time}
                    </TableCell>
                    <TableCell>
                       <Badge variant={"default"}>
                         {booking.status}
                       </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  You have no upcoming appointments.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
