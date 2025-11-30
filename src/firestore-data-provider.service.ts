import { Inject, Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    docData,
    setDoc
} from '@angular/fire/firestore';
import {catchError, defer, from, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { DataProvider, Entity, EntityConverter } from 'data-provider-core';
import { ENTITY_CONVERTER_MAP_TOKEN } from './provider';
import { CollectionReference, DocumentData, Query, query } from "@angular/fire/firestore";
import { IdGenerator } from "@positional_advantage_coder/id-generator"

@Injectable({
    providedIn: 'root'
})
export class FirestoreDataProviderService implements DataProvider {
    constructor(
        private firestore: Firestore,
        public idGenerator: IdGenerator,
        @Inject(ENTITY_CONVERTER_MAP_TOKEN) public converterMap: Map<string, EntityConverter<any, any>>
    ) { }

    public getEntity<T extends Entity<string>>(path: string): Observable<T | undefined> {
        const docRef = doc(this.firestore, path);
        return docData(docRef, { idField: 'id' }).pipe(
            map((plainObject: any) => this.convertIntoEntity(plainObject))
        );
    }

    public createEntity<T extends Entity<string>>(collectionPath: string, entityData: Omit<T, 'id'>): Observable<T | undefined> {
        const completeEntity: T = { ...entityData, id: this.idGenerator.generateId() } as T;

        return defer(() => from(
            setDoc(doc(this.firestore, `${collectionPath}/${completeEntity.id}`), completeEntity)
        ).pipe(map(() => completeEntity),  catchError(() => of(undefined))))
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