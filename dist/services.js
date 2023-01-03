"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PothosSchemaService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let PothosSchemaService = class PothosSchemaService {
    constructor(builder, schemaList) {
        this.builder = builder;
        this.schemaList = schemaList;
        this.init();
    }
    init() {
        this.schemaList.forEach(schema => {
            schema.init(this.builder);
        });
    }
    toSchema(options) {
        return this.builder.toSchema(options);
    }
};
PothosSchemaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.BUILDER)),
    __param(1, (0, common_1.Inject)(constants_1.SCHEMA_LIST)),
    __metadata("design:paramtypes", [Object, Array])
], PothosSchemaService);
exports.PothosSchemaService = PothosSchemaService;
//# sourceMappingURL=services.js.map