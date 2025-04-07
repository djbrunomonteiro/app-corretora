import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MenuComponent } from '../../../layout/menu/menu.component';

@Component({
    selector: 'app-tabs',
    imports: [
        MaterialModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss'
})
export class TabsComponent {

  openSheet = false;

  constructor(
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    ){}

  search(){
    const queryParams = { anuncios: 'todos-os-imoveis-publicados-compra-venda-aluguel-sao-luis-maranhao'} as NavigationExtras
    this.router.navigate(['buscar'], {queryParams} );
    if(this.openSheet) {
      this.closeBottomSheet();
      this.openSheet = false;
    }
  }

  openBottomSheet(): void {
    if(this.openSheet) {
      this.closeBottomSheet();
      this.openSheet = false;
      return
    }
    this._bottomSheet.open(MenuComponent, {panelClass: 'menu-container'});
    this.openSheet = true;
  }

  closeBottomSheet(): void {
    if(!this.openSheet){return}
    this._bottomSheet.dismiss();
  }

}
