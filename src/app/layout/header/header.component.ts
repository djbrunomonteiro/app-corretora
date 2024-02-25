import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { ClienteIsAuth } from '../../store/selectors/cliente.selector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MenuComponent } from '../menu/menu.component';
import { userData } from '../../store/selectors/user.selector';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  readonly currentUrl$ = new BehaviorSubject<string>('');
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
      titulo: 'Clientes',
      icon: '',
      url: '/auth/admin/clientes'
    }
  ];


  cliente$ = this.storeService.select(ClienteIsAuth)

  showFiller = false;

  constructor(
    private router: Router,
    public auth: AuthService,
    private storeService: StoreService,
    private _bottomSheet: MatBottomSheet
    ){}

  ngOnInit(): void {
    this.currentUrl$.next(this.router.url);
    this.isAdmin$.next(this.router.url.includes('admin'));
    
  }

  openBottomSheet(): void {
    this._bottomSheet.open(MenuComponent, {panelClass: 'menu-container'});
  }

}
