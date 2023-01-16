import { Inject, Injectable } from '@nestjs/common';
import { Pothos, PothosRef, PothosSchema, SchemaBuilderToken } from '@smatch-corp/nestjs-pothos';
import { Builder } from 'src/builder/builder';
import { PostSchema } from 'src/post/post.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSchema } from 'src/user/user.schema';

@Injectable()
export class CommentSchema extends PothosSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly userSchema: UserSchema,
    private readonly postSchema: PostSchema,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  @PothosRef()
  comment() {
    return this.builder.prismaObject('Comment', {
      fields: t => ({
        id: t.exposeID('id'),
        content: t.exposeString('content'),
        writer: t.prismaField({
          type: this.userSchema.user(),
          resolve: (query, parent) =>
            this.prisma.user.findFirstOrThrow({
              ...query,
              where: { id: parent.writerId },
            }),
        }),
        post: t.prismaField({
          type: this.postSchema.post(),
          resolve: (query, parent) =>
            this.prisma.post.findFirstOrThrow({
              ...query,
              where: { id: parent.postId },
            }),
        }),
      }),
    });
  }

  @Pothos()
  init() {
    this.builder.queryFields(t => ({
      comments: t.prismaField({
        type: [this.comment()],
        resolve: (query) => this.prisma.comment.findMany({ ...query }),
      }),
    }));
  }
}
