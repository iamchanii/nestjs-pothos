# nestjs-pothos

Use pothos as GraphQL schema builder in Nest.js application.

## Caution

This is **NOT** production ready yet. API, Module, Service may be have some break changes.

## Installation

```bash
$ yarn add @smatch-corp/nestjs-pothos
```

## Getting Started

### 1. Write a factory to create own SchemaBuilder

And you have to get a type and export it of your SchemaBuilder.

```ts
interface SchemaBuilderOption {}

export function createBuilder() {
  const builder = new SchemaBuilder<SchemaBuilderOption>({
    plugins: [],
  });

  builder.queryType({});
  // builder.mutationType({});
  // builder.subscriptionType({});

  return builder;
}

export type Builder = ReturnType<typeof createBuilder>
```

### 2. Use `@PothosRef`, `@PothosInit` decorators

The `@PothosRef` decorator is (TBD)

```ts
@Injectable()
export class UserSchema {
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
}
```

And `@PothosInit` decorator is (TBD)

```ts
@Injectable()
export class UserSchema {
  constructor(
    @Inject(BUILDER_TOKEN) private readonly builder: Builder,
    private readonly prisma: PrismaService,
  ) {}

  @PothosRef()
  user() {
    // ...
  }

  @PothosInit()
  init() {
    this.builder.queryFields(t => ({
      users: t.prismaField({
        type: [this.user()],
        resolve: (query) => this.prisma.user.findMany({ ...query }),
      }),
    }));
  }
}
```

### 3. Export your schema

```ts
@Module({
  providers: [UserSchema],
})
export class UserModule {}
```

### 4. Add `PothosModule` into your root module

```ts
@Module({
  imports: [
    UserModule,
    PothosModule.forRoot({
      builder: {
        useFactory: createBuilder,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Now you can use your SchemaBuilder by `@Inject(BUILDER_TOKEN)`. use it your controllers or anything else.

```ts
@Controller()
export class AppController implements OnModuleInit {
  schema: GraphQLSchema = null as never;
  yoga: YogaServerInstance<any, any> = null as never;

  constructor(@Inject(BUILDER_TOKEN) private readonly builder: Builder) {
  }

  onModuleInit() {
    this.schema = this.builder.toSchema();

    this.yoga = createYoga({
      plugins: [],
      schema: this.schema,
    });
  }

  @All('graphql')
  graphql(@Req() req: Request, @Res() res: Response) {
    const context: SchemaContext = {
      req,
    };

    this.yoga(req, res, context);
  }
}
```

## License

MIT
