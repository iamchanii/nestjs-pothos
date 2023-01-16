import { Module } from '@nestjs/common';
import { PostSchema } from './post.schema';

@Module({
  providers: [PostSchema],
  exports: [PostSchema],
})
export class PostModule {}
