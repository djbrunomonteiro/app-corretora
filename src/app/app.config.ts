import { ApplicationConfig, LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducers } from './store/app.state';
import { metaReducers } from './store/logout.reducer';
import { AnuncioEffectsService } from './store/effects/anuncio-effects.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { LeadEffectsService } from './store/effects/lead-effects.service';
import { ClienteEffectsService } from './store/effects/cliente-effects.service';
import { AgendamentoEffectsService } from './store/effects/agendamento-effects.service';
import { provideClientHydration } from '@angular/platform-browser';
import { AnunciosStore } from './store/anuncios';


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
        AnunciosStore
        
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
    { provide: LOCALE_ID, useValue: 'pt' }, provideClientHydration(),
    provideStore()


]
};
