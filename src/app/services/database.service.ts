import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DocumentData } from 'firebase/firestore'; // Asegúrate de importar DocumentData
import { Shelf } from '../models/shelf.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    public http: HttpClient,
    public firestore: AngularFirestore,
    private injector: Injector
  ) { }

  // Lee un archivo json en la carpeta /assets/db/ NOMBRE
  fetchLocalCollection(collection: string) {
    return this.http.get('assets/db/' + collection + '.json');
  }

  // Lee todos los registros de una colección en Fire Store
  fetchFirestoreCollection(collection: any): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).valueChanges({ idField: 'id' });
    });
  }

  // Guardar un documento en firestore, si no existe la colección la crea
  addFirestoreDocument(collectionName: string, collectionData: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collectionName).add(collectionData);
    });
  }

  // Actualiza la información de un documento o registro
  updateFireStoreDocument(collection: string, uid: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(uid).update(data);
    });
  }

  // Elimina un documento o registro
  deleteFireStoreDocument(collection: string, id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(id).delete();
    });
  }

  // Recupera un documento o registro por su UID
  getDocumentById(collection: string, uid: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(uid).valueChanges({ idField: 'id' });
    });
  }

  // Busca todos los registros o documentos de una colección que coincidan con los parámetros buscados
  getCollectionByCustomparam(collection: string, customParam: string, searched: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection, ref => ref.where(customParam, '==', searched))
        .valueChanges({ idField: 'id' });
    });
  }

  // Búsqueda por texto que empieza con un string
  searchCollectionByFieldPrefix(
    collection: string,
    field: string,
    searchText: string
  ): Observable<any[]> {
    const endText = searchText.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection, ref =>
        ref.where(field, '>=', searchText).where(field, '<', endText)
      ).valueChanges({ idField: 'id' });
    });
  }

  async getShelfByCode(code: string): Promise<Shelf> {
    const doc = await this.firestore.collection('shelves').doc(code).ref.get();
    return doc.data() as Shelf;
  }
  
  async findShelfContainingProduct(sku: string): Promise<Shelf | null> {
    const snapshot = await this.firestore.collection<Shelf>('shelves', ref =>
      ref.where('content', 'array-contains', sku)
    ).get().toPromise();
  
    return snapshot?.docs[0]?.data() || null;
  }
  
  async updateShelf(code: string, data: Partial<Shelf>) {
    return this.firestore.collection('shelves').doc(code).update(data);
  }  

  // Consulta dinámica con múltiples filtros
  getCollectionByFilters(
    collection: string,
    filters: { field: string, operator: firebase.default.firestore.WhereFilterOp, value: any }[],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limitResults?: number
  ): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection, ref => {
        let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
        // Aplicar filtros dinámicamente
        filters.forEach(filter => {
          query = query.where(filter.field, filter.operator, filter.value);
        });
        // Aplicar ordenamiento si existe
        if (orderByField) {
          query = query.orderBy(orderByField, orderDirection);
        }
        // Limitar resultados si se pidió
        if (limitResults) {
          query = query.limit(limitResults);
        }
        return query;
      }).valueChanges({ idField: 'id' });
    });
  }

}
