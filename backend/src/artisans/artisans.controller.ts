import {
  Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ArtisansService } from './artisans.service';
import { UpdateArtisanDto } from './dto/update-artisan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

type AuthUser = { id: number };

@Controller('artisans')
export class ArtisansController {
  constructor(private readonly service: ArtisansService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('trade') trade?: string, @Query('neighborhood') neighborhood?: string) {
    return this.service.findAll(trade, neighborhood);
  }

  // --- Ma fiche : réservé aux comptes ARTISAN (avant les routes :id) ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN)
  @Get('me')
  findMine(@CurrentUser() user: AuthUser) {
    return this.service.findMine(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN)
  @Patch('me')
  updateMine(@CurrentUser() user: AuthUser, @Body() dto: UpdateArtisanDto) {
    return this.service.updateMine(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/recommend')
  recommend(@Param('id', ParseIntPipe) id: number) {
    return this.service.recommend(id);
  }
}
