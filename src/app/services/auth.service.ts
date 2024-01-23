import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  googleAuthProvider = new GoogleAuthProvider();

  constructor(
    private auth: Auth,
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
          console.log('sucesso', res);
        }else{
          const current = await this.auth.currentUser;
          current?.delete()
          

   
        }
        
      }).catch(err => {
        console.log('houve error', err);

      });

  }
}
