import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PothosModule } from '@smatch-corp/nestjs-pothos';
import { PothosApolloDriver } from '@smatch-corp/nestjs-pothos-apollo-driver';
import { createBuilder } from 'src/builder/builder';
import { CommentModule } from 'src/comment/comment.module';
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
    CommentModule,
    PothosModule.forRoot({
      builder: {
        inject: [PrismaService],
        useFactory: (prisma: PrismaService) => createBuilder(prisma),
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: PothosApolloDriver,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
