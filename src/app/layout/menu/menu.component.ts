import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IMenu } from '../../models/menu';
import { NavigationExtras, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ETabs } from '../../enums/tabs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
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
      title: 'Envio de Documentos',
      subtitle: 'Área de envio de arquivos e documentos',
      icon: '',
      url: ETabs.upload
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
      icon: 'face_4'
    },
    {
      title: 'Contatos',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg'
    },
    {
      title: 'Depoimentos',
      iconlabel: 'comment',
      icon: 'comment'
    },
    {
      title: 'Parceiros',
      iconlabel: 'group icon',
      icon: 'group'
    },
    {
      title: 'Politica de privacidade',
      iconlabel: 'report icon',
      icon: 'report'
    },
  ]

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<MenuComponent>,
    private router: Router,
    public clienteService: ClienteService
    ) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  goCliente(item: any){
    if(item){
      const queryParams = {tab: item.url} as NavigationExtras;
      this.router.navigate([`auth/cliente/${this.clienteService.clienteAuth.id}`], {queryParams});
    }else{
      this.router.navigate([`auth/cliente`]);
    }
    
    this._bottomSheetRef.dismiss();
  }

}
