# @smatch-corp/nestjs-pothos

Use pothos as GraphQL schema builder in Nest.js application.

## Caution

This is **NOT** production ready yet. API, Module, Service may be have some break changes.

## Getting Started

### Installation

```bash
$ yarn add @smatch-corp/nestjs-pothos
```

### Setup

Write a factory to create own `SchemaBuilder` and you have to get a type and export it of your `SchemaBuilder`.

```ts
// builder.ts
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

Add `PothosModule` into your AppModule.

```ts
@Module({
  imports: [
    // ...
    PothosModule.forRoot({
      builder: {
        useFactory: createBuilder,
      },
    }),
  ],
  controllers: [/* ... */],
  providers: [/* ... */],
})
export class AppModule {}
```

If you're using Pothos with Prisma, you can inject your `PrismaClient` and pass to your factory function as parameter.

```ts
@Module({
  imports: [
    // ...
    PrismaModule,
    PothosModule.forRoot({
      builder: {
        inject: [PrismaService],
        useFactory: (prisma) => createBuilder(prisma),
      },
    }),
  ],
  controllers: [/* ... */],
  providers: [/* ... */],
})
export class AppModule {}
```

### Usage

```ts
@Injectable()
export class UserSchema extends PothosSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

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

  @Pothos()
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

- `PothosSchema` is a class that helps create a GraphQL schema using the Pothos. It's often used by other classes to define different types and fields in the schema.

- The `@PothosRef()` decorator is used to make a Pothos's ref object, which represents a specific model or resource in the schema.

- The `@Pothos()` decorator is used to set up the schema, usually by defining fields on the root Query type. These fields determine how data is retrieved from the backend and can include resolvers that query a specific model or resource.

Now you can get executable GraphQL Schema via `builder` which injected by `@Inject(SchemaBuilderToken)`.

## License

MIT