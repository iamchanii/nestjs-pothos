import { applyDecorators, SetMetadata } from '@nestjs/common';
import { InternalPothosInitToken, InternalPothosRefToken } from './constants';

export function PothosRef() {
  return applyDecorators(
    SetMetadata(InternalPothosRefToken, true),
  );
}

export function PothosInit() {
  return applyDecorators(
    SetMetadata(InternalPothosInitToken, true),
  );
}
