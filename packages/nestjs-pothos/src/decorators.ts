import { applyDecorators, SetMetadata } from '@nestjs/common';
import { POTHOS_REF_TOKEN } from './constants';

export function PothosRef() {
  return applyDecorators(
    SetMetadata(POTHOS_REF_TOKEN, true),
  );
}
