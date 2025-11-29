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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const provider_1 = require("./provider");
const firestore_2 = require("@angular/fire/firestore");
const id_generator_1 = require("@positional_advantage_coder/id-generator");
const i0 = __importStar(require("@angular/core"));
const i1 = __importStar(require("@angular/fire/firestore"));
const i2 = __importStar(require("@positional_advantage_coder/id-generator"));
class FirestoreDataProviderService {
    constructor(firestore, idGenerator, converterMap) {
        this.firestore = firestore;
        this.idGenerator = idGenerator;
        this.converterMap = converterMap;
    }
    getEntity(path) {
        const docRef = (0, firestore_1.doc)(this.firestore, path);
        return (0, firestore_1.docData)(docRef, { idField: 'id' }).pipe((0, operators_1.map)((plainObject) => this.convertIntoEntity(plainObject)));
    }
    createEntity(path, entityData) {
        const completeEntity = { ...entityData, id: this.idGenerator.generateId() };
        return (0, rxjs_1.defer)(() => (0, rxjs_1.from)((0, firestore_1.setDoc)((0, firestore_1.doc)(this.firestore, `path/${completeEntity.id}`), completeEntity)).pipe((0, operators_1.map)(() => completeEntity), (0, rxjs_1.catchError)(() => (0, rxjs_1.of)(undefined))));
    }
    listenToCollectionChanges(path) {
        const collectionRef = (0, firestore_1.collection)(this.firestore, path);
        const q = (0, firestore_2.query)(collectionRef);
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
FirestoreDataProviderService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.14", ngImport: i0, type: FirestoreDataProviderService, deps: [{ token: i1.Firestore }, { token: i2.IdGenerator }, { token: provider_1.ENTITY_CONVERTER_MAP_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable });
FirestoreDataProviderService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.14", ngImport: i0, type: FirestoreDataProviderService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.14", ngImport: i0, type: FirestoreDataProviderService, decorators: [{
            type: core_1.Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Firestore }, { type: i2.IdGenerator }, { type: Map, decorators: [{
                    type: core_1.Inject,
                    args: [provider_1.ENTITY_CONVERTER_MAP_TOKEN]
                }] }] });
