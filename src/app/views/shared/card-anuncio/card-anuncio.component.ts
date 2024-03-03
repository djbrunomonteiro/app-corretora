import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { Router, NavigationExtras } from '@angular/router';
import { first } from 'rxjs';
import { ClienteService } from '../../../services/cliente.service';
import { CoreService } from '../../../services/core.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-card-anuncio',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe,
    FavoritoPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './card-anuncio.component.html',
  styleUrl: './card-anuncio.component.scss'
})
export class CardAnuncioComponent implements OnInit {

  @Input() item: any;

  constructor(
    public core: CoreService,
    private router: Router,
    private clienteService: ClienteService,
    private utils: UtilsService
  ){}

  ngOnInit(): void {
    console.log(this.item);
    
    
  }

  goDetails(url: any){
    this.router.navigate([`/anuncios/${url}`])

  }

  addFavorito(id: string){
    this.clienteService.addFavorito(id).pipe(first()).subscribe(res =>{
      this.utils.showMessage(res.message);
    })
  }

  goFavorito(id: string){
    const queryParams = {tab: 'favorito', id} as NavigationExtras
    this.router.navigate([`auth/cliente/${this.clienteService.clienteAuth.id}`], {queryParams})
  }

}
