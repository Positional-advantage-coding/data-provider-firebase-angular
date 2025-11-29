import { InjectionToken, Provider, Type } from '@angular/core';
import { DataProvider, Entity, EntityConverter, EntityConverterConfig } from 'data-provider-core';
import { IdGenerator } from "@positional_advantage_coder/id-generator";
export declare const ENTITY_CONVERTER_MAP_TOKEN: InjectionToken<Map<string, EntityConverter<any, Entity<any>>>>;
/**
 * Creates the providers necessary to register entity converters.
 * To be used in an application's root providers array.
 * @param configs An array of EntityConverterConfig objects.
 */
export declare function provideEntityConverters(configs: EntityConverterConfig[]): Provider[];
export declare function provideIdGenerator(implementation: Type<IdGenerator>): Provider;
/**
 * Creates a provider for the DataProvider abstract class.
 * The consumer of the library must provide their own concrete implementation class.
 * @param implementation - The class that implements the DataProvider contract (e.g., FirestoreDataProviderService).
 */
export declare function provideDataProvider(implementation: Type<DataProvider>): Provider;
