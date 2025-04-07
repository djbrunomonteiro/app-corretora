import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../../auth/admin/admin-home/admin-home.component';
import { Observable } from 'rxjs';
import { StoreService } from '../../../services/store.service';
import { AllAnuncios } from '../../../store/selectors/anuncio.selector';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-anuncio-recentes',
    imports: [
        MaterialModule,
        CommonModule,
        NgxMaskDirective,
        NgxMaskPipe,
        UrlFotosPipe,
        FavoritoPipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './list-anuncio-recentes.component.html',
    styleUrl: './list-anuncio-recentes.component.scss'
})
export class ListAnuncioRecentesComponent implements OnInit {

  displayedColumns: string[] = ['foto', 'titulo', 'cidade', 'valor', 'acoes'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  anuncios$!: Observable<any[]>

  constructor(
    private storeService: StoreService,
    private router: Router
    ){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.anuncios$ = this.storeService.select(AllAnuncios);
    this.anuncios$.subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res); 

    } )
  }

  goDetails(url: any){
    this.router.navigate([`/anuncios/${url}`])

  }


  
}
