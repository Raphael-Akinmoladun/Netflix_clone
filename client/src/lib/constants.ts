export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_W500 = `${TMDB_IMAGE_BASE}/w500`;
export const TMDB_BACKDROP_ORIGINAL = `${TMDB_IMAGE_BASE}/original`;
export const TMDB_BACKDROP_W1280 = `${TMDB_IMAGE_BASE}/w1280`;

export const FEATURED_GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 99, name: 'Documentary' },
  { id: 16, name: 'Animation' },
];

// Movie type shared across the app
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids?: number[];
  vote_average: number;
  popularity?: number;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genres: { id: number; name: string }[];
  vote_average: number;
  runtime: number;
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  similar: {
    results: Movie[];
  };
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Watchlist movie (from our DB)
export interface WatchlistMovie {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  genres: number[];
}
