import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, first } from 'rxjs';
import { StoreService } from '../../../../../services/store.service';
import { UtilsService } from '../../../../../services/utils.service';
import { AlertConfirmComponent } from '../../../../shared/alert-confirm/alert-confirm.component';
import { EGroup, EAction } from '../../../../../store/app.actions';
import { Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ClientesStore } from '../../../../../store/cliente-store';

@Component({
  selector: 'app-admin-clientes-list',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './admin-clientes-list.component.html',
  styleUrl: './admin-clientes-list.component.scss'
})
export class AdminClientesListComponent implements OnInit {

  clientesStore = inject(ClientesStore);
  displayedColumns: string[] = ['nome', 'cpf_cnpj', 'whatsapp', 'email', 'tipo_compra', 'cidade', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private storeService: StoreService,
    public dialog: MatDialog,
    private utils: UtilsService,
    private router: Router
  ) {
    effect(() => {
      this.setDataTable()
    })
  }
  ngOnInit(): void {
    this.setDataTable();
  }

  setDataTable(){
    this.dataSource = new MatTableDataSource<any>(this.clientesStore.allItens());
    this.dataSource.paginator = this.paginator;
  }


  openEdit(item?: any) {
    console.log('item', item);
    
    if(item){
      this.router.navigate([`/auth/admin/clientes/edit/${item.id}`])
    }else{
      this.router.navigate([`/auth/admin/clientes/edit`])
    }
    
    // const dialogRef = this.dialog.open(AdminAnuncioEditComponent, { disableClose: true, data: item, minWidth: 1000, minHeight: 700 });
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(AlertConfirmComponent);
    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if (!res) { return }

      const result$ = this.storeService.dispatchAction({ group: EGroup.Anuncio, action: EAction.DeleteOne, params: { id } });
      result$.pipe(first()).subscribe((act) => {
        this.utils.showMessage(act.props?.message)
      })
    });


  }




}
