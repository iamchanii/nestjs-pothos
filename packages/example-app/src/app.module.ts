import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PothosModule, SchemaBuilderToken } from '@smatch-corp/nestjs-pothos';
import { printSchema } from 'graphql';
import { Builder, createBuilder } from 'src/builder/builder';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    // PostModule,
    // CommentModule,
    PothosModule.forRoot({
      builder: {
        inject: [PrismaService],
        useFactory: (prisma: PrismaService) => createBuilder(prisma),
      },
      loadGqlModule: () =>
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          inject: [ModuleRef],
          useFactory: async (moduleRef: ModuleRef) => {
            const builder = moduleRef.get(SchemaBuilderToken);
            // const schema = builder.toSchema();
            // console.log(printSchema(schema));

            return {
              schema: {} as any,
              playground: true,
            };
          },
        }),
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
