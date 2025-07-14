
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { services } from "@/lib/data";
import { getBarbers } from "@/lib/firebase/barbers";
import { getServices } from "@/lib/firebase/services";
import { BarberPole } from "@/components/icons";
import { Phone, MapPin, Mail } from "lucide-react";
import { HeroActionButton } from "@/components/hero-action-button";

export default async function Home() {
  const staticServices = await getServices();
  const barbers = await getBarbers();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Barbier Shear Genius
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Découvrez l'art du toilettage. Coupes de précision, rasages classiques et une atmosphère intemporelle. Prenez votre rendez-vous aujourd'hui.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <HeroActionButton />
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                data-ai-hint="stylish barbershop"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nos Services</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Des coupes classiques aux styles modernes</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Des coupes classiques aux styles modernes, nos maîtres barbiers proposent une large gamme de services de toilettage.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
              {staticServices.map((service) => (
                <Card key={service.id} className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-2 bg-primary/20 rounded-full w-fit">
                      <BarberPole className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{(typeof service.price === 'number' ? service.price : 0).toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground">{service.duration || 0} minutes</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="barbers" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Notre Équipe</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Rencontrez Nos Barbiers</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nos professionnels qualifiés se consacrent à l'art de la coiffure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
              {barbers.map((barber) => (
                <Card key={barber.id} className="text-center overflow-hidden">
                   <div className="bg-muted h-32 flex items-end justify-center">
                      <Avatar className="w-24 h-24 border-4 border-background -mb-12">
                        <AvatarImage src={barber.avatarUrl} alt={barber.name} data-ai-hint={barber.id === '2' ? 'female barber' : 'male barber'} />
                        <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                   </div>
                  <CardHeader className="pt-16">
                    <CardTitle className="font-headline">{barber.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary">{barber.specialty}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Rendez-nous visite</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nous attendons votre visite avec impatience. Retrouvez-nous au cœur de la ville.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-4">
              <div className="flex items-center justify-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-foreground">123 Rue de la Coupe, Styleburg, 45678</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-foreground">(123) 456-7890</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-foreground">contact@sheargenius.com</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
