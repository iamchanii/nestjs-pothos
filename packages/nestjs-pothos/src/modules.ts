import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SchemaBuilderToken } from './constants';
import { PothosModuleOptions } from './interfaces';
import { SchemaBuilderService } from './services';

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
      imports: [DiscoveryModule],
      providers: [SchemaBuilderService, SchemaBuilderProvider],
      exports: [SchemaBuilderService, SchemaBuilderProvider],
    };
  }
}
