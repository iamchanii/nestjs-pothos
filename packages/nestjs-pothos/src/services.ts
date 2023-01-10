import { Inject, Injectable } from '@nestjs/common';
import { BUILDER_TOKEN, SCHEMA_LIST_TOKEN } from './constants';
import { AbstractSchema } from './schema';

@Injectable()
export class PothosSchemaService {
  constructor(
    @Inject(BUILDER_TOKEN) private readonly builder: PothosSchemaTypes.SchemaBuilder<any>,
    @Inject(SCHEMA_LIST_TOKEN) private readonly schemaList: AbstractSchema<any>[],
  ) {
    this.schemaList.forEach(schema => {
      schema.init(this.builder);
    });
  }

  toSchema(options?: PothosSchemaTypes.BuildSchemaOptions<any>) {
    return this.builder.toSchema(options);
  }
}
