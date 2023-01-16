import { Global, Module } from '@nestjs/common';
import { UserSchema } from './user.schema';

@Global()
@Module({
  providers: [UserSchema],
  exports: [UserSchema],
})
export class UserModule {}
