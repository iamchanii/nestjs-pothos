import { applyDecorators, SetMetadata } from '@nestjs/common';
import { POTHOS_INIT_TOKEN, POTHOS_REF_TOKEN } from './constants';

export function PothosRef() {
  return applyDecorators(
    SetMetadata(POTHOS_REF_TOKEN, true),
  );
}

export function PothosInit() {
  return applyDecorators(
    SetMetadata(POTHOS_INIT_TOKEN, true),
  );
}
