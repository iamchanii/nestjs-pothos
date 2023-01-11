import { Inject, Injectable } from '@nestjs/common';
import { Pothos, SchemaBuilderToken } from '@smatch-corp/nestjs-pothos';
import { Builder } from 'src/builder/builder';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly prisma: PrismaService,
  ) {}

  @Pothos()
  post() {
    return this.builder.prismaObject('Post', {
      fields: t => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        content: t.exposeString('content'),
        author: t.relation('author'),
      }),
    });
  }

  @Pothos()
  init(): void {
    this.builder.queryFields(t => ({
      posts: t.prismaField({
        type: [this.post()],
        resolve: (query) => this.prisma.post.findMany({ ...query }),
      }),
    }));
  }
}
