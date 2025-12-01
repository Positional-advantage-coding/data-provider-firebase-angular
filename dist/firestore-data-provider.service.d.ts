import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataProvider, Entity, EntityConverter } from 'data-provider-core';
import { IdGenerator } from "@positional_advantage_coder/id-generator";
import * as i0 from "@angular/core";
export declare class FirestoreDataProviderService implements DataProvider {
    private firestore;
    idGenerator: IdGenerator;
    converterMap: Map<string, EntityConverter<any, any>>;
    constructor(firestore: Firestore, idGenerator: IdGenerator, converterMap: Map<string, EntityConverter<any, any>>);
    getEntity<T extends Entity<string>>(path: string): Observable<T | undefined>;
    createEntity<T extends Entity<string>>(collectionPath: string, entityData: Omit<T, 'id'>): Observable<T | undefined>;
    listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]>;
    convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<FirestoreDataProviderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FirestoreDataProviderService>;
}
