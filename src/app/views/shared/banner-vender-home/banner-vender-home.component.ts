import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SearchHomeComponent } from '../search-home/search-home.component';
import { MatDialog } from '@angular/material/dialog';
import { FormContatoComponent } from '../form-contato/form-contato.component';

@Component({
    selector: 'app-banner-vender-home',
    imports: [
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SearchHomeComponent,
        UrlFotosPipe,
    ],
    templateUrl: './banner-vender-home.component.html',
    styleUrl: './banner-vender-home.component.scss'
})
export class BannerVenderHomeComponent {

  constructor(
    public dialog: MatDialog,
  ){}

  openContato(anuncio?: any){
    const dialogRef = this.dialog.open(FormContatoComponent, {disableClose: false, data: {anuncio}, minWidth: '50vw', height: '90vh'} );
  }

}
