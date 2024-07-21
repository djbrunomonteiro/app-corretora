import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Firestore, collection, CollectionReference, doc, setDoc, getDocs, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { IResponse } from '../models/response';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  collectionRef: CollectionReference | undefined;

  constructor(
    private firestore: Firestore,
    @Inject(PLATFORM_ID) public platformId: Object,
  ) {
    this.collectionRef = collection(this.firestore, 'anuncios');
  }


  getAll() {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      
      if(isPlatformBrowser(this.platformId)){
        let stateAnuncios = localStorage.getItem("state-anuncios");
        if(stateAnuncios){
          stateAnuncios = JSON.parse(stateAnuncios)
          response = { status: 200, error: false, results: stateAnuncios, message: 'Itens obtidos com sucesso!' };
          sub.next(response)
        }else{
          this.queryDocs().then(res =>{
            localStorage.setItem("state-anuncios", JSON.stringify(res))
            response = { status: 200, error: false, results: res, message: 'Itens obtidos com sucesso!' };
            sub.next(response)
          }).catch(err => {
            console.error(err);
            response = { status: 401, error: true, results: undefined, message: 'Error ao obter itens. Tente novamente!' }
            sub.next(response)
          })
        }

        
      }else{
        this.queryDocs().then(res =>{
          response = { status: 200, error: false, results: res, message: 'Itens obtidos com sucesso!' };
          sub.next(response)
        }).catch(err => {
          console.error(err);
          response = { status: 401, error: true, results: undefined, message: 'Error ao obter itens. Tente novamente!' }
          sub.next(response)
        })
      }


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

  updateOne(item: any) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      if (this.collectionRef) {
        const ref = doc(this.firestore, 'anuncios', item.id);
        const newItem = { ...item, id: ref.id, created_at: new Date().toISOString() };
        updateDoc(ref, newItem)
          .then(res => {
            response = { status: 201, error: false, results: newItem, message: 'Item atualizado com sucesso!' };
            sub.next(response)

          }).catch(err => {
            console.error(err);
            response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar atualizar o item. Tente novamente!' }
            sub.next(response)
          })

      } else {
        console.error('collectionREf is undefined');
        response = { status: 401, error: true, results: undefined, message: 'Error ao adicionar item. Tente novamente!' };
        sub.next(response)
      }

    })


  }

  deleteOne(id: any) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      if (this.collectionRef) {
        const ref = doc(this.firestore, 'anuncios', id);
        deleteDoc(ref)
          .then(res => {
            response = { status: 201, error: false, results: undefined, message: 'Item deletado com sucesso!' };
            sub.next(response)

          }).catch(err => {
            console.error(err);
            response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar deletar o item. Tente novamente!' }
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
