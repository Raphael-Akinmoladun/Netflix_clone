import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { MoviesModule } from './movies/movies.module.js';
import { WatchlistModule } from './watchlist/watchlist.module.js';
import { ClassicsModule } from './classics/classics.module.js';
import configuration from './config/configuration.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    WatchlistModule,
    ClassicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
