import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { WatchlistService, type AddToWatchlistDto } from './watchlist.service.js';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Get()
  getWatchlist(@Request() req: { user: { userId: string } }) {
    return this.watchlistService.getWatchlist(req.user.userId);
  }

  @Post(':tmdbId')
  addToWatchlist(
    @Request() req: { user: { userId: string } },
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Body() body: Omit<AddToWatchlistDto, 'tmdbId'>,
  ) {
    return this.watchlistService.addToWatchlist(req.user.userId, { ...body, tmdbId });
  }

  @Delete(':tmdbId')
  removeFromWatchlist(
    @Request() req: { user: { userId: string } },
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.watchlistService.removeFromWatchlist(req.user.userId, tmdbId);
  }

  @Get('check/:tmdbId')
  async checkWatchlist(
    @Request() req: { user: { userId: string } },
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    const inWatchlist = await this.watchlistService.isInWatchlist(req.user.userId, tmdbId);
    return { inWatchlist };
  }
}
