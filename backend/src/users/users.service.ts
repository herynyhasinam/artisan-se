import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface ArtisanData {
  trade: string;
  neighborhood: string;
  city: string;
  phone: string;
  description?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async artisanPhoneExists(phone: string) {
    const found = await this.prisma.artisan.findFirst({ where: { phone }, select: { id: true } });
    return !!found;
  }

  // Création du compte ET de la fiche en une seule opération (tout ou rien)
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    artisan?: ArtisanData;
  }) {
    const { artisan, ...user } = data;
    return this.prisma.user.create({
      data: {
        ...user,
        ...(artisan && { artisan: { create: { name: user.name, ...artisan } } }),
      },
    });
  }
}
