import { DynamicModule, Module, Provider } from '@nestjs/common';
import { BUILDER, SCHEMA_LIST } from './constants';
import { PothosModuleOptions } from './interfaces';
import { PothosSchemaService } from './services';

@Module({})
export class PothosModule {
  static register(options: PothosModuleOptions): DynamicModule {
    const builderProvider: Provider = { provide: BUILDER, ...options.builder };

    return {
      global: options.isGlobal ?? true,
      module: PothosModule,
      imports: [...options.imports],
      providers: [
        ...options.schemas,
        PothosSchemaService,
        builderProvider,
        {
          provide: SCHEMA_LIST,
          inject: options.schemas as any,
          useFactory: (...schemas) => schemas,
        },
      ],
      exports: [PothosSchemaService],
    };
  }
}
