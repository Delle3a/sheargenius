
"use client";

import { useState, useEffect } from 'react';
import { barbers as initialBarbers } from '@/lib/data';
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

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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


    const barberData = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      avatarUrl: avatarUrl,
      isAvailable: formData.get('isAvailable') === 'on',
    };

    if (editingBarber) {
      const updatedBarber = { ...editingBarber, ...barberData };
      const updatedBarbers = barbers.map(b =>
        b.id === editingBarber.id ? updatedBarber : b
      );
      setBarbers(updatedBarbers);

      const barberIndex = initialBarbers.findIndex(b => b.id === editingBarber.id);
      if (barberIndex !== -1) {
        initialBarbers[barberIndex] = updatedBarber;
      }
    } else {
      const newBarber: Barber = {
        id: (Date.now()).toString(),
        ...barberData,
      };
      setBarbers([...barbers, newBarber]);
      initialBarbers.push(newBarber);
    }
    setIsDialogOpen(false);
    setEditingBarber(null);
    setAvatarPreview(null);
  };

  const handleDeleteBarber = (barberId: string) => {
    setBarbers(barbers.filter(b => b.id !== barberId));
    
    const barberIndex = initialBarbers.findIndex(b => b.id === barberId);
    if (barberIndex !== -1) {
      initialBarbers.splice(barberIndex, 1);
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

  const handleAvailabilityChange = (barberId: string, isAvailable: boolean) => {
    const updatedBarbers = barbers.map(b =>
      b.id === barberId ? { ...b, isAvailable } : b
    );
    setBarbers(updatedBarbers);
    
    const barberIndex = initialBarbers.findIndex(b => b.id === barberId);
    if (barberIndex !== -1) {
      initialBarbers[barberIndex].isAvailable = isAvailable;
    }
  };

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
                {editingBarber ? "Mettez à jour les détails de ce coiffeur." : "Ajoutez un nouveau coiffeur à votre équipe."}
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

    