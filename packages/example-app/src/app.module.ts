import { Module } from '@nestjs/common';
import { PothosModule } from '@smatch-corp/nestjs-pothos';
import { createBuilder } from 'src/builder/builder';
import { PostSchema } from 'src/post/post.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSchema } from 'src/user/user.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    PothosModule.register({
      imports: [UserModule, PostModule],
      schemas: [UserSchema, PostSchema],
      builder: {
        inject: [PrismaService],
        useFactory: (prisma: PrismaService) => createBuilder(prisma),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
