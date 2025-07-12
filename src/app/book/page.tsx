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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { services, barbers, availableTimeSlots } from "@/lib/data";
import { format } from 'date-fns';

export default function BookAppointmentPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  const handleBooking = () => {
    if (!date || !selectedService || !selectedBarber || !selectedTime) {
      toast({
        title: "Incomplete Information",
        description: "Please select a service, barber, date, and time.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call a server action to save to Firestore.
    console.log({
      userId: user?.id,
      serviceId: selectedService,
      barberId: selectedBarber,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
    });
    
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment is set for ${format(date, 'MMMM do')} at ${selectedTime}.`,
    });
    
    router.push("/appointments");
  };

  const dayOfWeek = date ? date.getDay() : -1;
  const times = availableTimeSlots[dayOfWeek] || [];

  if (!isAuthenticated) {
    return (
       <div className="container py-12 text-center">
         <p>Redirecting to login...</p>
       </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-8 text-center">
        Book Your Appointment
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Choose Your Service & Barber</CardTitle>
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
                        {service.name} - ${service.price}
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
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-0"
              disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1)) || day.getDay() === 0 }
            />
            {date && (
               <div className="grid grid-cols-3 gap-2">
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
          </CardContent>
        </Card>
      </div>

       <div className="max-w-4xl mx-auto mt-8 flex justify-end">
          <Button size="lg" onClick={handleBooking} disabled={!date || !selectedService || !selectedBarber || !selectedTime}>
            Confirm Booking
          </Button>
        </div>
    </div>
  );
}
