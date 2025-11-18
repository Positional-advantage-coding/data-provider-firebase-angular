"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreDataProviderService = void 0;
const core_1 = require("@angular/core");
const firestore_1 = require("@angular/fire/firestore");
const operators_1 = require("rxjs/operators");
const provider_1 = require("./provider");
const firestore_2 = require("@angular/fire/firestore");
const i0 = __importStar(require("@angular/core"));
const i1 = __importStar(require("@angular/fire/firestore"));
class FirestoreDataProviderService {
    constructor(firestore, converterMap) {
        this.firestore = firestore;
        this.converterMap = converterMap;
    }
    getEntity(path) {
        const docRef = (0, firestore_1.doc)(this.firestore, path);
        return (0, firestore_1.docData)(docRef, { idField: 'id' }).pipe((0, operators_1.map)((plainObject) => this.convertIntoEntity(plainObject)));
    }
    listenToCollectionChanges(path) {
        // 1. Create a reference to the collection. Explicit typing is good practice.
        const collectionRef = (0, firestore_1.collection)(this.firestore, path);
        // 2. IMPORTANT: Always create a Query object, even with no constraints.
        const q = (0, firestore_2.query)(collectionRef);
        // 3. Call collectionData with the DocumentData type.
        //    We also include the idField to get the document ID merged.
        return (0, firestore_1.collectionData)(q, { idField: 'id' }).pipe((0, operators_1.map)((plainObjects) => {
            return plainObjects
                .map(obj => this.convertIntoEntity(obj))
                .filter(Boolean);
        }));
    }
    convertIntoEntity(rawObject) {
        if (!rawObject || !rawObject.typeKey) {
            return undefined;
        }
        const converter = this.converterMap.get(rawObject.typeKey);
        if (converter) {
            return converter.fromPlainObject(rawObject);
        }
        console.warn(`No converter registered for typeKey: "${rawObject.typeKey}"`);
        return undefined;
    }
}
exports.FirestoreDataProviderService = FirestoreDataProviderService;
FirestoreDataProviderService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: i0, type: FirestoreDataProviderService, deps: [{ token: i1.Firestore }, { token: provider_1.ENTITY_CONVERTER_MAP_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable });
FirestoreDataProviderService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.11", ngImport: i0, type: FirestoreDataProviderService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: i0, type: FirestoreDataProviderService, decorators: [{
            type: core_1.Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Firestore }, { type: Map, decorators: [{
                    type: core_1.Inject,
                    args: [provider_1.ENTITY_CONVERTER_MAP_TOKEN]
                }] }] });
