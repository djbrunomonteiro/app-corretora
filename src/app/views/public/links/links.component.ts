import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IMenu } from '../../../models/menu';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent {

  links: IMenu[] = [
    {
      title: "Fale comigo no Whatsapp",
      icon: '',
      url: 'https://api.whatsapp.com/send?phone=5598970278027&text=Estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20telmamonteiro.com.br%20e%20gostaria%20de%20solicitar%20atendimento.',
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

}
