"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PothosModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PothosModule = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const services_1 = require("./services");
let PothosModule = PothosModule_1 = class PothosModule {
    static register(options) {
        var _a;
        const builderProvider = Object.assign({ provide: constants_1.BUILDER }, options.builder);
        return {
            global: (_a = options.isGlobal) !== null && _a !== void 0 ? _a : true,
            module: PothosModule_1,
            imports: [...options.imports],
            providers: [
                ...options.schemas,
                services_1.PothosSchemaService,
                builderProvider,
                {
                    provide: constants_1.SCHEMA_LIST,
                    inject: options.schemas,
                    useFactory: (...schemas) => schemas,
                },
            ],
            exports: [services_1.PothosSchemaService],
        };
    }
};
PothosModule = PothosModule_1 = __decorate([
    (0, common_1.Module)({})
], PothosModule);
exports.PothosModule = PothosModule;
//# sourceMappingURL=modules.js.map