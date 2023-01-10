import { FactoryProvider, ModuleMetadata, Provider, ValueProvider } from '@nestjs/common';
import type {} from '@pothos/core';

export interface PothosModuleOptions {
  /**
   * A provider of BuilderSchema that will inject into PothosSchemaService
   */
  builder:
    | Omit<FactoryProvider<PothosSchemaTypes.SchemaBuilder<any>>, 'provide'>
    | Omit<ValueProvider<PothosSchemaTypes.SchemaBuilder<any>>, 'provide'>;
}
