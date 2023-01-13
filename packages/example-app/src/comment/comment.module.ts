import { Module } from '@nestjs/common';
import { PostSchema } from 'src/post/post.schema';
import { CommentSchema } from './comment.schema';

@Module({
  providers: [PostSchema, CommentSchema],
})
export class CommentModule {}
