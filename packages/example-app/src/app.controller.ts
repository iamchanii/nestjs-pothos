import { All, Controller, Inject, OnModuleInit, Req, Res } from '@nestjs/common';
import { BUILDER_TOKEN } from '@smatch-corp/nestjs-pothos';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import { createYoga, YogaServerInstance } from 'graphql-yoga';
import { Builder, SchemaContext } from 'src/builder/builder';

@Controller()
export class AppController implements OnModuleInit {
  schema: GraphQLSchema = null as never;
  yoga: YogaServerInstance<any, any> = null as never;

  constructor(@Inject(BUILDER_TOKEN) private readonly builder: Builder) {
  }

  onModuleInit() {
    this.schema = this.builder.toSchema();

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
