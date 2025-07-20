
"use client";

import { useState, useEffect } from 'react';
import { getBarbers, addBarber, updateBarber, deleteBarber } from '@/lib/firebase/barbers';
import type { Barber } from '@/lib/data';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { addUser, getUsers } from '@/lib/firebase/users';

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBarbers = async () => {
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
    fetchBarbers();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSaveBarber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('avatar') as File;

    let avatarUrl = editingBarber?.avatarUrl || 'https://placehold.co/100x100.png';

    if (file && file.size > 0) {
      avatarUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    } else if (avatarPreview) {
      avatarUrl = avatarPreview;
    }
    
    const name = formData.get('name') as string;
    const specialty = formData.get('specialty') as string;
    const isAvailable = formData.get('isAvailable') === 'on';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    

    const barberData = {
      name,
      specialty,
      avatarUrl,
      isAvailable,
    };

    setLoading(true);
    try {
      if (editingBarber) {
        // Just update the barber details, not the user account
        await updateBarber(editingBarber.id, barberData);
        setBarbers(barbers.map(b => (b.id === editingBarber.id ? { ...b, ...barberData } : b)));
        toast({ title: "Succès", description: "Coiffeur mis à jour." });
      } else {
        // This is a new barber, so we create both the barber record and the user account
        const allUsers = await getUsers();
        if (allUsers.some(u => u.email === email)) {
            toast({
                title: "Erreur",
                description: "Un utilisateur avec cet email existe déjà.",
                variant: "destructive"
            });
            setLoading(false);
            return;
        }

        const newBarber = await addBarber(barberData);
        
        // The ID of the user document MUST match the ID of the barber document
        await addUser({
            id: newBarber.id,
            name,
            email,
            password,
            role: 'barber',
            isVerified: true // Admins create verified accounts directly
        });

        setBarbers([...barbers, newBarber]);
        toast({ title: "Succès", description: "Coiffeur et compte utilisateur créés." });
      }
    } catch (error) {
      console.error("Error saving barber: ", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le coiffeur.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
      setEditingBarber(null);
      setAvatarPreview(null);
      setLoading(false);
    }
  };

  const handleDeleteBarber = async (barberId: string) => {
    try {
      // Note: This only deletes the barber record. Deleting the user is a separate, more complex operation.
      // For this app, we'll leave the user account for historical data integrity.
      await deleteBarber(barberId);
      setBarbers(barbers.filter(b => b.id !== barberId));
      toast({ title: "Succès", description: "Coiffeur supprimé." });
    } catch (error) {
      console.error("Error deleting barber: ", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le coiffeur.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (barber: Barber) => {
    setEditingBarber(barber);
    setAvatarPreview(barber.avatarUrl);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingBarber(null);
    setAvatarPreview(null);
    setIsDialogOpen(true);
  };

  const handleAvailabilityChange = async (barberId: string, isAvailable: boolean) => {
    const originalBarbers = [...barbers];
    const updatedBarbers = barbers.map(b =>
      b.id === barberId ? { ...b, isAvailable } : b
    );
    setBarbers(updatedBarbers);
    
    try {
        await updateBarber(barberId, { isAvailable });
    } catch(error) {
        setBarbers(originalBarbers);
        toast({
            title: "Erreur",
            description: "Impossible de mettre à jour la disponibilité.",
            variant: "destructive",
        });
    }
  };
  
  if (loading) {
      return <div>Chargement des coiffeurs...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gérer les coiffeurs</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            setEditingBarber(null);
            setAvatarPreview(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un coiffeur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingBarber ? "Modifier le coiffeur" : "Ajouter un nouveau coiffeur"}</DialogTitle>
              <DialogDescription>
                {editingBarber ? "Mettez à jour les détails de ce coiffeur." : "Ajoutez un nouveau coiffeur et créez son compte utilisateur."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveBarber}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nom</Label>
                  <Input id="name" name="name" defaultValue={editingBarber?.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">Spécialité</Label>
                  <Input id="specialty" name="specialty" defaultValue={editingBarber?.specialty} className="col-span-3" required />
                </div>
                 {!editingBarber && (
                    <>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Mot de passe</Label>
                            <Input id="password" name="password" type="password" className="col-span-3" required />
                        </div>
                    </>
                 )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">Avatar</Label>
                  <Input id="avatar" name="avatar" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
                </div>
                {avatarPreview && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3">
                      <Image src={avatarPreview} alt="Aperçu de l'avatar" width={100} height={100} className="rounded-full" />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isAvailable" className="text-right">Disponible</Label>
                   <Checkbox id="isAvailable" name="isAvailable" defaultChecked={editingBarber?.isAvailable ?? true} />
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
              <TableHead>Coiffeur</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Disponibilité</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbers.map(barber => (
              <TableRow key={barber.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={barber.avatarUrl} alt={barber.name} />
                      <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{barber.name}</span>
                  </div>
                </TableCell>
                <TableCell>{barber.specialty}</TableCell>
                <TableCell>
                   <Switch
                    checked={barber.isAvailable}
                    onCheckedChange={(checked) => handleAvailabilityChange(barber.id, checked)}
                    aria-label="Changer la disponibilité"
                  />
                   <Badge variant={barber.isAvailable ? "default" : "secondary"} className="ml-2">
                    {barber.isAvailable ? "Disponible" : "Indisponible"}
                  </Badge>
                </TableCell>
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
                        <DropdownMenuItem onClick={() => openEditDialog(barber)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteBarber(barber.id)}>Supprimer</DropdownMenuItem>
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

    