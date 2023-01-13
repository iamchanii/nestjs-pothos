import { ApolloDriver } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import type { GqlModuleOptions } from '@nestjs/graphql';
import { SchemaBuilderToken } from '@smatch-corp/nestjs-pothos';

@Injectable()
export class PothosApolloDriver extends ApolloDriver {
  constructor(private readonly modulesContainer: ModulesContainer) {
    super(modulesContainer);
  }

  start(options: GqlModuleOptions<any>): Promise<void> {
    let schemaBuilder: InstanceWrapper | null = null;

    for (const mod of this.modulesContainer.values()) {
      schemaBuilder = Array.from(mod.providers.values()).find(({ token }) => token === SchemaBuilderToken)!;

      if (schemaBuilder) {
        break;
      }
    }

    if (!schemaBuilder) {
      throw Error('Cannot get provided builder as SchemaBuilderToken.');
    }

    return super.start({
      ...options,
      // TODO: apply schema transform (e.g. using mapSchema)
      schema: schemaBuilder.instance.toSchema(),
    });
  }
}
