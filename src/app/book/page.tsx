
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { services, barbers, availableTimeSlots, bookings } from "@/lib/data";
import type { Booking } from "@/lib/data";
import { format } from 'date-fns';
import { CheckCircle } from "lucide-react";

export default function BookAppointmentPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  const handleBooking = () => {
    if (!date || !selectedService || !selectedBarber || !selectedTime || !user) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all previous steps.",
        variant: "destructive",
      });
      return;
    }
    
    let barberToBook = selectedBarber;
    if (barberToBook === 'any') {
      const availableBarbers = barbers.filter(b => b.isAvailable);
      if (availableBarbers.length === 0) {
        toast({
          title: "No Barbers Available",
          description: "Sorry, there are no barbers available at this moment. Please check back later.",
          variant: "destructive",
        });
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableBarbers.length);
      barberToBook = availableBarbers[randomIndex].id;
    }

    const newBooking: Booking = {
      id: (bookings.length + 1).toString(),
      userId: user.id,
      serviceId: selectedService,
      barberId: barberToBook,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
      status: 'upcoming'
    };
    
    // In a real app, this would be a server action. Here we add to the in-memory array.
    bookings.push(newBooking);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment is set for ${format(date, 'MMMM do')} at ${selectedTime}.`,
    });
    
    setStep(4);
  };

  const resetBooking = () => {
    setStep(1);
    setDate(new Date());
    setSelectedService(undefined);
    setSelectedBarber(undefined);
    setSelectedTime(undefined);
  }

  const dayOfWeek = date ? date.getDay() : -1;
  const times = availableTimeSlots[dayOfWeek] || [];

  const serviceDetails = services.find(s => s.id === selectedService);
  const barberDetails = barbers.find(b => b.id === selectedBarber);
  const availableBarbers = barbers.filter(b => b.isAvailable);


  if (!isAuthenticated) {
    return (
       <div className="container py-12 text-center">
         <p>Redirecting to login...</p>
       </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Step 1: Choose Your Service</CardTitle>
              <CardDescription>Select the service and barber you'd like to book.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Service</label>
                  <Select onValueChange={setSelectedService} value={selectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Barber</label>
                  <Select onValueChange={setSelectedBarber} value={selectedBarber}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a barber" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="any">Any Available</SelectItem>
                      {availableBarbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedService || !selectedBarber}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Step 2: Select Date & Time</CardTitle>
               <CardDescription>Choose a date and time that works for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border p-0"
                  disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1)) || day.getDay() === 0 }
                />
              </div>
              {date && (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-4">
                  {times.map(time => (
                    <Button 
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
               <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!date || !selectedTime}>Next</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 3 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Step 3: Confirm Your Appointment</CardTitle>
                    <CardDescription>Please review your appointment details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 p-4 border rounded-md bg-muted/50">
                        <p><strong>Service:</strong> {serviceDetails?.name}</p>
                        <p><strong>Barber:</strong> {selectedBarber === 'any' ? 'Any Available' : barberDetails?.name}</p>
                        <p><strong>Date:</strong> {date ? format(date, "EEEE, MMMM d, yyyy") : 'Not selected'}</p>
                        <p><strong>Time:</strong> {selectedTime || 'Not selected'}</p>
                    </div>
                     <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                        <Button onClick={handleBooking}>Confirm Booking</Button>
                    </div>
                </CardContent>
            </Card>
        )}

        {step === 4 && (
            <Card>
                <CardHeader className="items-center text-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <CardTitle className="font-headline text-2xl">Thank you!</CardTitle>
                    <CardDescription>Your appointment is confirmed.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     <Button onClick={resetBooking}>Book Another Appointment</Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
