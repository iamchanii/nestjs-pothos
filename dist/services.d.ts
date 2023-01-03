import { AbstractSchema } from './schema';
export declare class PothosSchemaService {
    private readonly builder;
    private readonly schemaList;
    constructor(builder: PothosSchemaTypes.SchemaBuilder<any>, schemaList: AbstractSchema[]);
    private init;
    toSchema(options?: PothosSchemaTypes.BuildSchemaOptions<any>): import("graphql").GraphQLSchema;
}
//# sourceMappingURL=services.d.ts.map