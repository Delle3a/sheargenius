"use client";

import { useState, useEffect, useMemo } from "react";
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
import { services as staticServices, barbers, availableTimeSlots, bookings } from "@/lib/data";
import type { Booking } from "@/lib/data";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
        title: "Informations incomplètes",
        description: "Veuillez compléter toutes les étapes précédentes.",
        variant: "destructive",
      });
      return;
    }
    
    let barberToBook = selectedBarber;
    // If 'any' is selected, find a truly available barber for the selected slot
    if (barberToBook === 'any') {
      const allAvailableBarbers = barbers.filter(b => b.isAvailable);
      const bookedBarberIds = bookings
        .filter(b => format(new Date(b.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && b.time === selectedTime)
        .map(b => b.barberId);
      
      const freeBarbers = allAvailableBarbers.filter(b => !bookedBarberIds.includes(b.id));

      if (freeBarbers.length === 0) {
        toast({
          title: "Aucun coiffeur disponible",
          description: "Désolé, aucun coiffeur n'est disponible à cette heure. Veuillez choisir un autre créneau.",
          variant: "destructive",
        });
        return;
      }
      // Assign a random free barber
      const randomIndex = Math.floor(Math.random() * freeBarbers.length);
      barberToBook = freeBarbers[randomIndex].id;
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
      title: "Réservation confirmée !",
      description: `Votre rendez-vous est fixé pour le ${format(date, 'd MMMM yyyy', { locale: fr })} à ${selectedTime}.`,
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
  const allTimesForDay = availableTimeSlots[dayOfWeek] || [];

  const filteredTimes = useMemo(() => {
    if (!date || !selectedBarber) return [];

    const formattedDate = format(date, 'yyyy-MM-dd');
    
    if (selectedBarber === 'any') {
      const allAvailableBarbers = barbers.filter(b => b.isAvailable);
      return allTimesForDay.filter(time => {
        const bookedBarbersCount = bookings.filter(b => 
          b.date === formattedDate && 
          b.time === time && 
          b.status === 'upcoming'
        ).length;
        return bookedBarbersCount < allAvailableBarbers.length;
      });
    } else {
      const barberBookings = bookings.filter(b => 
        b.barberId === selectedBarber && 
        b.date === formattedDate &&
        b.status === 'upcoming'
      ).map(b => b.time);
      return allTimesForDay.filter(time => !barberBookings.includes(time));
    }
  }, [date, selectedBarber, allTimesForDay]);


  const serviceDetails = staticServices.find(s => s.id === selectedService);
  const barberDetails = barbers.find(b => b.id === selectedBarber);
  const availableBarbersForSelect = barbers.filter(b => b.isAvailable);


  if (!isAuthenticated) {
    return (
       <div className="container py-12 text-center">
         <p>Redirection vers la page de connexion...</p>
       </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Étape 1 : Choisissez votre service</CardTitle>
              <CardDescription>Sélectionnez le service et le coiffeur que vous souhaitez réserver.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Service</label>
                  <Select onValueChange={setSelectedService} value={selectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {staticServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price.toFixed(2)} €
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Coiffeur</label>
                  <Select onValueChange={setSelectedBarber} value={selectedBarber}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un coiffeur" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="any">N'importe quel coiffeur disponible</SelectItem>
                      {availableBarbersForSelect.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedService || !selectedBarber}>
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Étape 2 : Sélectionnez la date et l'heure</CardTitle>
               <CardDescription>Choisissez une date et une heure qui vous conviennent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setSelectedTime(undefined); // Reset time when date changes
                  }}
                  className="rounded-md border p-0"
                  disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1)) || day.getDay() === 0 }
                  locale={fr}
                />
              </div>
              {date && (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-4">
                  {allTimesForDay.map(time => {
                    const isAvailable = filteredTimes.includes(time);
                    return (
                      <Button 
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        disabled={!isAvailable}
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
              )}
               <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Précédent</Button>
                <Button onClick={() => setStep(3)} disabled={!date || !selectedTime}>Suivant</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 3 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Étape 3 : Confirmez votre rendez-vous</CardTitle>
                    <CardDescription>Veuillez vérifier les détails de votre rendez-vous ci-dessous.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 p-4 border rounded-md bg-muted/50">
                        <p><strong>Service :</strong> {serviceDetails?.name}</p>
                        <p><strong>Coiffeur :</strong> {selectedBarber === 'any' ? 'N\'importe quel coiffeur disponible' : barberDetails?.name}</p>
                        <p><strong>Date :</strong> {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : 'Non sélectionnée'}</p>
                        <p><strong>Heure :</strong> {selectedTime || 'Non sélectionnée'}</p>
                    </div>
                     <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>Précédent</Button>
                        <Button onClick={handleBooking}>Confirmer la réservation</Button>
                    </div>
                </CardContent>
            </Card>
        )}

        {step === 4 && (
            <Card>
                <CardHeader className="items-center text-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <CardTitle className="font-headline text-2xl">Merci !</CardTitle>
                    <CardDescription>Votre rendez-vous est confirmé.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     <Button onClick={resetBooking}>Réserver un autre rendez-vous</Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
