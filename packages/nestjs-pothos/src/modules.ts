import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { BUILDER_TOKEN, POTHOS_INIT_TOKEN, POTHOS_REF_TOKEN } from './constants';
import { PothosModuleOptions } from './interfaces';

@Module({})
export class PothosModule implements OnModuleInit {
  private pothosRefMap = new Map();

  static forRoot(options: PothosModuleOptions): DynamicModule {
    const builder = { provide: BUILDER_TOKEN, ...options.builder };

    return {
      global: true,
      module: PothosModule,
      imports: [DiscoveryModule],
      providers: [builder],
      exports: [builder],
    };
  }

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {
  }
  onModuleInit() {
    const instanceWrappers = this.discovery.getProviders()
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance));

    instanceWrappers.forEach(({ instance }) => {
      this.scanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), methodName => {
        const metadata = this.reflector.get(POTHOS_REF_TOKEN, instance[methodName]);
        if (!metadata) {
          return;
        }

        // Take origin method reference
        const methodRef = instance[methodName];

        // Override method that used @PothosRef decorator.
        instance[methodName] = () => {
          if (this.pothosRefMap.has(methodRef)) {
            return this.pothosRefMap.get(methodRef);
          }

          const pothosRef = methodRef.call(instance);
          this.pothosRefMap.set(methodRef, pothosRef);

          return pothosRef;
        };

        // Call overrided method
        instance[methodName].call(instance);
      });
    });

    instanceWrappers.forEach(({ instance }) => {
      this.scanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), methodName => {
        const metadata = this.reflector.get(POTHOS_INIT_TOKEN, instance[methodName]);
        if (!metadata) {
          return;
        }

        // Call method that used @PothosInit decorator
        instance[methodName].call(instance);
      });
    });
  }
}
