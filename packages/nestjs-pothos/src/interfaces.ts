import { FactoryProvider, ValueProvider } from '@nestjs/common';
import type {} from '@pothos/core';
import { InternalPothosDecoratorToken, InternalPothosRefDecoratorToken } from './constants';

export interface PothosModuleOptions {
  /**
   * A provider of BuilderSchema that will inject into PothosSchemaService
   */
  builder:
    | Omit<FactoryProvider<PothosSchemaTypes.SchemaBuilder<any>>, 'provide'>
    | Omit<ValueProvider<PothosSchemaTypes.SchemaBuilder<any>>, 'provide'>;
}

/**
 * An interface of Pothos and PothosRef decorator's metadata.
 */
export interface PothosDecoratorMetadata {
  target: string;
  methodName: string | symbol;
  callback: Function | undefined;
  isPothosRefDecorator: boolean;
}
