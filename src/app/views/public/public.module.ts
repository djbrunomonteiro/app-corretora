import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { RouterModule } from '@angular/router';
import { PublicComponent } from './public.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';


@NgModule({
  declarations: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class PublicModule { }
