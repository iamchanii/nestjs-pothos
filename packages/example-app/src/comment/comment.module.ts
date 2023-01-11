import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { PostSchema } from 'src/post/post.schema';
import { CommentSchema } from './comment.schema';

@Module({
  imports: [PostModule],
  providers: [PostSchema, CommentSchema],
})
export class CommentModule {}
