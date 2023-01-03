# nestjs-pothos

Use pothos as GraphQL schema builder in Nest.js application.

## Installation

```bash
$ yarn add @smatch-corp/nestjs-pothos
```

## Getting Started

At first, define some schemas that implements `AbstractSchema` abstract class.

```typescript
import { Injectable } from '@nestjs/common';
import { AbstractSchema } from '@smatch-corp/nestjs-pothos';

@Injectable()
export class UserSchema implements AbstractSchema {
  constructor() {}

  init(builder: SchemaBuilder) {
    const UserRef = builder.objectRef<{ name: string }>('User').implement({
      fields: (t) => ({
        name: t.exposeString('name'),
      }),
    });

    builder.queryField('me', (t) =>
      t.field({
        type: UserRef,
        resolve() {
          return { name: 'John' };
        },
      })
    );
  }
}
```

Then, import `PothosModule` inside your `AppModule`.

```typescript
import { Module } from '@nestjs/common';
import { PothosModule } from '@smatch-corp/nestjs-pothos';

@Module({
  imports: [
    PothosModule.register({
      schemas: [UserSchema]
      builder: {
        useFactory() {
          return createSchemaBuilder();
        }
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}****
```

Now you can use `PothosSchemaService`. use it your controllers or anything else.

## License

MIT
