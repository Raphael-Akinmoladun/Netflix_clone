import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Movie } from '../../movies/schemas/movie.schema.js';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  // The watchlist is an array of references to the Movie model
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Movie' }] })
  watchlist: Types.ObjectId[] | Movie[]; 
}

export const UserSchema = SchemaFactory.createForClass(User);
