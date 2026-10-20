import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ArtisansService } from './artisans.service';
import { CreateArtisanDto } from './dto/create-artisan.dto';

@Controller('artisans')
export class ArtisansController {
  constructor(private readonly service: ArtisansService) {}

  @Get()
  findAll(@Query('trade') trade?: string, @Query('neighborhood') neighborhood?: string) {
    return this.service.findAll(trade, neighborhood);
  }

  @Post()
  create(@Body() dto: CreateArtisanDto) {
    return this.service.create(dto);
  }

  @Post(':id/recommend')
  recommend(@Param('id', ParseIntPipe) id: number) {
    return this.service.recommend(id);
  }
}
