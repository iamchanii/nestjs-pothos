import { Inject, Injectable } from '@nestjs/common';
import { PothosInit, PothosRef, SchemaBuilderToken } from '@smatch-corp/nestjs-pothos';
import { Builder } from 'src/builder/builder';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly prisma: PrismaService,
  ) {}

  @PothosRef()
  user() {
    return this.builder.prismaObject('User', {
      fields: t => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        posts: t.relation('posts'),
      }),
    });
  }

  @PothosInit()
  init(): void {
    this.builder.queryFields(t => ({
      users: t.prismaField({
        type: [this.user()],
        resolve: (query) => this.prisma.user.findMany({ ...query }),
      }),
    }));
  }
}
