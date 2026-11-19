import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('tmdb.apiKey')!;
    this.baseUrl = this.configService.get<string>('tmdb.baseUrl')!;
  }

  private async fetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.set('api_key', this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await globalThis.fetch(url.toString());
    if (!response.ok) {
      throw new HttpException(
        `TMDB API error: ${response.statusText}`,
        response.status,
      );
    }
    return response.json() as Promise<T>;
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week') {
    return this.fetch<TmdbListResponse>(`/trending/movie/${timeWindow}`);
  }

  async getPopular(page = 1) {
    return this.fetch<TmdbListResponse>('/movie/popular', { page: String(page) });
  }

  async getTopRated(page = 1) {
    return this.fetch<TmdbListResponse>('/movie/top_rated', { page: String(page) });
  }

  async getByGenre(genreId: number, page = 1) {
    return this.fetch<TmdbListResponse>('/discover/movie', {
      with_genres: String(genreId),
      page: String(page),
      sort_by: 'popularity.desc',
    });
  }

  async getGenres() {
    return this.fetch<{ genres: TmdbGenre[] }>('/genre/movie/list');
  }

  async getMovieDetails(tmdbId: number) {
    return this.fetch<TmdbMovieDetails>(`/movie/${tmdbId}`, {
      append_to_response: 'videos,similar',
    });
  }

  async searchMovies(query: string, page = 1) {
    return this.fetch<TmdbListResponse>('/search/movie', {
      query,
      page: String(page),
    });
  }
}

// TMDB response types
export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
}

export interface TmdbListResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genres: TmdbGenre[];
  vote_average: number;
  runtime: number;
  videos: { results: TmdbVideo[] };
  similar: TmdbListResponse;
}
