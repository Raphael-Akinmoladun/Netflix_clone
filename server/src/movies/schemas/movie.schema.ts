import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, unique: true })
  tmdbId: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  overview: string;

  @Prop()
  posterPath: string; // URL path from TMDB

  @Prop()
  backdropPath: string;

  @Prop()
  releaseDate: Date;

  @Prop([Number])
  genres: number[]; // Array of TMDB genre IDs
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
