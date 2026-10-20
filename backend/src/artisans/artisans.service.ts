import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtisanDto } from './dto/create-artisan.dto';

@Injectable()
export class ArtisansService {
  constructor(private prisma: PrismaService) {}

  findAll(trade?: string, neighborhood?: string) {
    return this.prisma.artisan.findMany({
      where: {
        consent: true,
        ...(trade && { trade: { contains: trade, mode: 'insensitive' } }),
        ...(neighborhood && { neighborhood: { contains: neighborhood, mode: 'insensitive' } }),
      },
      orderBy: [{ recommendations: 'desc' }, { createdAt: 'desc' }],
    });
  }

  create(dto: CreateArtisanDto) {
    return this.prisma.artisan.create({ data: dto });
  }

  async recommend(id: number) {
    try {
      return await this.prisma.artisan.update({
        where: { id },
        data: { recommendations: { increment: 1 } },
      });
    } catch {
      throw new NotFoundException('Artisan introuvable');
    }
  }
}
