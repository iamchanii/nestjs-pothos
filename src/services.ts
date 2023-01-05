import { Inject, Injectable } from '@nestjs/common';
import { BUILDER, SCHEMA_LIST } from './constants';
import { AbstractSchema } from './schema';

@Injectable()
export class PothosSchemaService {
  constructor(
    @Inject(BUILDER) private readonly builder: PothosSchemaTypes.SchemaBuilder<any>,
    @Inject(SCHEMA_LIST) private readonly schemaList: AbstractSchema<any>[],
  ) {
    this.schemaList.forEach(schema => {
      schema.init(this.builder);
    });
  }

  toSchema(options?: PothosSchemaTypes.BuildSchemaOptions<any>) {
    return this.builder.toSchema(options);
  }
}
