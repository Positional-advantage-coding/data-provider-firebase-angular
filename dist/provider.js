"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_CONVERTER_MAP_TOKEN = void 0;
exports.provideEntityConverters = provideEntityConverters;
exports.provideIdGenerator = provideIdGenerator;
exports.provideDataProvider = provideDataProvider;
const core_1 = require("@angular/core");
const data_provider_core_1 = require("data-provider-core");
const id_generator_1 = require("@positional_advantage_coder/id-generator");
// This token is how the DataProvider implementation will get the map of converters.
exports.ENTITY_CONVERTER_MAP_TOKEN = new core_1.InjectionToken('EntityConverterMap');
// This token is an internal detail used to gather all the converter configs.
const ENTITY_CONVERTER_CONFIGS_TOKEN = new core_1.InjectionToken('EntityConverterConfigs');
/**
 * Creates the providers necessary to register entity converters.
 * To be used in an application's root providers array.
 * @param configs An array of EntityConverterConfig objects.
 */
function provideEntityConverters(configs) {
    return [
        {
            provide: ENTITY_CONVERTER_CONFIGS_TOKEN,
            useValue: configs,
        },
        {
            provide: exports.ENTITY_CONVERTER_MAP_TOKEN,
            useFactory: (configs) => new Map(configs.map(config => [config.typeKey, config.converter])),
            deps: [ENTITY_CONVERTER_CONFIGS_TOKEN],
        },
    ];
}
function provideIdGenerator(implementation) {
    return {
        provide: id_generator_1.IdGenerator,
        useClass: implementation
    };
}
/**
 * Creates a provider for the DataProvider abstract class.
 * The consumer of the library must provide their own concrete implementation class.
 * @param implementation - The class that implements the DataProvider contract (e.g., FirestoreDataProviderService).
 */
function provideDataProvider(implementation) {
    return {
        provide: data_provider_core_1.DataProvider,
        useClass: implementation
    };
}
