"use client";

import { useState } from 'react';
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

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const handleSaveBarber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const barberData = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      avatarUrl: formData.get('avatarUrl') as string || 'https://placehold.co/100x100.png',
    };

    if (editingBarber) {
      const updatedBarbers = barbers.map(b =>
        b.id === editingBarber.id ? { ...b, ...barberData } : b
      );
      setBarbers(updatedBarbers);
    } else {
      const newBarber: Barber = {
        id: (barbers.length + 1).toString(),
        ...barberData,
      };
      setBarbers([...barbers, newBarber]);
    }
    setIsDialogOpen(false);
    setEditingBarber(null);
  };

  const handleDeleteBarber = (barberId: string) => {
    setBarbers(barbers.filter(b => b.id !== barberId));
  };

  const openEditDialog = (barber: Barber) => {
    setEditingBarber(barber);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingBarber(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Manage Barbers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Barber
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingBarber ? "Edit Barber" : "Add New Barber"}</DialogTitle>
              <DialogDescription>
                {editingBarber ? "Update the details for this barber." : "Add a new barber to your team."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveBarber}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" defaultValue={editingBarber?.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">Specialty</Label>
                  <Input id="specialty" name="specialty" defaultValue={editingBarber?.specialty} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatarUrl" className="text-right">Avatar URL</Label>
                  <Input id="avatarUrl" name="avatarUrl" defaultValue={editingBarber?.avatarUrl} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barber</TableHead>
              <TableHead>Specialty</TableHead>
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
                        <DropdownMenuItem onClick={() => openEditDialog(barber)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteBarber(barber.id)}>Delete</DropdownMenuItem>
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
