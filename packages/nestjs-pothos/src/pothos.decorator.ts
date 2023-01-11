import { applyDecorators, SetMetadata } from '@nestjs/common';
import { InternalPothosDecoratorToken, InternalPothosRefDecoratorToken } from './constants';
import { PothosDecoratorMetadata } from './interfaces';

export const Pothos = (): MethodDecorator => (target, propertyKey, descriptor) => {
  return SetMetadata<typeof InternalPothosDecoratorToken, Partial<PothosDecoratorMetadata>>(
    InternalPothosDecoratorToken,
    {
      target: target.constructor.name,
      methodName: propertyKey,
      callback: descriptor.value as any,
    },
  )(target, propertyKey, descriptor);
};

export const PothosRef = () =>
  applyDecorators(
    Pothos(),
    SetMetadata(InternalPothosRefDecoratorToken, true),
  );
