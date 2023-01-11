import { Injectable } from '@nestjs/common';
import { PothosDecoratorMetadata } from './interfaces';

@Injectable()
export class PothosCache {
  readonly cacheMap = new Map<string, any>();

  has(metadata: PothosDecoratorMetadata) {
    const key = this.getKey(metadata);
    return this.cacheMap.has(key);
  }

  set(metadata: PothosDecoratorMetadata, result: any) {
    const key = this.getKey(metadata);
    this.cacheMap.set(key, result);
  }

  get(metadata: PothosDecoratorMetadata) {
    const key = this.getKey(metadata);
    return this.cacheMap.get(key);
  }

  private getKey(metadata: PothosDecoratorMetadata) {
    return `${metadata.target}.${String(metadata.methodName)}`;
  }
}
