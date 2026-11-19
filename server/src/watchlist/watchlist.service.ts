import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, type UserDocument } from '../users/schemas/user.schema.js';
import { Movie, type MovieDocument } from '../movies/schemas/movie.schema.js';

export interface AddToWatchlistDto {
  tmdbId: number;
  title: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  genres?: number[];
}

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async addToWatchlist(userId: string, dto: AddToWatchlistDto) {
    // Upsert the movie in the movies collection
    const movie = await this.movieModel.findOneAndUpdate(
      { tmdbId: dto.tmdbId },
      {
        tmdbId: dto.tmdbId,
        title: dto.title,
        overview: dto.overview,
        posterPath: dto.posterPath,
        backdropPath: dto.backdropPath,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
        genres: dto.genres,
      },
      { upsert: true, returnDocument: 'after' },
    );

    // Add movie to user's watchlist if not already there
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: movie._id } },
    );

    return { message: 'Added to watchlist', movieId: movie._id };
  }

  async removeFromWatchlist(userId: string, tmdbId: number) {
    const movie = await this.movieModel.findOne({ tmdbId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: movie._id } },
    );

    return { message: 'Removed from watchlist' };
  }

  async getWatchlist(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('watchlist')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.watchlist;
  }

  async isInWatchlist(userId: string, tmdbId: number): Promise<boolean> {
    const movie = await this.movieModel.findOne({ tmdbId });
    if (!movie) return false;

    const user = await this.userModel.findById(userId);
    if (!user) return false;

    return user.watchlist.some(
      (id) => id.toString() === movie._id.toString(),
    );
  }
}
