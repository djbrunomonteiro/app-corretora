import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Firestore, collection, CollectionReference, doc, setDoc, getDocs, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable} from 'rxjs';
import { IResponse } from '../models/response';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class LeadService {

  collectionRef: CollectionReference | undefined;

  collectedContact$ = new BehaviorSubject<boolean>(false);

  constructor(
    private firestore: Firestore,
    @Inject(PLATFORM_ID) public platformId: Object,

  ) {
    this.collectionRef = collection(this.firestore, 'leads');
  }

  checkCollectedContact(){
    if(isPlatformBrowser(this.platformId)){
    const collected = localStorage.getItem('telmamonteiro_collectedContact');
    if(!collected){return}
    this.collectedContact$.next(true)
    }
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
            response = { status: 201, error: false, results: newItem, message: 'Solicitação de contato enviado com sucesso! Aguarde que responderemos em breve.' };
            sub.next(response)

          }).catch(err => {
            console.error(err);
            response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao enviar. Tente novamente!' }
            sub.next(response)
          })

      } else {
        console.error('collectionREf is undefined');
        response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao enviar. Tente novamente!' };
        sub.next(response)
      }

    })


  }

  updateOne(item: any) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      if (this.collectionRef) {
        const ref = doc(this.firestore, 'leads', item.id);
        const newItem = { ...item, id: ref.id};
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
        const ref = doc(this.firestore, 'leads', id);
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
