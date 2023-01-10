import { Inject, Injectable } from '@nestjs/common';
import { AbstractSchema, BUILDER_TOKEN, PothosRef } from '@smatch-corp/nestjs-pothos';
import { Builder } from 'src/builder/builder';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserSchema implements AbstractSchema<Builder> {
  constructor(
    @Inject(BUILDER_TOKEN) private readonly builder: Builder,
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

  init(): void {
    this.builder.queryFields(t => ({
      users: t.prismaField({
        type: [this.user()],
        resolve: (query) => this.prisma.user.findMany({ ...query }),
      }),
    }));
  }
}
