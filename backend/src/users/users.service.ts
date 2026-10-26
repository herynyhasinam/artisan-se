import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

interface ArtisanData {
  trade: string;
  neighborhood: string;
  city: string;
  phone: string;
  description?: string;
}

// Le profil ne contient jamais le hash du mot de passe
const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  artisan: {
    select: {
      id: true,
      name: true,
      trade: true,
      neighborhood: true,
      city: true,
      phone: true,
      description: true,
      recommendations: true,
    },
  },
} satisfies Prisma.UserSelect;

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

  // ---------- Profil ----------
  async getProfile(id: number) {
    const profile = await this.prisma.user.findUnique({ where: { id }, select: PROFILE_SELECT });
    if (!profile) throw new NotFoundException('Compte introuvable');
    return profile; // artisan = null pour un compte USER
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Compte introuvable');

    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;

    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase();
      if (email !== user.email) {
        // Changer l'email demande le mot de passe actuel
        if (!(await bcrypt.compare(dto.currentPassword!, user.passwordHash))) {
          throw new ForbiddenException('Mot de passe actuel incorrect');
        }
        if (await this.findByEmail(email)) {
          throw new ConflictException('Cet email est déjà utilisé');
        }
        data.email = email;
      }
    }

    try {
      return await this.prisma.user.update({ where: { id }, data, select: PROFILE_SELECT });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      throw e;
    }
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Compte introuvable');

    if (!(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new ForbiddenException('Mot de passe actuel incorrect');
    }
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException("Le nouveau mot de passe doit être différent de l'ancien");
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
    return { changed: true };
  }
}
