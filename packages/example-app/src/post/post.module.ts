import { Module } from '@nestjs/common';
import { PostSchema } from './post.schema';

@Module({
  providers: [PostSchema],
})
export class PostModule {}
