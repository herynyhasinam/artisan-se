import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateArtisanDto } from './dto/update-artisan.dto';

// Ce que le public peut voir
const PUBLIC_SELECT = {
  id: true,
  name: true,
  trade: true,
  neighborhood: true,
  city: true,
  phone: true,
  description: true,
  recommendations: true,
  createdAt: true,
} satisfies Prisma.ArtisanSelect;

@Injectable()
export class ArtisansService {
  constructor(private prisma: PrismaService) {}

  findAll(trade?: string, neighborhood?: string) {
    return this.prisma.artisan.findMany({
      where: {
        ...(trade && { trade: { contains: trade, mode: 'insensitive' } }),
        ...(neighborhood && { neighborhood: { contains: neighborhood, mode: 'insensitive' } }),
      },
      select: PUBLIC_SELECT,
      orderBy: [{ recommendations: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async recommend(id: number) {
    try {
      return await this.prisma.artisan.update({
        where: { id },
        data: { recommendations: { increment: 1 } },
        select: PUBLIC_SELECT,
      });
    } catch {
      throw new NotFoundException('Artisan introuvable');
    }
  }

  async findMine(userId: number) {
    const mine = await this.prisma.artisan.findUnique({ where: { userId } });
    if (!mine) throw new NotFoundException('Fiche introuvable');
    return mine;
  }

  async updateMine(userId: number, dto: UpdateArtisanDto) {
    const mine = await this.findMine(userId);
    if (dto.phone && dto.phone !== mine.phone) {
      const dup = await this.prisma.artisan.findFirst({
        where: { phone: dto.phone, id: { not: mine.id } },
      });
      if (dup) throw new ConflictException('Un artisan avec ce numéro existe déjà');
    }
    return this.prisma.artisan.update({ where: { id: mine.id }, data: dto });
  }
}
