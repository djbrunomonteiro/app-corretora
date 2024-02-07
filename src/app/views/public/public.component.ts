import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { EAction, EGroup } from '../../store/app.actions';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent implements AfterViewInit {

  constructor(
    private auth: AuthService,
    private storeService: StoreService
  ){}

  ngAfterViewInit(): void {
    this.checkAuth();
  }


  async checkAuth() {
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
      const isValid = await this.auth.existeHash(access_token);
      console.log('isValid', isValid);
      
      if (!isValid.error) {
        const item = isValid.results;
        this.setClienteAuth({ ...item, auth: true })
      }


    } 

  }

  setClienteAuth(item: any) {
    if (!item) { return }
    this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetOneStore, props: { item } });
    localStorage.setItem('access_token', item.hash)

  }

}
