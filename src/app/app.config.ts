import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducers } from './store/app.state';
import { metaReducers } from './store/logout.reducer';
import { AnuncioEffectsService } from './store/effects/anuncio-effects.service';
import { provideHttpClient } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { Ng2ImgMaxService } from 'ng2-img-max';

export const appConfig: ApplicationConfig = {
  providers: [
    Ng2ImgMaxService,
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    importProvidersFrom([
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
    ]),
    provideStore(appReducers, { metaReducers }),
    provideEffects([AnuncioEffectsService]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
