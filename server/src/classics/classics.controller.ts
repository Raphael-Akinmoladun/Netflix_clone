import { Controller, DefaultValuePipe, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ArchiveService, type ClassicCategory } from './archive.service.js';
import { CATALOG, DEMO_ENTRY } from './classics.catalog.js';

@Controller('classics')
export class ClassicsController {
  constructor(private archiveService: ArchiveService) {}

  @Get()
  getCategory(
    @Query('category', new DefaultValuePipe('classics'), new ParseEnumPipe(Object.keys(CATALOG)))
    category: ClassicCategory,
  ) {
    return this.archiveService.getCategory(category);
  }

  @Get('demo')
  getDemo() {
    return this.archiveService.getDetails(DEMO_ENTRY.id);
  }

  @Get(':id')
  getDetails(@Param('id') id: string) {
    return this.archiveService.getDetails(id);
  }
}
