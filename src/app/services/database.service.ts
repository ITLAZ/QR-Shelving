import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  getFirestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Shelf } from '../models/shelf.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(
    public http: HttpClient,
    public firestore: AngularFirestore,
    private injector: Injector
  ) {}

  fetchLocalCollection(collection: string) {
    return this.http.get('assets/db/' + collection + '.json');
  }

  fetchFirestoreCollection(collection: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collection)
        .valueChanges({ idField: 'id' });
    });
  }

  addFirestoreDocument(collectionName: string, collectionData: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collectionName).add(collectionData);
    });
  }

  addFirestoreDocumentID(
    collectionName: string,
    docId: string,
    collectionData: any
  ) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collectionName)
        .doc(docId)
        .set(collectionData);
    });
  }

  updateFireStoreDocument(collection: string, uid: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(uid).update(data);
    });
  }

  deleteFireStoreDocument(collection: string, id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(id).delete();
    });
  }

  getDocumentById(collection: string, uid: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collection)
        .doc(uid)
        .valueChanges({ idField: 'id' });
    });
  }

  getShelfByCode(code: string): Promise<Shelf | null> {
    return runInInjectionContext(this.injector, async () => {
      const firestoreInstance = getFirestore();
      const docRef = doc(firestoreInstance, 'shelves', code);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const shelfData = docSnap.data() as Shelf;
        return { ...shelfData, code: docSnap.id }; // Agregamos `code` con el ID si no existe
      } else {
        return null;
      }
    });
  }

  async updateShelf(code: string, data: Partial<Shelf>) {
    return runInInjectionContext(this.injector, async () => {
      const firestoreInstance = getFirestore();
      const docRef = doc(firestoreInstance, 'shelves', code);
      await updateDoc(docRef, data);
    });
  }

  async checkDocumentExists(
    collectionName: string,
    docId: string
  ): Promise<boolean> {
    return runInInjectionContext(this.injector, async () => {
      const firestoreInstance = getFirestore();
      const docRef = doc(firestoreInstance, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    });
  }

  getCollectionByCustomparam(
    collection: string,
    customParam: string,
    searched: string
  ): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collection, (ref) => ref.where(customParam, '==', searched))
        .valueChanges({ idField: 'id' });
    });
  }

  searchCollectionByFieldPrefix(
    collection: string,
    field: string,
    searchText: string
  ): Observable<any[]> {
    const endText = searchText.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1)
    );
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collection, (ref) =>
          ref.where(field, '>=', searchText).where(field, '<', endText)
        )
        .valueChanges({ idField: 'id' });
    });
  }

  async findShelfContainingProduct(sku: string): Promise<Shelf | null> {
    return runInInjectionContext(this.injector, async () => {
      const firestoreInstance = getFirestore();
      const shelvesRef = collection(firestoreInstance, 'shelves');
      const snapshot = await getDocs(shelvesRef);

      for (const docSnap of snapshot.docs) {
        const shelf = docSnap.data() as Shelf;
        const containsProduct = shelf.content?.some(
          (p: Product) => p.sku === sku
        );
        if (containsProduct) {
          return { ...shelf, code: docSnap.id }; // Agregamos `code` con el ID si no existe
        }
      }

      return null;
    });
  }

  updateFirestoreDocument(
    collectionName: string,
    docId: string,
    data: any
  ): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collectionName)
        .doc(docId)
        .set(data, { merge: true });
    });
  }
  async getFirestoreDocumentID(
    collection: string,
    docId: string
  ): Promise<any | null> {
    return runInInjectionContext(this.injector, async () => {
      const firestoreInstance = getFirestore();
      const docRef = doc(firestoreInstance, collection, docId);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    });
  }

  getCollectionByFilters(
    collection: string,
    filters: {
      field: string;
      operator: firebase.default.firestore.WhereFilterOp;
      value: any;
    }[],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limitResults?: number
  ): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection(collection, (ref) => {
          let query: firebase.default.firestore.Query = ref;
          filters.forEach((filter) => {
            query = query.where(filter.field, filter.operator, filter.value);
          });
          if (orderByField) {
            query = query.orderBy(orderByField, orderDirection);
          }
          if (limitResults) {
            query = query.limit(limitResults);
          }
          return query;
        })
        .valueChanges({ idField: 'id' });
    });
  }
}
