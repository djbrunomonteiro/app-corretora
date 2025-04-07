import { Component, OnInit } from '@angular/core';
import { IMenu } from '../../../models/menu';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../modules/material/material.module';
import { UtilsService } from '../../../services/utils.service';
import { CoreService } from '../../../services/core.service';
import { EMeta } from '../../../enums/meta';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-contatos',
    imports: [
        CommonModule,
        MaterialModule
    ],
    templateUrl: './contatos.component.html',
    styleUrl: './contatos.component.scss'
})
export class ContatosComponent implements OnInit {

  contatos: IMenu[] = [
    {
      title: 'Tel/Whatsapp: (98) 98127-2751',
      value: environment.whatsapp,
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: environment.whatsapp
    },
    {
      title: 'Instagram.com/telmamonteirodematos',
      value: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ==',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ=='
    },
    {
      title: 'Facebook.com/telma.monteiro.79',
      value: 'https://www.facebook.com/telma.monteiro.79?mibextid=ZbWKwL',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.facebook.com/telma.monteiro.79?mibextid=ZbWKwL'
    },
    {
      title: 'Email: telmamatos2005@gmail.com',
      value: 'telmamatos2005@gmail.com',
      iconlabel: 'email',
      icon: 'email',
      url: 'contatos'
    },
  ]

  constructor(
    public core: CoreService,
    public utils: UtilsService
    ) {
  }
  ngOnInit(): void {
    this.core.setTitle(`Telma Monteiro - página de contato e informações sobre imóveis no maranhão`);
    this.core.updateMeta('Telma Monteiro - página de contato e informações sobre imóveis no maranhão', EMeta.KEY_DEFAULT)

  }


}
