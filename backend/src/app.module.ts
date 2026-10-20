import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ArtisansModule } from './artisans/artisans.module';

@Module({
  imports: [PrismaModule, ArtisansModule],
})
export class AppModule {}
