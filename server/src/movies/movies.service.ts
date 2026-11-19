import { Injectable } from '@nestjs/common';
import { TmdbService } from './tmdb.service.js';

@Injectable()
export class MoviesService {
  constructor(private tmdbService: TmdbService) {}

  getTrending(timeWindow: 'day' | 'week' = 'week') {
    return this.tmdbService.getTrending(timeWindow);
  }

  getPopular(page = 1) {
    return this.tmdbService.getPopular(page);
  }

  getTopRated(page = 1) {
    return this.tmdbService.getTopRated(page);
  }

  getByGenre(genreId: number, page = 1) {
    return this.tmdbService.getByGenre(genreId, page);
  }

  getGenres() {
    return this.tmdbService.getGenres();
  }

  getMovieDetails(tmdbId: number) {
    return this.tmdbService.getMovieDetails(tmdbId);
  }

  searchMovies(query: string, page = 1) {
    return this.tmdbService.searchMovies(query, page);
  }
}
