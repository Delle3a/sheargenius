"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { bookings as allBookings, services, barbers } from "@/lib/data";
import type { Booking } from "@/lib/data";
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

export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // In a real app, this would be a fetch call.
      setUserBookings(allBookings.filter((b) => b.userId === user?.id));
    }
  }, [isAuthenticated, user, router]);

  const handleCancel = (bookingId: string) => {
    // In real app, this would be a server action
    setUserBookings(
      userBookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been successfully cancelled.",
    });
  };

  const upcomingBookings = userBookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status === "upcoming"
  );
  const pastBookings = userBookings.filter(
    (b) => new Date(b.date) < new Date() || b.status !== "upcoming"
  );

  if (!isAuthenticated) {
    // This will be handled by the layout, but as a fallback:
    return (
      <div className="container py-12 text-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const AppointmentCard = ({ booking }: { booking: Booking }) => {
    const service = services.find((s) => s.id === booking.serviceId);
    const barber = barbers.find((b) => b.id === booking.barberId);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex justify-between items-start">
            <span>{service?.name || "Service"}</span>
             <Badge variant={booking.status === "upcoming" ? "default" : "secondary"} className={booking.status === "cancelled" ? "bg-destructive text-destructive-foreground" : ""}>
               {booking.status}
             </Badge>
          </CardTitle>
          <CardDescription>
            {format(new Date(booking.date), "EEEE, MMMM d, yyyy")} at {booking.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            with <strong>{barber?.name || "Barber"}</strong>
          </p>
        </CardContent>
        {booking.status === "upcoming" && (
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="destructive">Cancel</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently cancel your appointment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Back</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancel(booking.id)}>
                    Yes, Cancel
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
      <h2 className="text-xl font-medium text-muted-foreground">No appointments here.</h2>
      <Button asChild className="mt-4">
        <Link href="/book">Book Your First Visit</Link>
      </Button>
    </div>
  )

  return (
    <div>
       <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
        My Appointments
      </h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">History</TabsTrigger>
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
              <h2 className="text-xl font-medium text-muted-foreground">No appointment history.</h2>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
