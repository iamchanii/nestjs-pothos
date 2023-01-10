import { applyDecorators, SetMetadata } from '@nestjs/common';
import { POTHOS_REF } from './constants';

export function PothosRef() {
  return applyDecorators(
    SetMetadata(POTHOS_REF, true),
  );
}
