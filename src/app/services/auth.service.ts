import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { StoreService } from './store.service';
import { Router } from '@angular/router';
import { CollectionReference, Firestore,  collection, getDocs, limit, query, where } from '@angular/fire/firestore';
import { IResponse } from '../models/response';
import { isPlatformBrowser } from '@angular/common';
import { UserStore } from '../store/user-store';
import { patchState } from '@ngrx/signals';
import { addEntity, removeAllEntities, setEntity } from '@ngrx/signals/entities';
import { ClientesStore } from '../store/cliente-store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userStore = inject(UserStore);
  clienteStore = inject(ClientesStore);
  googleAuthProvider = new GoogleAuthProvider();

  collectionRef: CollectionReference | undefined;

  constructor(
    private auth: Auth,
    private storeService: StoreService,
    private router: Router,
    private firestore: Firestore,
    @Inject(PLATFORM_ID) public platformId: Object,

  ) {
    this.collectionRef = collection(this.firestore, 'hashs');
  }

  loginAdmin() {
    signInWithPopup(this.auth, this.googleAuthProvider)
      .then(async res => {
        const email = res.user.email
        if (email === 'kelvinbruno15@gmail.com' || 'brunomonteiroestudio@gmail.com' || 'telmamatos2005@gmail.com') {
          const item = { nome: res?.user.displayName, email: res.user.email, id: res.user.uid, foto: res.user.photoURL };
          patchState(this.userStore, addEntity(item));
          return;
        }
        const current = await this.auth.currentUser;
        current?.delete()

      }).catch(err => {
      });

  }

  isAuth() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) { 
        const item = { nome: user.displayName, email: user.email, id: user.uid, foto: user.photoURL };
        patchState(this.userStore, addEntity(item))
        return 
      }

    if(!this.userStore.user()){
      const access_token = localStorage.getItem('access_token');
      if(!access_token){return}
      const isValid = await this.existeHash(access_token);
      const {error, results} = isValid;
      if(error){return;}
      const cliente = { ...results, auth: true};
      patchState(this.clienteStore, setEntity(cliente) )
    }

    });



  }

  logout() {
    this.auth.signOut();
    if(isPlatformBrowser(this.platformId)){
      localStorage.clear();
      patchState(this.userStore, removeAllEntities())
      patchState(this.clienteStore, removeAllEntities())
    }
    this.router.navigate(['/']);
    

  }


  async authLogin(cpf_cnpj: any, data_nasc: any) {
    return new Promise<IResponse>(async resolve =>{
      const q = query(
        collection(this.firestore, 'clientes'),
        where("cpf_cnpj", "==", String(cpf_cnpj)),
        where('data_nasc', '==', String(data_nasc)), 
        limit(1));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        resolve({ status: 404, error: true, results: undefined, message: 'Cliente não encontrado!' })
      }else{
        await querySnapshot.forEach((doc) => {
          let results = doc.data();
          results = {...results, auth: true}
          resolve({ status: 201, error: false, results, message: 'Login com sucesso!' })
        });
      }

    });

  }

  existeHash(hash: string){
    return new Promise<IResponse>(async resolve =>{
      const q = query(collection(this.firestore, 'clientes'), where("hash", "==", hash), limit(1));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        resolve({ status: 404, error: true, results: undefined, message: 'Cliente não encontrado!' })
      }else{
        await querySnapshot.forEach((doc) => {
          resolve({ status: 201, error: false, results: doc.data(), message: 'Login com sucesso!' })
        });
      }

    });
  }
}
