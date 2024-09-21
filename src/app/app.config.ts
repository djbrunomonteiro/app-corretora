import { ApplicationConfig, LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideClientHydration } from '@angular/platform-browser';
import localePt from '@angular/common/locales/pt'
import { registerLocaleData } from '@angular/common';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

registerLocaleData(localePt, 'pt');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideEnvironmentNgxMask(),
    importProvidersFrom([
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideAnalytics(() => getAnalytics()),
    ]),

    // provideStore(appReducers, { metaReducers, runtimeChecks: {strictActionImmutability: false, strictStateImmutability: false} }),
    // provideEffects([
    //   AnuncioEffectsService, 
    //   LeadEffectsService,
    //   ClienteEffectsService,
    //   AgendamentoEffectsService
    // ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' }, provideClientHydration(),
    provideStore()


]
};
