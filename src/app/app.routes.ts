import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./views/public/public.module').then(m => m.PublicModule)
    },    
    {
        path: 'auth',
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule)
    }

];
