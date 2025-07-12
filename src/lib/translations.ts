
const en = {
  // Header
  bookNow: 'Book Now',
  myDashboard: 'My Dashboard',
  adminPanel: 'Admin Panel',
  mySchedule: 'My Schedule',
  myProfile: 'My Profile',
  logout: 'Log out',
  login: 'Login',
  
  // Home Page
  heroTitle: 'Shear Genius Barbershop',
  heroSubtitle: 'Experience the art of grooming. Precision cuts, classic shaves, and a timeless atmosphere. Book your appointment today.',
  servicesTitle: 'Our Services',
  servicesSubtitle: 'From classic cuts to modern styles, our master barbers provide a wide range of grooming services.',
  teamTitle: 'Our Team',
  teamSubtitle: 'Meet Our Barbers',
  teamDescription: 'Our skilled professionals are dedicated to the craft of barbering.',
  contactTitle: 'Visit Us',
  contactDescription: 'We\'re looking forward to your visit. Find us at the heart of the city.',

  // And so on for all the strings in the app...
};

const fr = {
  // Header
  bookNow: 'Réserver maintenant',
  myDashboard: 'Mon tableau de bord',
  adminPanel: 'Panneau d\'administration',
  mySchedule: 'Mon horaire',
  myProfile: 'Mon profil',
  logout: 'Se déconnecter',
  login: 'Connexion',

  // Home Page
  heroTitle: 'Barbier Shear Genius',
  heroSubtitle: 'Découvrez l\'art du toilettage. Coupes de précision, rasages classiques et une atmosphère intemporelle. Prenez votre rendez-vous aujourd\'hui.',
  servicesTitle: 'Nos Services',
  servicesSubtitle: 'Des coupes classiques aux styles modernes, nos maîtres barbiers proposent une large gamme de services de toilettage.',
  teamTitle: 'Notre Équipe',
  teamSubtitle: 'Rencontrez Nos Barbiers',
  teamDescription: 'Nos professionnels qualifiés se consacrent à l\'art de la coiffure.',
  contactTitle: 'Rendez-nous visite',
  contactDescription: 'Nous attendons votre visite avec impatience. Retrouvez-nous au cœur de la ville.',
};

export const translations = { en, fr };
export type TranslationKey = keyof typeof en;
