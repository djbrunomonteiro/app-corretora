import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where, Query, orderBy } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { IResponse } from '../models/response';



@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  collectionRef: CollectionReference | undefined;

  constructor(
    private firestore: Firestore
  ) {
    this.collectionRef = collection(this.firestore, 'agendamentos');
  }


  getAll(id_cliente?: any) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      this.queryDocs(id_cliente).then(res =>{
        response = { status: 200, error: false, results: res, message: 'Itens obtidos com sucesso!' };
        sub.next(response)
      }).catch(err => {
        console.error(err);
        
        response = { status: 401, error: true, results: undefined, message: 'Error ao obter itens. Tente novamente!' }
        sub.next(response)
      })


    })

  }

  queryDocs(id_cliente?: string) {
    return new Promise<any[]>(resolve => {
      if(!this.collectionRef){return resolve([])}
      const itens: any[] = [];
      let q: Query;
      if(id_cliente){
        q = query(this.collectionRef, where('id_cliente', "==", id_cliente))
      }else{
        q = query(this.collectionRef)
      }

      getDocs(q).then(res => {
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
            response = { status: 201, error: false, results: newItem, message: 'Agendamento realizado com sucesso! Entraremos em contato através dos dados cadastrados para confirmar a data e o horário.' };
            sub.next(response)

          }).catch(err => {
            console.error(err);
            response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar realizar agendamento. Tente novamente!' }
            sub.next(response)
          })

      } else {
        console.error('collectionREf is undefined');
        response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar realizar agendamento. Tente novamente!' };
        sub.next(response)
      }

    })


  }

  updateOne(item: any) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      if (this.collectionRef) {
        const ref = doc(this.firestore, 'agendamentos', item.id);
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
        const ref = doc(this.firestore, 'agendamentos', id);
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

