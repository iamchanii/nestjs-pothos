import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaTypes from '@pothos/plugin-prisma/generated';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

export interface SchemaContext {
  req: Request;
}

interface SchemaBuilderOption {
  Context: SchemaContext;
  PrismaTypes: PrismaTypes;
}

export function createBuilder(client: PrismaClient) {
  const builder = new SchemaBuilder<SchemaBuilderOption>({
    plugins: [PrismaPlugin],
    prisma: { client },
  });

  builder.queryType({});

  return builder;
}

export type Builder = ReturnType<typeof createBuilder>;
