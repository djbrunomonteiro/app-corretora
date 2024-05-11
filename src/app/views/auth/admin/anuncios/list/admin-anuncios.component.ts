import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StoreService } from '../../../../../services/store.service';
import { EAction, EGroup } from '../../../../../store/app.actions';
import { Observable, first } from 'rxjs';
import { AdminAnuncioEditComponent } from '../edit/edit.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertConfirmComponent } from '../../../../shared/alert-confirm/alert-confirm.component';
import { UtilsService } from '../../../../../services/utils.service';
import { AnunciosStore } from '../../../../../store/anuncios';

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

  anunciosStore = inject(AnunciosStore)

  displayedColumns: string[] = ['codigo','titulo', 'categoria', 'tipo', 'cidade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  anuncios$!: Observable<any[]>

  constructor(
    private storeService: StoreService,
    public dialog: MatDialog,
    private utils: UtilsService
  ){
    effect(() => {
      this.setDataTable()
    })
  }

  ngOnInit(): void {
    this.setDataTable();
  }

  ngAfterViewInit() {

  }

  setDataTable(){
    this.dataSource = new MatTableDataSource<any>(this.anunciosStore.allItens());
    this.dataSource.paginator = this.paginator;
  }

  openEdit(item?: any){
    const dialogRef = this.dialog.open(AdminAnuncioEditComponent, {disableClose: true, data: item, minWidth: 1000, minHeight: 700} );
  }

  delete(id: string){
    const dialogRef = this.dialog.open(AlertConfirmComponent );
    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if(!res){return};
      console.log('idd', id);
      

      const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.DeleteOne, params: {id}});
      result$.pipe(first()).subscribe((act) =>{
        this.utils.showMessage(act.props?.message)
      })
    });


  }




}
