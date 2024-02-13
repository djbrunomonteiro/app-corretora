import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../../../services/core.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StoreService } from '../../../services/store.service';
import { EAction, EGroup } from '../../../store/app.actions';
import { SearchHomeComponent } from '../../shared/search-home/search-home.component';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SlidesHomeComponent } from '../../shared/slides-home/slides-home.component';
import { BannerVenderHomeComponent } from '../../shared/banner-vender-home/banner-vender-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    SearchHomeComponent,
    UrlFotosPipe,
    SlidesHomeComponent,
    BannerVenderHomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  form = this.fb.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: ['']
  })


  lancamentos = [
    'https://lh3.googleusercontent.com/qINDSbuGxqeXZJB5n6X1RlfdS2HhX79OS4BrCvdtasvbvKFkoKMYpPqqXCVMpMzYevz-Z7Yra2T6v6kLD5_XSXcEvEeEapr5dhpBNNsqZQ=s0',
    'https://lh3.googleusercontent.com/BLUv8K8PVW-E5XPTI8MqUO_X9v_f5uzVjAVWuu-W3OOXtLneoLh2ZfCfq-yygq63kJVRMO99P_7sFniZPo2Z7FLW5nvSEixuv9bLC42R=s0',
  ];




  constructor(
    private fb: FormBuilder,
    public core: CoreService,
    private router: Router,
  ){}


  getUrl(url: string) {
    return `url(${url})`;
  }





}
