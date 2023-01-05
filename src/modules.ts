import { DynamicModule, Inject, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { BUILDER, POTHOS_REF, SCHEMA_LIST } from './constants';
import { PothosModuleOptions } from './interfaces';
import { AbstractSchema } from './schema';
import { PothosSchemaService } from './services';

@Module({})
export class PothosModule {
  private pothosRefMap = new Map();

  static register(options: PothosModuleOptions): DynamicModule {
    return {
      global: options.isGlobal ?? true,
      module: PothosModule,
      imports: [DiscoveryModule, ...options.imports],
      providers: [
        PothosSchemaService,
        { provide: BUILDER, ...options.builder },
        { provide: SCHEMA_LIST, inject: options.schemas as any, useFactory: (...schemas) => schemas },
        ...options.schemas,
      ],
      exports: [PothosSchemaService],
    };
  }

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
    @Inject(BUILDER) private readonly builder: PothosSchemaTypes.SchemaBuilder<any>,
    @Inject(SCHEMA_LIST) private readonly schemaList: AbstractSchema<any>[],
  ) {
    this.discovery.getProviders()
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        this.scanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          methodName => {
            const metadata = this.reflector.get(POTHOS_REF, instance[methodName]);
            if (!metadata) {
              return;
            }

            const methodRef = instance[methodName];

            instance[methodName] = () => {
              if (this.pothosRefMap.has(methodRef)) {
                return this.pothosRefMap.get(methodRef);
              }

              const pothosRef = methodRef.call(instance, this.builder);
              this.pothosRefMap.set(methodRef, pothosRef);

              return pothosRef;
            };

            instance[methodName]();
          },
        );
      });
  }
}
