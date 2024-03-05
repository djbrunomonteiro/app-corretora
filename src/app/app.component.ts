import { Component, HostListener, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { register } from 'swiper/element/bundle';
import { UtilsService } from './services/utils.service';

register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,

  ],
  providers: [

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-corretora';
  constructor(
    private auth: AuthService,
    private utils: UtilsService
    ) {


  }
  ngOnInit(): void {
    this.auth.isAuth();
    this.utils.widthSize.next(window.innerWidth);
    this.utils.heigthSize.next(window.innerHeight);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(){
    this.utils.widthSize.next(window.innerWidth);
    this.utils.heigthSize.next(window.innerHeight);
  }


}


