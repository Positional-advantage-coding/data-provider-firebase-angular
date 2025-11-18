import { Inject, Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataProvider, Entity, EntityConverter } from 'data-provider-core';
import { ENTITY_CONVERTER_MAP_TOKEN } from './provider';
import { CollectionReference, DocumentData, Query, query } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class FirestoreDataProviderService implements DataProvider {
    constructor(
        private firestore: Firestore,
        @Inject(ENTITY_CONVERTER_MAP_TOKEN) public converterMap: Map<string, EntityConverter<any, any>>
    ) { }

    public getEntity<T extends Entity<string>>(path: string): Observable<T | undefined> {
        const docRef = doc(this.firestore, path);
        return docData(docRef, { idField: 'id' }).pipe(
            map((plainObject: any) => this.convertIntoEntity(plainObject))
        );
    }

    public listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]> {
        const collectionRef: CollectionReference = collection(this.firestore, path);
        const q: Query = query(collectionRef);

        return collectionData(q, { idField: 'id' }).pipe(
            map((plainObjects: DocumentData[]) => {
                return plainObjects
                    .map(obj => this.convertIntoEntity<T>(obj))
                    .filter(Boolean) as T[];
            })
        );
    }

    public convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined {
        if (!rawObject || !rawObject.typeKey) {
            return undefined;
        }

        const converter = this.converterMap.get(rawObject.typeKey);

        if (converter) {
            return converter.fromPlainObject(rawObject) as T;
        }

        console.warn(`No converter registered for typeKey: "${rawObject.typeKey}"`);
        return undefined;
    }
}