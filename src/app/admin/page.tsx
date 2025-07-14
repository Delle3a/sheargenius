
"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { bookings, services as staticServices, users } from "@/lib/data"
import type { Barber } from "@/lib/data";
import { getBarbers } from "@/lib/firebase/barbers";
import { DollarSign, Users, Calendar, Scissors } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

const statusTranslations: { [key in 'upcoming' | 'completed' | 'cancelled'] : string } = {
  upcoming: 'à venir',
  completed: 'terminé',
  cancelled: 'annulé'
};


export default function AdminDashboardPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBarbersData = async () => {
      try {
        const barbersFromDb = await getBarbers();
        setBarbers(barbersFromDb);
      } catch (error) {
        console.error("Error fetching barbers: ", error);
        toast({
            title: "Erreur",
            description: "Impossible de charger les coiffeurs.",
            variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBarbersData();
  }, [toast]);

  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((acc, booking) => {
      const service = staticServices.find(s => s.id === booking.serviceId);
      return acc + (service?.price || 0);
    }, 0);

  const totalAppointments = bookings.length;
  const upcomingAppointments = bookings.filter(b => b.status === 'upcoming');
  
  const weeklyRevenueData = [
      { day: "Lun", revenue: 150 },
      { day: "Mar", revenue: 200 },
      { day: "Mer", revenue: 250 },
      { day: "Jeu", revenue: 180 },
      { day: "Ven", revenue: 300 },
      { day: "Sam", revenue: 400 },
      { day: "Dim", revenue: 50 },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenu",
      color: "hsl(var(--primary))",
    },
  }

  if (loading) {
      return <div>Chargement du tableau de bord...</div>
  }

  return (
    <div className="flex flex-col gap-8">
       <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
        Tableau de bord
      </h1>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">
              Basé sur les rendez-vous terminés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Total des rendez-vous
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nombre de coiffeurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{barbers.length}</div>
            <p className="text-xs text-muted-foreground">
             Coiffeurs actifs et inactifs
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services offerts</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticServices.length}</div>
            <p className="text-xs text-muted-foreground">
              Total des services disponibles
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
           <CardHeader>
            <CardTitle>Aperçu des revenus hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyRevenueData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value} €`} />
                    <Tooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: 'hsl(var(--muted))' }}
                      />
                    <Legend content={<ChartLegendContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Rendez-vous à venir</CardTitle>
            <CardDescription>
              Les {upcomingAppointments.length} prochains rendez-vous.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Statut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {upcomingAppointments.slice(0, 5).map(booking => {
                        const user = users.find(u => u.id === booking.userId);
                        return (
                            <TableRow key={booking.id}>
                                <TableCell>{user?.name}</TableCell>
                                <TableCell>{format(new Date(booking.date), "d MMM", { locale: fr })} - {booking.time}</TableCell>
                                <TableCell>
                                    <Badge variant="default">
                                    {statusTranslations[booking.status]}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
