import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IMenu } from '../../../models/menu';
import { environment } from '../../../../environments/environment';
import { ViewportScroller } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';
import { EEventsAnalytics } from '../../../enums/events-analitycs';

@Component({
    selector: 'app-links',
    imports: [
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './links.component.html',
    styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit {

  #scroller = inject(ViewportScroller);
  analyticsService = inject(AnalyticsService);


  links: IMenu[] = [
    {
      title: "Fale comigo no Whatsapp",
      icon: '',
      url: environment.whatsapp,
      target: '_blank'
    },
    {
      title: "Confira Meus Imóveis",
      icon: '',
      url: 'http://telmamonteiro.com.br/buscar?anuncios=todos-os-imoveis-publicados-compra-venda-aluguel-sao-luis-maranhao',
      target: '_self'

      
    },
    {
      title: "Book de Apresentação",
      icon: '',
      url: 'https://drive.google.com/file/d/17S4rkQgYA9UncT6VlvnNLX2_05tZNqbi/view',
      target: '_blank'
      
    }
  ]

  ngOnInit(): void {
    this.#scroller.scrollToPosition([0,0]);
    this.analyticsService.setLog(EEventsAnalytics.open_page, {pagina: 'link'})
  }

}
