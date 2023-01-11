import { Injectable } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { InternalPothosDecoratorToken, InternalPothosRefDecoratorToken } from './constants';
import { PothosDecoratorMetadata } from './interfaces';

@Injectable()
export class PothosDecoratorExplorer {
  constructor(private readonly metadataScanner: MetadataScanner) {}

  getMetadataOfDecoratedMethods(target: any) {
    const instancePrototype = Object.getPrototypeOf(target);

    return this.metadataScanner.scanFromPrototype(
      target,
      instancePrototype,
      method => this.exploreMethodMetadata(target, method),
    ).filter(
      function(metadataOrNull): metadataOrNull is PothosDecoratorMetadata {
        return !!metadataOrNull;
      },
    );
  }

  protected exploreMethodMetadata(instance: any, methodKey: string): PothosDecoratorMetadata | null {
    const targetCallback = instance[methodKey];
    const metadata: PothosDecoratorMetadata | null = Reflect.getMetadata(InternalPothosDecoratorToken, targetCallback);

    if (!metadata) {
      return null;
    }

    return {
      ...metadata,
      isPothosRefDecorator: !!Reflect.getMetadata(InternalPothosRefDecoratorToken, targetCallback),
    };
  }
}
