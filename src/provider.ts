import { InjectionToken, Provider, Type } from '@angular/core';

import {
    DataProvider,
    Entity,
    EntityConverter,
    EntityConverterConfig
} from 'data-provider-core';
import {IdGenerator} from "@positional_advantage_coder/id-generator";

// This token is how the DataProvider implementation will get the map of converters.
export const ENTITY_CONVERTER_MAP_TOKEN = new InjectionToken<Map<string, EntityConverter<any, Entity<any>>>>('EntityConverterMap');

// This token is an internal detail used to gather all the converter configs.
const ENTITY_CONVERTER_CONFIGS_TOKEN = new InjectionToken<EntityConverterConfig[]>('EntityConverterConfigs');


/**
 * Creates the providers necessary to register entity converters.
 * To be used in an application's root providers array.
 * @param configs An array of EntityConverterConfig objects.
 */
export function provideEntityConverters(configs: EntityConverterConfig[]): Provider[] {
    return [
        {
            provide: ENTITY_CONVERTER_CONFIGS_TOKEN,
            useValue: configs,
        },
        {
            provide: ENTITY_CONVERTER_MAP_TOKEN,
            useFactory: (configs: EntityConverterConfig[]) => new Map<string, EntityConverter<any, Entity<any>>>(
                configs.map(config => [config.typeKey, config.converter])
            ),
            deps: [ENTITY_CONVERTER_CONFIGS_TOKEN],
        },
    ];
}

export function provideIdGenerator(implementation: Type<IdGenerator>): Provider {
    return {
        provide: IdGenerator,
        useClass: implementation
    }
}

/**
 * Creates a provider for the DataProvider abstract class.
 * The consumer of the library must provide their own concrete implementation class.
 * @param implementation - The class that implements the DataProvider contract (e.g., FirestoreDataProviderService).
 */
export function provideDataProvider(implementation: Type<DataProvider>): Provider {
    return {
        provide: DataProvider,
        useClass: implementation
    };
}