import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PothosModule, SchemaBuilderService } from '@smatch-corp/nestjs-pothos';
import { createBuilder } from 'src/builder/builder';
import { PostModule } from 'src/post/post.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    PothosModule.forRoot({
      builder: {
        inject: [PrismaService],
        useFactory: (prisma: PrismaService) => createBuilder(prisma),
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [SchemaBuilderService],
      useFactory: async (schemaBuilder: SchemaBuilderService) => {
        const schema = schemaBuilder.getSchema();

        return {
          schema,
          playground: true,
        };
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
