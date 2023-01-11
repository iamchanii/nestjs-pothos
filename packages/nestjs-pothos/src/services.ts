import { Inject } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, ModulesContainer, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InternalPothosInitToken, InternalPothosRefToken, SchemaBuilderToken } from './constants';

export class SchemaBuilderService {
  private readonly pothosRefMap = new Map();

  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: PothosSchemaTypes.SchemaBuilder<any>,
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {
  }

  private exploreDecoratedMethods() {
    type ExploreResult = {
      token: typeof InternalPothosInitToken | typeof InternalPothosRefToken;
      instance: InstanceWrapper;
      methodName: string;
    };

    const methods: ExploreResult[] = [];

    const instanceWrappers = this.discovery.getProviders()
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance));

    instanceWrappers.forEach(({ instance }) => {
      this.scanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), methodName => {
        if (this.reflector.get(InternalPothosInitToken, instance[methodName])) {
          methods.push({ token: InternalPothosInitToken, instance, methodName });
          return;
        }

        if (this.reflector.get(InternalPothosRefToken, instance[methodName])) {
          methods.push({ token: InternalPothosRefToken, instance, methodName });
          return;
        }
      });
    });

    return methods;
  }

  private loadSchema() {
    const decoratedMethods = this.exploreDecoratedMethods();

    for (const { token, instance, methodName } of decoratedMethods) {
      switch (token) {
        // If method decorated with @PothosInit, do nothing.
        case InternalPothosInitToken:
          break;

        // If method decroated with @PothosRef:
        case InternalPothosRefToken: {
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

          break;
        }
      }

      // Finally, call dcorated methods to process Pothos.
      instance[methodName].call(instance);
    }
  }

  getSchema() {
    this.loadSchema();

    return this.builder.toSchema();
  }
}
