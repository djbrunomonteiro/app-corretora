import { Firestore, collection, CollectionReference, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc, query, where, limit, arrayUnion } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResponse } from '../models/response';
import * as bcryptjs from 'bcryptjs'
import { StoreService } from './store.service';
import { ClienteIsAuth } from '../store/selectors/cliente.selector';
import { EAction, EGroup } from '../store/app.actions';

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  collectionRef: CollectionReference | undefined;
  clienteAuth: any;
  constructor(
    private firestore: Firestore,
    private storeService: StoreService,

    @Inject(PLATFORM_ID) public platformId: Object

  ) {
    this.collectionRef = collection(this.firestore, 'clientes');
    this.storeService.select(ClienteIsAuth).subscribe(res => {
      this.clienteAuth = res;
    } );
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
      getDoc(ref).then(res => {
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

              if(isPlatformBrowser(this.platformId)){
                localStorage.setItem('access_token', hash )
              }

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

  addFavorito(id: string){

    return new Observable<IResponse>(sub => {
      let response: IResponse = {};
      if (this.collectionRef) {
        const ref = doc(this.firestore, 'clientes', this.clienteAuth.id);

        updateDoc(ref, {favoritos: arrayUnion(id)})
        .then(res => {
          let favoritos = this.clienteAuth.favoritos as string[] ?? [];
          favoritos.push(id);
          const item = {...this.clienteAuth, favoritos}
          this.storeService.dispatchAction({group: EGroup.Cliente, action: EAction.UpdateOneStore, params:{id: this.clienteAuth.id}, props: {item}})
          
          response = { status: 201, error: false, results: res, message: 'Item favoritado com sucesso!' };
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


}

