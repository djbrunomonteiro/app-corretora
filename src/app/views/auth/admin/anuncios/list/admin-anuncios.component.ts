import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AnuncioService } from '../../../../../services/anuncio.service';
import { StoreService } from '../../../../../services/store.service';
import { EAction, EGroup } from '../../../../../store/app.actions';
import { Observable, first } from 'rxjs';
import { AllAnuncios } from '../../../../../store/selectors/anuncio.selector';
import { AdminAnuncioEditComponent } from '../edit/edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-anuncios',
  standalone: true,
  imports: [MaterialModule, CommonModule, AdminAnuncioEditComponent],
  templateUrl: './admin-anuncios.component.html',
  styleUrl: './admin-anuncios.component.scss'
})
export class AdminAnunciosComponent implements OnInit {


  displayedColumns: string[] = ['titulo', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  anuncios$!: Observable<any[]>

  constructor(
    private storeService: StoreService,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getItens();
    this.openEdit()

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getItens(){
    const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
    result$.pipe(first()).subscribe((r) =>{
      this.anuncios$ = this.storeService.select(AllAnuncios);
      this.anuncios$.subscribe(res => {
        if(res?.length){
          this.dataSource = new MatTableDataSource<any>(res); 
        }
      } )
    })


  }

  openEdit(item?: any){
    const dialogRef = this.dialog.open(AdminAnuncioEditComponent, {disableClose: true, data: {t: 'teste'}, minWidth: 1000, minHeight: 700} );
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }



}
