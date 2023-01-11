import { Controller, Get, OnModuleInit, Post } from '@nestjs/common';

// import { SchemaBuilderService } from '@smatch-corp/nestjs-pothos';

@Controller('')
export class AppController implements OnModuleInit {
  constructor(
    // private readonly schemaBuilderService: SchemaBuilderService,
  ) {
    //
  }

  onModuleInit() {
    // this.schemaBuilderService.getSchema();
  }

  @Post('graphql')
  @Get('graphql')
  graphql() {
    return '';
  }
}
