import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, doc, setDoc, getDocs } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
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
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      this.queryDocs().then(res =>{
        response = { status: 200, error: false, results: res, message: 'Itens obtidos com sucesso!' };
        sub.next(response)
      }).catch(err => {
        console.error(err);
        
        response = { status: 401, error: true, results: undefined, message: 'Error ao obter itens. Tente novamente!' }
        sub.next(response)
      })


    })

  }

  queryDocs() {
    return new Promise<any[]>(resolve => {
      if(!this.collectionRef){return resolve([])}
      const itens: any[] = [];
      getDocs(this.collectionRef).then(res => {
        res.forEach(async (doc) => {
          await itens.push(doc.data())
        });

        console.log(itens);
        

        resolve(itens)
      });
    })

  }

  addOne(item: any) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      if (this.collectionRef) {
        const ref = doc(this.collectionRef);
        const newItem = { ...item, id: ref.id, created_at: new Date().toISOString() };
        setDoc(ref, newItem)
          .then(res => {
            response = { status: 201, error: false, results: newItem, message: 'Item adicionado com sucesso!' };
            sub.next(response)

          }).catch(err => {
            console.error(err);
            response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar adicionar o item. Tente novamente!' }
            sub.next(response)
          })

      } else {
        console.error('collectionREf is undefined');
        response = { status: 401, error: true, results: undefined, message: 'Error ao adicionar item. Tente novamente!' };
        sub.next(response)
      }

    })


  }
}
