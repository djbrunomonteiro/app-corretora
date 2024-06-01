import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { UtilsService } from '../../../../services/utils.service';
import { AlertConfirmComponent } from '../../../shared/alert-confirm/alert-confirm.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../modules/material/material.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AdminLeadEditComponent } from '../admin-lead-edit/admin-lead-edit.component';
import { LeadsStore } from '../../../../store/leads-store';

@Component({
  selector: 'app-admin-leads',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AdminLeadEditComponent
  ],
  templateUrl: './admin-leads.component.html',
  styleUrl: './admin-leads.component.scss'
})
export class AdminLeadsComponent implements OnInit{

  leadsStore = inject(LeadsStore);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['tipo', 'nome', 'mensagem','whatsapp', 'horarios', 'created', 'status','acoes'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
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

  setDataTable(){
    this.dataSource = new MatTableDataSource<any>(this.leadsStore.allItens());
    this.dataSource.paginator = this.paginator;
  }

  openEdit(item?: any){
    const dialogRef = this.dialog.open(AdminLeadEditComponent, {disableClose: true, data: item, minWidth: 1000, minHeight: 700} );
  }

  delete(id: string){
    const dialogRef = this.dialog.open(AlertConfirmComponent );
    dialogRef.afterClosed().pipe(first()).subscribe(async res => {
      if(!res){return};
      const {message} = await this.leadsStore.removeOne(id);
      this.utils.showMessage(message)
    });
  }

}
