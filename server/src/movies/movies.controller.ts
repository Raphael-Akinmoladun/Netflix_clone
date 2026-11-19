import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service.js';

enum TimeWindow {
  Day = 'day',
  Week = 'week',
}

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get('trending')
  getTrending(
    // Restricted to day/week because the value is used in the TMDB URL path
    @Query('timeWindow', new DefaultValuePipe(TimeWindow.Week), new ParseEnumPipe(TimeWindow))
    timeWindow: TimeWindow,
  ) {
    return this.moviesService.getTrending(timeWindow);
  }

  @Get('popular')
  getPopular(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.moviesService.getPopular(page);
  }

  @Get('top-rated')
  getTopRated(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.moviesService.getTopRated(page);
  }

  @Get('genres')
  getGenres() {
    return this.moviesService.getGenres();
  }

  @Get('genre/:genreId')
  getByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.moviesService.getByGenre(genreId, page);
  }

  @Get('search')
  searchMovies(
    @Query('query', new DefaultValuePipe('')) query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.moviesService.searchMovies(query, page);
  }

  @Get(':id')
  getMovieDetails(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieDetails(id);
  }
}
