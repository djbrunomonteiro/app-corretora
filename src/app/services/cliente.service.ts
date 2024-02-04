import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc, query, where, limit } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResponse } from '../models/response';
import * as bcryptjs from 'bcryptjs'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  collectionRef: CollectionReference | undefined;

  constructor(
    private firestore: Firestore
  ) {
    this.collectionRef = collection(this.firestore, 'clientes');
  }


  getAll() {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      this.queryDocs().then(res => {
        response = { status: 200, error: false, results: res, message: 'Itens obtidos com sucesso!' };
        sub.next(response)
      }).catch(err => {
        console.error(err);

        response = { status: 401, error: true, results: undefined, message: 'Error ao obter itens. Tente novamente!' }
        sub.next(response)
      })


    })

  }

  getOne(id: string) {
    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      const ref = doc(this.firestore, 'clientes', id);
      console.log('id', ref.path);

      getDoc(ref).then(res => {
        console.log('res get one', res.exists());

        response = { status: 200, error: false, results: res.data(), message: 'Itens obtidos com sucesso!' };
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
      if (!this.collectionRef) { return resolve([]) }
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
        const senha = `${item.cpf_cnpj}${item.data_nasc}`;
        this.createToken(senha).then(hash =>{
          const newItem = { ...item, id: ref.id, created_at: new Date().toISOString(), hash };
          setDoc(ref, newItem)
            .then(res => {
              response = { status: 201, error: false, results: newItem, message: 'Item adicionado com sucesso!' };
              sub.next(response)
  
            }).catch(err => {
              console.error(err);
              response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar adicionar o item. Tente novamente!' }
              sub.next(response)
            })

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
        const ref = doc(this.firestore, 'clientes', item.id);
        const senha = `${item.cpf_cnpj}${item.data_nasc}`;
        this.createToken(senha).then(hash =>{
          const newItem = { ...item, id: ref.id, hash };
          updateDoc(ref, newItem)
            .then(res => {
              response = { status: 201, error: false, results: newItem, message: 'Item atualizado com sucesso!' };
              sub.next(response)
  
            }).catch(err => {
              console.error(err);
              response = { status: 401, error: true, results: undefined, message: 'Ocorreu um error ao tentar atualizar o item. Tente novamente!' }
              sub.next(response)
            })

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
        const ref = doc(this.firestore, 'clientes', id);
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

  createToken(senha: string) {
    return new Promise<string>(resolve => {
      bcryptjs.genSalt(8, (err, salt) => {
        bcryptjs.hash(senha, salt, async (err, hash) => {
          resolve(hash);
        })
      })
    })

  }


}

