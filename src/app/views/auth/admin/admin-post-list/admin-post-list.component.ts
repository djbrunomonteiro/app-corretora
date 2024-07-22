import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { MaterialModule } from '../../../../modules/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { UtilsService } from '../../../../services/utils.service';
import { AlertConfirmComponent } from '../../../shared/alert-confirm/alert-confirm.component';
import { AdminAnuncioEditComponent } from '../anuncios/edit/edit.component';
import { BlogStore } from '../../../../store/blog-store';
import { AdminPostEditorComponent } from '../admin-post-editor/admin-post-editor.component';

@Component({
  selector: 'app-admin-post-list',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    AdminPostEditorComponent
  ],
  templateUrl: './admin-post-list.component.html',
  styleUrl: './admin-post-list.component.scss'
})
export class AdminPostListComponent implements OnInit{

  dialog = inject(MatDialog);
  utils = inject(UtilsService);
  blogStore = inject(BlogStore)

  displayedColumns: string[] = ['foto', 'titulo', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(

  ){
    effect(() => {
      this.setDataTable()
    })
  }

  ngOnInit(): void {
    this.blogStore.loadAll();
    this.setDataTable();
  }

  setDataTable(){
    this.dataSource = new MatTableDataSource<any>(this.blogStore.allItens());
    this.dataSource.paginator = this.paginator;
  }
  

  openEdit(item?: any){
    const dialogRef = this.dialog.open(AdminPostEditorComponent, {disableClose: true, data: item, minWidth: 1000, minHeight: 700} );
  }

  delete(id: string){
    const dialogRef = this.dialog.open(AlertConfirmComponent );
    dialogRef.afterClosed().pipe(first()).subscribe(async res => {
      if(!res){return};
      const {error, message} = await this.blogStore.removeOne(id);
      this.utils.showMessage(message);
      if(error){return};
    });
  }

}
