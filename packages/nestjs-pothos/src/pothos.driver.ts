import { ApolloDriver } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { GqlModuleOptions } from '@nestjs/graphql';
import { SchemaBuilderToken } from './constants';

@Injectable()
export class PothosApolloDriver extends ApolloDriver {
  constructor(private readonly modulesContainer: ModulesContainer) {
    super(modulesContainer);
  }

  start(options: GqlModuleOptions<any>): Promise<void> {
    let schemaBuilder: InstanceWrapper = null as never;

    for (const mod of this.modulesContainer.values()) {
      schemaBuilder = Array.from(mod.providers.values()).find(({ token }) => token === SchemaBuilderToken)!;

      if (schemaBuilder) {
        break;
      }
    }

    const schema = schemaBuilder.instance.toSchema();

    return super.start({ ...options, schema });
  }
}
