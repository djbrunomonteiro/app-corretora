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
import { AlertConfirmComponent } from '../../../../../shared/alert-confirm/alert-confirm.component';
import { UtilsService } from '../../../../../services/utils.service';

@Component({
  selector: 'app-admin-anuncios',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    AdminAnuncioEditComponent],
  templateUrl: './admin-anuncios.component.html',
  styleUrl: './admin-anuncios.component.scss'
})
export class AdminAnunciosComponent implements OnInit {


  displayedColumns: string[] = ['codigo','titulo', 'categoria', 'tipo', 'cidade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  anuncios$!: Observable<any[]>

  constructor(
    private storeService: StoreService,
    public dialog: MatDialog,
    private utils: UtilsService
  ){}

  ngOnInit(): void {
    this.getItens();
    // this.openEdit()

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getItens(){
    const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
    result$.pipe(first()).subscribe((r) =>{
      console.log('chamouu ?', r);
      
      this.anuncios$ = this.storeService.select(AllAnuncios);
      this.anuncios$.subscribe(res => {
        console.log('res', res);
        
        if(res?.length){
          this.dataSource = new MatTableDataSource<any>(res); 
        }
      } )
    })

  }

  openEdit(item?: any){
    const dialogRef = this.dialog.open(AdminAnuncioEditComponent, {disableClose: true, data: item, minWidth: 1000, minHeight: 700} );
  }

  delete(id: string){
    const dialogRef = this.dialog.open(AlertConfirmComponent );
    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if(!res){return}

      const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.DeleteOne, params: {id}});
      result$.pipe(first()).subscribe((act) =>{
        this.utils.showMessage(act.props?.message)
      })
    });


  }




}
