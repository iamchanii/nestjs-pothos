import { FactoryProvider, ModuleMetadata, Provider, ValueProvider } from '@nestjs/common';
import { AbstractSchema } from './schema';
export interface PothosModuleOptions {
    /**
     * A provider of BuilderSchema that will inject into PothosSchemaService
     */
    builder: Omit<FactoryProvider<PothosSchemaTypes.SchemaBuilder<any>>, 'provide'> | Omit<ValueProvider<PothosSchemaTypes.SchemaBuilder<any>>, 'provide'>;
    /**
     * A list of schemas it implements AbstractSchema abstract class and init method.
     */
    schemas: Provider<AbstractSchema>[];
    /**
     * A list of modules that makes schemas let use services.
     */
    imports?: ModuleMetadata['imports'];
    /**
     * @default true
     */
    isGlobal?: boolean;
}
//# sourceMappingURL=interfaces.d.ts.map