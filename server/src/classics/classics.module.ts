import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service.js';
import { ClassicsController } from './classics.controller.js';

@Module({
  controllers: [ClassicsController],
  providers: [ArchiveService],
})
export class ClassicsModule {}
