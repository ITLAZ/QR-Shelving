import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  // ✅ Recuperar un estante por su código (buscando el documento que tenga el campo code igual)
  async getShelfByCode(code: string): Promise<Shelf> {
    const snapshot = await this.firestore
      .collection<Shelf>('shelves', (ref) => ref.where('code', '==', code))
      .get()
      .toPromise();

    const doc = snapshot?.docs[0];
    return doc?.data() as Shelf;
  }

  // ⚠️ Buscar un estante que contenga un producto con cierto SKU
  async findShelfContainingProduct(sku: string): Promise<Shelf | null> {
    const snapshot = await this.firestore
      .collection<Shelf>('shelves')
      .get()
      .toPromise();

    for (const doc of snapshot?.docs || []) {
      const shelf = doc.data();
      const containsProduct = shelf.content?.some(
        (p: Product) => p.sku === sku
      );
      if (containsProduct) {
        return shelf;
      }
    }

    return null;
  }

  // ✅ Actualizar un estante usando su código (no el ID del documento)
  async updateShelf(code: string, data: Partial<Shelf>) {
    const snapshot = await this.firestore
      .collection<Shelf>('shelves', (ref) => ref.where('code', '==', code))
      .get()
      .toPromise();

    const docId = snapshot?.docs[0]?.id;
    if (!docId) throw new Error(`No se encontró estante con código ${code}`);

    return this.firestore.collection('shelves').doc(docId).update(data);
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
  getFirestoreDocumentByField(
    collectionName: string,
    field: string,
    value: any
  ): Promise<any[]> {
    return runInInjectionContext(this.injector, async () => {
      const snapshot = await this.firestore
        .collection(collectionName, (ref) => ref.where(field, '==', value))
        .get()
        .toPromise();
      return snapshot?.docs.map((doc) => doc.data()) || [];
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
