import { Component, afterNextRender, inject } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MaterialModule } from '../../../modules/material/material.module';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cookies',
    imports: [
        CommonModule,
        MatButtonModule
    ],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 }))
            ])
        ])
    ],
    templateUrl: './cookies.component.html',
    styleUrl: './cookies.component.scss'
})
export class CookiesComponent {
  none = true;
  #router = inject(Router);

  constructor(private core: CoreService){
    afterNextRender(() => {
      setTimeout(() =>{
        if(String(this.#router.url).includes('link')){return}
        this.core.getAcceptedCookies();
        this.core.acceptedCookies$.subscribe(res =>{
          if(!res){
            this.none = false;
          }else{
            this.none = true;
          }
        })
      }, 1000)
      
    })
  }

  setAcceptCookies(value: string){
    this.core.setAcceptedCookies(value)
  }

}
