import { Component, HostListener, Inject, OnInit, PLATFORM_ID, effect, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { register } from 'swiper/element/bundle';
import { UtilsService } from './services/utils.service';
import { AnunciosStore } from './store/anuncios-store';
import { CoreService } from './services/core.service';
import { CookiesComponent } from './views/shared/cookies/cookies.component';
import { filter } from 'rxjs';


register();

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        CookiesComponent
    ],
    providers: [],
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
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: Object,
    ) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
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

  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(){
    if (this.isBrowser) {
      this.utils.widthSize.next(window.innerWidth);
      this.utils.heigthSize.next(window.innerHeight);
    }
  }

}


