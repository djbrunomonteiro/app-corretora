import { Component, HostListener, Inject, OnInit, PLATFORM_ID, effect, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { register } from 'swiper/element/bundle';
import { UtilsService } from './services/utils.service';
import { AnunciosStore } from './store/anuncios-store';
import { CoreService } from './services/core.service';
import { CookiesComponent } from './views/shared/cookies/cookies.component';

register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CookiesComponent

  ],
  providers: [

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-corretora';
  isBrowser!: boolean;
  anunciosStore = inject(AnunciosStore)

  constructor(
    private core: CoreService,
    private auth: AuthService,
    private utils: UtilsService,
    @Inject(PLATFORM_ID) public platformId: Object,
    ) {
    }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.auth.isAuth();
      this.utils.widthSize.next(window.innerWidth);
      this.utils.heigthSize.next(window.innerHeight);
    }
  }
  
  getAll(){
    console.log('get alll');
    

  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(){
    if (this.isBrowser) {
      this.utils.widthSize.next(window.innerWidth);
      this.utils.heigthSize.next(window.innerHeight);
    }
  }

}


