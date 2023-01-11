import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PothosDecoratorMetadata } from './interfaces';
import { PothosCache } from './pothos.cache';
import { PothosDecoratorExplorer } from './pothos.explorer';

@Injectable()
export class PothosSchema implements OnModuleInit {
  @Inject(PothosDecoratorExplorer)
  private explorer: PothosDecoratorExplorer = null as never;

  @Inject(PothosCache)
  private pothosCache: PothosCache = null as never;

  private processPothosDecoratedMethods(metadatas: PothosDecoratorMetadata[]) {
    for (const metadata of metadatas) {
      const { methodName } = metadata;

      if (this.pothosCache.has(metadata) === false) {
        const result = this[methodName]();
        this.pothosCache.set(metadata, result);
      }

      const cachedResult = this.pothosCache.get(metadata);
      this[methodName] = () => cachedResult;
      Object.defineProperty(this[methodName], 'name', { value: `proceed__${String(methodName)}` });
    }
  }

  onModuleInit() {
    const [pothosRefMetadatas, pothosMetadatas] = this.explorer.getMetadataOfDecoratedMethods(this)
      .reduce(
        ([pothosRefMetadatas, pothosMetadatas], metadata) => {
          return metadata.isPothosRefDecorator
            ? [pothosRefMetadatas.concat(metadata), pothosMetadatas]
            : [pothosRefMetadatas, pothosMetadatas.concat(metadata)];
        },
        [[], []] as [PothosDecoratorMetadata[], PothosDecoratorMetadata[]],
      );

    this.processPothosDecoratedMethods(pothosRefMetadatas);
    this.processPothosDecoratedMethods(pothosMetadatas);
  }
}
