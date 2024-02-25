import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { StoreService } from './store.service';
import { EAction, EGroup } from '../store/app.actions';
import { Router } from '@angular/router';
import { CollectionReference, Firestore, and, collection, doc, getDocs, limit, query, setDoc, where } from '@angular/fire/firestore';
import { IResponse } from '../models/response';
import { userData } from '../store/selectors/user.selector';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  googleAuthProvider = new GoogleAuthProvider();

  collectionRef: CollectionReference | undefined;

  userData$ = new BehaviorSubject<any>(undefined);


  constructor(
    private auth: Auth,
    private storeService: StoreService,
    private router: Router,
    private firestore: Firestore,
  ) {

    this.collectionRef = collection(this.firestore, 'hashs');

    this.googleAuthProvider.setCustomParameters({
      login_hint: 'brunomonteiroestudio@gmail.com'
    });
    this.storeService.select(userData).subscribe(res => this.userData$.next(res))
  }

  loginAdmin() {
    signInWithPopup(this.auth, this.googleAuthProvider)
      .then(async res => {
        const email = res.user.email
        if (email === 'kelvinbruno15@gmail.com' || 'brunomonteiroestudio@gmail.com') {
          const item = { nome: res?.user.displayName, email: res.user.email, id: res.user.uid, foto: res.user.photoURL };
          this.storeService.dispatchAction({ group: EGroup.User, action: EAction.SetOneStore, props: { item } })
        } else {
          const current = await this.auth.currentUser;
          current?.delete()
        }

      }).catch(err => {
        console.log('houve error', err);

      });



  }

  isAuth() {
    this.auth.onAuthStateChanged((user) => {
      if (!user) { return }
      const item = { nome: user.displayName, email: user.email, id: user.uid, foto: user.photoURL };
      this.storeService.dispatchAction({ group: EGroup.User, action: EAction.SetOneStore, props: { item } })
    });

  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
    localStorage.clear();
    this.storeService.dispatchAction({group: EGroup.Cliente, action:EAction.Clear})
    this.storeService.dispatchAction({group: EGroup.Lead, action:EAction.Clear})
    this.storeService.dispatchAction({group: EGroup.User, action:EAction.Clear})

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
