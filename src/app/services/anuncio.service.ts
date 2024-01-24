import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { catchError, first, map, of } from 'rxjs';
import { IResponse } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  collectionRef: CollectionReference | undefined;

  constructor(
    private firestore: Firestore
  ) {
    this.collectionRef = collection(this.firestore, 'anuncios');
  }


  getAll() {
    let response: IResponse = {};
    if (this.collectionRef) {

      return collectionData(this.collectionRef).pipe(
        first(),
        map(res => {
          response = { status: 200, error: false, results: res, message: 'Itens obtidos com sucesso!' };
          return response
        }),
        catchError(err => {
          response = { status: 401, error: true, results: undefined, message: err }
          return of(response)
        })
      )
    } else {
      console.error('collectionREf is undefined');
      response = { status: 401, error: true, results: undefined, message: 'Error ao obter itens. Tente novamente!' }
    }

    return of(response)

  }

  addOne(item: any) {
    let response: IResponse = {};
    if (this.collectionRef) {
      const uidRef = doc(this.collectionRef);
      const newItem = { ...item, id: uidRef }

      setDoc(uidRef, newItem)
        .then(res => {
          response = { status: 201, error: false, results: res, message: 'Item adicionado com sucesso!' };

        }).catch(err => {
          console.error(err);
          response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar adicionar o item. Tente novamente!' }
        })

    } else {
      console.error('collectionREf is undefined');
      response = { status: 401, error: true, results: undefined, message: 'Error ao adicionar item. Tente novamente!' }
    }

    return of(response)

  }
}
