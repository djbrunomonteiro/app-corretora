import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { StoreService } from './store.service';
import { EAction, EGroup } from '../store/app.actions';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  googleAuthProvider = new GoogleAuthProvider();

  constructor(
    private auth: Auth,
    private storeService: StoreService,
    private router: Router
  ) {

    this.googleAuthProvider.setCustomParameters({
      login_hint: 'brunomonteiroestudio@gmail.com'
    })
  }

  loginAdmin() {
    signInWithPopup(this.auth, this.googleAuthProvider)
      .then(async res => {
        const email = res.user.email
        if(email === 'kelvinbruno15@gmail.com' || 'brunomonteiroestudio@gmail.com'){
          const item = {nome: res?.user.displayName, email: res.user.email, id: res.user.uid, foto: res.user.photoURL};
          this.storeService.dispatchAction({group: EGroup.User, action: EAction.SetOneStore, props: {item}})          
        }else{
          const current = await this.auth.currentUser;
          current?.delete()
        }
        
      }).catch(err => {
        console.log('houve error', err);

      });

      

  }

  isAuth(){
    this.auth.onAuthStateChanged((user) => {
      if (!user){return}
      const item = {nome: user.displayName, email: user.email, id: user.uid, foto: user.photoURL};
      this.storeService.dispatchAction({group: EGroup.User, action: EAction.SetOneStore, props: {item}})  
    });

  }

  logout(){
    this.auth.signOut();
    this.router.navigate(['/'])

  }
}
