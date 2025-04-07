import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';

@Component({
    selector: 'app-cliente-duvida',
    imports: [
        MaterialModule,
        CommonModule,
        NgxMaskDirective,
        NgxMaskPipe,
        UrlFotosPipe,
        FavoritoPipe
    ],
    templateUrl: './cliente-duvida.component.html',
    styleUrl: './cliente-duvida.component.scss'
})
export class ClienteDuvidaComponent {

  displayedColumns: string[] = ['pergunta', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

}
