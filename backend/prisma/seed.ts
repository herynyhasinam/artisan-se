import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedArtisan {
  name: string;
  trade: string;
  neighborhood: string;
  city: string;
  description: string;
  recommendations: number;
}

// Données fictives pour le développement
const ARTISANS: SeedArtisan[] = [
  // --- Antananarivo ---
  { name: 'Rakoto Andriamihaja', trade: 'Soudeur', neighborhood: 'Isotry', city: 'Antananarivo', description: 'Portails, grilles et réparations métalliques. Devis gratuit.', recommendations: 18 },
  { name: 'Rasoa Voahangy', trade: 'Couturière', neighborhood: 'Analakely', city: 'Antananarivo', description: 'Robes sur mesure, retouches et uniformes scolaires.', recommendations: 25 },
  { name: 'Hery Randrianasolo', trade: 'Menuisier', neighborhood: 'Ambohijatovo', city: 'Antananarivo', description: 'Meubles sur mesure, portes et fenêtres en bois.', recommendations: 14 },
  { name: 'Naivo Rakotomalala', trade: 'Plombier', neighborhood: 'Ankorondrano', city: 'Antananarivo', description: 'Fuites, installation sanitaire et débouchage. Intervention rapide.', recommendations: 21 },
  { name: 'Tiana Razafindrakoto', trade: 'Électricien', neighborhood: '67 Ha', city: 'Antananarivo', description: 'Installation, dépannage et mise aux normes.', recommendations: 17 },
  { name: 'Mamy Andrianjafy', trade: 'Mécanicien auto', neighborhood: 'Behoririka', city: 'Antananarivo', description: 'Entretien, vidange et diagnostic moteur.', recommendations: 12 },
  { name: 'Fara Ravelonarivo', trade: 'Coiffeuse à domicile', neighborhood: 'Ivandry', city: 'Antananarivo', description: 'Tresses, coupes et soins. Je me déplace à domicile.', recommendations: 19 },
  { name: 'Haja Rasolofoniaina', trade: 'Réparateur de téléphones', neighborhood: 'Analakely', city: 'Antananarivo', description: 'Écrans, batteries et déblocage. Réparation en une heure.', recommendations: 23 },
  { name: 'Lalaina Ramanantsoa', trade: 'Maçon', neighborhood: 'Itaosy', city: 'Antananarivo', description: 'Murs, dalles et petites rénovations.', recommendations: 9 },
  { name: 'Faly Rabemananjara', trade: 'Peintre en bâtiment', neighborhood: 'Ampefiloha', city: 'Antananarivo', description: 'Peinture intérieure et extérieure, finitions soignées.', recommendations: 11 },
  { name: 'Njaka Rakotondrabe', trade: 'Cordonnier', neighborhood: 'Tsaralalàna', city: 'Antananarivo', description: 'Réparation de chaussures et de sacs en cuir.', recommendations: 7 },
  { name: 'Soa Randrianarisoa', trade: 'Tapissier', neighborhood: 'Anosibe', city: 'Antananarivo', description: 'Canapés, fauteuils et sièges de voiture.', recommendations: 6 },
  { name: 'Tahina Andrianarivo', trade: 'Mécanicien moto', neighborhood: 'Ankadifotsy', city: 'Antananarivo', description: 'Réparation de motos et de scooters. Pièces disponibles.', recommendations: 15 },
  { name: 'Volatiana Rasoanaivo', trade: 'Vannière', neighborhood: 'Mahamasina', city: 'Antananarivo', description: 'Paniers, chapeaux et sacs en raphia faits main.', recommendations: 13 },
  { name: 'Fenitra Rasamimanana', trade: 'Coiffeuse', neighborhood: 'Andraharo', city: 'Antananarivo', description: 'Coiffure pour mariages et fêtes, sur rendez-vous.', recommendations: 20 },
  // --- Antsirabe ---
  { name: 'Mihaja Ratsimbazafy', trade: 'Sculpteur sur bois', neighborhood: 'Centre-ville', city: 'Antsirabe', description: 'Sculptures, cadres et objets décoratifs en bois.', recommendations: 10 },
  { name: 'Aina Razanamahefa', trade: 'Couturier', neighborhood: 'Ambohimena', city: 'Antsirabe', description: 'Tenues traditionnelles et costumes sur mesure.', recommendations: 12 },
  { name: 'Dina Rakotobe', trade: 'Mécanicien auto', neighborhood: 'Antsenakely', city: 'Antsirabe', description: 'Mécanique générale et dépannage sur route.', recommendations: 10 },
  // --- Fianarantsoa ---
  { name: 'Toky Andriantsoa', trade: 'Forgeron', neighborhood: 'Tsianolondroa', city: 'Fianarantsoa', description: 'Outils agricoles, couteaux et pièces sur mesure.', recommendations: 8 },
  { name: 'Tojo Andrianantenaina', trade: 'Menuisier', neighborhood: 'Anjoma', city: 'Fianarantsoa', description: 'Charpentes, escaliers et mobilier scolaire.', recommendations: 7 },
  // --- Toamasina ---
  { name: 'Miora Rakotonirina', trade: 'Pâtissière', neighborhood: 'Tanambao V', city: 'Toamasina', description: "Gâteaux d'anniversaire et pâtisseries pour les fêtes.", recommendations: 22 },
  { name: 'Rindra Rakotoarisoa', trade: 'Plombier', neighborhood: 'Ankirihiry', city: 'Toamasina', description: "Pompes, citernes et réseaux d'eau.", recommendations: 9 },
  // --- Mahajanga ---
  { name: 'Lova Randrianjafy', trade: 'Électricien', neighborhood: 'Mahabibo', city: 'Mahajanga', description: 'Câblage, groupes électrogènes et panneaux solaires.', recommendations: 16 },
  { name: 'Zo Raharimalala', trade: 'Réparateur de téléphones', neighborhood: 'Tanambao', city: 'Mahajanga', description: 'Réparation de smartphones et vente d’accessoires.', recommendations: 14 },
];

// "Rakoto Andriamihaja" -> "rakoto.andriamihaja"
const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');

async function main() {
  const password = process.env.SEED_PASSWORD ?? 'motdepasse123';
  const passwordHash = await bcrypt.hash(password, 10);

  let created = 0;
  for (const [i, a] of ARTISANS.entries()) {
    const email = `${slug(a.name)}@seed.artisanse.test`;
    if (await prisma.user.findUnique({ where: { email } })) continue; // relancer le seed ne duplique rien

    await prisma.user.create({
      data: {
        name: a.name,
        email,
        passwordHash,
        role: Role.ARTISAN,
        artisan: {
          create: {
            name: a.name,
            trade: a.trade,
            neighborhood: a.neighborhood,
            city: a.city,
            // numéros fictifs : 0340000001, 0340000002, ...
            phone: `03400${String(i + 1).padStart(5, '0')}`,
            description: a.description,
            recommendations: a.recommendations,
          },
        },
      },
    });
    created++;
  }

  // Un compte « utilisateur » pour tester le côté recherche
  const demoEmail = 'demo@seed.artisanse.test';
  if (!(await prisma.user.findUnique({ where: { email: demoEmail } }))) {
    await prisma.user.create({
      data: { name: 'Utilisateur démo', email: demoEmail, passwordHash, role: Role.USER },
    });
    created++;
  }

  console.log(`Seed terminé : ${created} compte(s) créé(s), ${ARTISANS.length} artisans au total.`);
  console.log(`Connexion de test : demo@seed.artisanse.test / ${password}`);
  console.log(`Compte artisan    : ${slug(ARTISANS[0].name)}@seed.artisanse.test / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
