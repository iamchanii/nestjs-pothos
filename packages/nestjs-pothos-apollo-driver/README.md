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

### Use `SchemaBuilder` and `@PothosRef`, `@PothosInit`

Now you can use own SchemaBuilder by `@Inject(SchemaBuilderToken)`. use it with `@PothosRef` and `@PothosInit` decorators.

```ts
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

Add your injectable class it used `@PothosRef` or `@PothosInit` to module's providers and import from your application module.

```ts
// user.module.ts
@Module({
  providers: [UserSchema],
})
export class UserModule {}

// app.module.ts
@Module({
  imports: [
    PrismaModule,
    UserModule,
    PothosModule.forRoot({ /* ... */ }),
  ],
})
export class AppModule {}
```

You can get your `GraphQLSchema` by `SchemaBuilderService.getSchema()`. so you can set up your GraphQL endpoint as you want. below is an example of using `GraphQLModule`.

```ts
@Module({
  imports: [
    PrismaModule,
    UserModule,
    PothosModule.forRoot({ /* ... */ }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [SchemaBuilderService],
      useFactory: async (schemaBuilder: SchemaBuilderService) => {
        const schema = schemaBuilder.getSchema();

        return {
          schema,
          playground: true,
          // ...
        };
      },
    }),
  ],
})
export class AppModule {}
```

To check working example, please refer [example-app](https://github.com/smatch-corp/nestjs-pothos/blob/main/packages/example-app) package.

## License

MIT