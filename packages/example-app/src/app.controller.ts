import { All, Controller, Req, Res } from '@nestjs/common';
import { PothosSchemaService } from '@smatch-corp/nestjs-pothos';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import { createYoga, YogaServerInstance } from 'graphql-yoga';
import { SchemaContext } from 'src/builder/builder';

@Controller()
export class AppController {
  schema: GraphQLSchema = null as never;
  yoga: YogaServerInstance<any, any> = null as never;

  constructor(private readonly pothosSchemaService: PothosSchemaService) {
    this.init();
  }

  private init() {
    this.schema = this.pothosSchemaService.toSchema();

    this.yoga = createYoga({
      plugins: [],
      schema: this.schema,
    });
  }

  @All('graphql')
  graphql(@Req() req: Request, @Res() res: Response) {
    const context: SchemaContext = {
      req,
    };

    this.yoga(req, res, context);
  }
}
