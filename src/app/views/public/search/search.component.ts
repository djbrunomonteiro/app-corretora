import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { StoreService } from '../../../services/store.service';
import { Observable, first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { EGroup, EAction } from '../../../store/app.actions';
import { AllAnuncios } from '../../../store/selectors/anuncio.selector';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  anuncios$!: Observable<any[]>

  constructor(
    private fb: FormBuilder,
    public core: CoreService,
    private router: Router,
    private storeService: StoreService,
  ){}

  ngOnInit(): void {
    this.getItens();
  }

  getItens(){
    const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
    result$.pipe(first()).subscribe((r) =>{
      console.log('chamouu ?', r);
      
      this.anuncios$ = this.storeService.select(AllAnuncios);
      this.anuncios$.subscribe(res => {
        console.log('res', res);
      } )
    })

  }

  goDetails(url: any){
    this.router.navigate([`/anuncios/${url}`])

  }


}
