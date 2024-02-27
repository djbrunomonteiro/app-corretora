import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { RouterModule } from '@angular/router';
import { PublicComponent } from './public.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { TitlePageComponent } from '../shared/title-page/title-page.component';
import { BannerPrincipalComponent } from '../shared/banner-principal/banner-principal.component';


@NgModule({
  declarations: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    TitlePageComponent,
    BannerPrincipalComponent
  ]
})
export class PublicModule { }
