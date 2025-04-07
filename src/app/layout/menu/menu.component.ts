import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IMenu } from '../../models/menu';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { ETabs } from '../../enums/tabs';
import { AuthService } from '../../services/auth.service';
import { ClientesStore } from '../../store/cliente-store';
import { UserStore } from '../../store/user-store';

@Component({
    selector: 'app-menu',
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {

  clienteMenu: IMenu[] = [
    {
      title: 'Seus Agendamentos',
      subtitle: 'Marque, altere e acompanhe seus agendamentos',
      icon: '',
      url: ETabs.agendamento
    },
    {
      title: 'Preferência de ímoveis/Anúncios',
      subtitle: 'Adicione ou altere suas preferências',
      icon: '',
      url: ETabs.preferencia
    },
    {
      title: 'Seus Favoritos',
      subtitle: 'Lista com todos os seus favoritos',
      icon: '',
      url: ETabs.favorito
    },
    {
      title: 'Sua conta',
      subtitle: 'Acompanhe sua conta e dados',
      icon: '',
      url: ETabs.conta
    }
  ]
  empresaMenu: IMenu[] = [
    {
      title: 'Quem sou',
      iconlabel: 'icon face',
      icon: 'face_4',
      url: 'quem-sou'
    },
    {
      title: 'Contatos',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'contatos'
    },
    {
      title: 'Links',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'links'
    },
    // {
    //   title: 'Depoimentos',
    //   iconlabel: 'comment',
    //   icon: 'comment',
    //   url: 'depoimentos'
    // },
    // {
    //   title: 'Parceiros',
    //   iconlabel: 'group icon',
    //   icon: 'group',
    //   url: 'parceiros'
    // },
    {
      title: 'Politica de privacidade',
      iconlabel: 'report icon',
      icon: 'report',
      url: 'politica-de-privacidade'
    },
  ]

  clienteStore = inject(ClientesStore);
  userStore = inject(UserStore)
  

  constructor(
    public _bottomSheetRef: MatBottomSheetRef<MenuComponent>,
    private router: Router,
    public authService: AuthService
    ) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  goCliente(item: any){
    if(item){
      const queryParams = {tab: item.url} as NavigationExtras;
      const cliente = this.clienteStore.isAuth();
      this.router.navigate([`auth/cliente/${cliente.id}`], {queryParams});
    }else{
      this.router.navigate([`auth/cliente`]);
    }
    
    this._bottomSheetRef.dismiss();
  }

  goAdmin(item: any){
    this.router.navigate([`/${item.url}`]);
    this._bottomSheetRef.dismiss();
  }

}
