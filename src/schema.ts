import type {} from '@pothos/core';

export interface AbstractSchema<TBuilder extends PothosSchemaTypes.SchemaBuilder<any>> {
  init(builder: TBuilder): void;
}
