import { FactoryProvider, ValueProvider } from '@nestjs/common';

export interface PothosModuleOptions {
  /**
   * A provider of BuilderSchema that will inject into PothosSchemaService
   */
  builder:
    | Omit<FactoryProvider<any>, 'provide'>
    | Omit<ValueProvider<any>, 'provide'>;
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
