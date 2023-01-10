import { Module } from '@nestjs/common';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserSchema],
})
export class UserModule {}
