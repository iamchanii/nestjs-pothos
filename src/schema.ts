import type {} from '@pothos/core';

export abstract class AbstractSchema<
  TBuilder extends PothosSchemaTypes.SchemaBuilder<any> = PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<any>
  >,
> {
  abstract init(builder: TBuilder): void;
}
