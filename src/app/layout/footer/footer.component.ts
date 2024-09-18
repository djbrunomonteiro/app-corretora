import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { MenuComponent } from '../menu/menu.component';
import { IMenu } from '../../models/menu';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MaterialModule,
    MenuComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

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
      title: 'Politica de privacidade',
      iconlabel: 'report icon',
      icon: 'report',
      url: 'politica-de-privacidade'
    },
  ];

  redesMenu: IMenu[] = [
    {
      title: 'Whatsapp',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: environment.whatsapp,
      target: '_blank'
    },    
    {
      title: 'Instagram',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ==',
      target: '_blank'
    },    {
      title: 'Facebook',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ==',
      target: '_blank'
    },


  ];

  fullYear = new Date().getFullYear();


  constructor(
    private router: Router,
    ) { }

  goAdmin(item: any){
    this.router.navigate([`/${item.url}`]);
  }

}
