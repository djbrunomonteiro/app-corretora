import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { ClienteIsAuth } from '../../store/selectors/cliente.selector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MenuComponent } from '../menu/menu.component';
import { UtilsService } from '../../services/utils.service';
import { UserStore } from '../../store/user-store';
import { ClientesStore } from '../../store/cliente-store';
import { IMenu } from '../../models/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  #router = inject(Router);
  readonly currentUrl$ = new BehaviorSubject<string>('');
  userStore = inject(UserStore)
  isAdmin$ = new BehaviorSubject<boolean>(true);

  menuAdmin = [
    {
      titulo: 'Home',
      icon: '',
      url: '/auth/admin/home'
    },
    {
      titulo: 'Leads',
      icon: '',
      url: '/auth/admin/leads'
    },
    {
      titulo: 'Anúncios',
      icon: '',
      url: '/auth/admin/anuncios'
    },
    {
      titulo: 'Blog',
      icon: '',
      url: '/auth/admin/blog'
    },
    {
      titulo: 'Clientes',
      icon: '',
      url: '/auth/admin/clientes'
    }
  ];

  clienteStore = inject(ClientesStore)
  showFiller = false;
  isLinks = false

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
      {
        title: 'Politica de privacidade',
        iconlabel: 'report icon',
        icon: 'report',
        url: 'politica-de-privacidade'
      },
    ]

  constructor(
    private router: Router,
    public auth: AuthService,
    private _bottomSheet: MatBottomSheet,
    public utils: UtilsService
    ){}

  ngOnInit(): void {
    this.currentUrl$.next(this.router.url);
    this.isAdmin$.next(this.router.url.includes('admin'));
    this.checkIsLinks()
  }

  openBottomSheet(): void {
    this._bottomSheet.open(MenuComponent, {panelClass: 'menu-container'});
  }

  checkIsLinks(){
    this.isLinks = String(this.#router.url).includes('links');
    this.#router.events.subscribe(() =>  this.isLinks = String(this.#router.url).includes('links'))

  }

}
