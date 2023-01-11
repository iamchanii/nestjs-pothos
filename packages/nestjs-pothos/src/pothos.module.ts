import { DynamicModule, Module } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { SchemaBuilderToken } from './constants';
import { PothosModuleOptions } from './interfaces';
import { PothosCache } from './pothos.cache';
import { PothosDecoratorExplorer } from './pothos.explorer';
import { PothosSchema } from './pothos.schema';

@Module({})
export class PothosModule {
  static forRoot(options: PothosModuleOptions): DynamicModule {
    const SchemaBuilderProvider = {
      provide: SchemaBuilderToken,
      ...options.builder,
    };

    return {
      global: true,
      module: PothosModule,
      providers: [
        MetadataScanner,
        SchemaBuilderProvider,
        PothosDecoratorExplorer,
        PothosSchema,
        PothosCache,
      ],
      exports: [
        SchemaBuilderProvider,
        PothosDecoratorExplorer,
        PothosSchema,
        PothosCache,
      ],
    };
  }
}
