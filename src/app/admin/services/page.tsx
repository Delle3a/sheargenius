"use client";

import { useState, useEffect } from 'react';
import { getServices, addService, updateService, deleteService } from '@/lib/firebase/services';
import type { Service } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesFromDb = await getServices();
        setServices(servicesFromDb);
      } catch (error) {
        console.error("Error fetching services: ", error);
        toast({
            title: "Erreur",
            description: "Impossible de charger les services.",
            variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
    };

    try {
        if (editingService) {
          await updateService(editingService.id, serviceData);
          setServices(services.map(s =>
            s.id === editingService.id ? { ...s, ...serviceData } : s
          ));
          toast({ title: "Succès", description: "Service mis à jour." });
        } else {
          const newService = await addService(serviceData);
          setServices([...services, newService]);
          toast({ title: "Succès", description: "Service ajouté." });
        }
        setIsDialogOpen(false);
        setEditingService(null);
    } catch(error) {
        console.error("Error saving service: ", error);
        toast({
            title: "Erreur",
            description: "Impossible d'enregistrer le service.",
            variant: "destructive",
        });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
        await deleteService(serviceId);
        setServices(services.filter(s => s.id !== serviceId));
        toast({ title: "Succès", description: "Service supprimé." });
    } catch (error) {
        console.error("Error deleting service: ", error);
        toast({
            title: "Erreur",
            description: "Impossible de supprimer le service.",
            variant: "destructive",
        });
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Chargement des services...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gérer les services</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) setEditingService(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingService ? "Modifier le service" : "Ajouter un nouveau service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Mettez à jour les détails de ce service." : "Ajoutez un nouveau service à vos offres."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveService}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nom</Label>
                  <Input id="name" name="name" defaultValue={editingService?.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Prix (€)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingService?.price} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Durée (min)</Label>
                  <Input id="duration" name="duration" type="number" defaultValue={editingService?.duration} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map(service => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{(typeof service.price === 'number' ? service.price : 0).toFixed(2)} €</TableCell>
                <TableCell>{service.duration || 0} min</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(service)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteService(service.id)}>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
