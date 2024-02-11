import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClienteIsAuth, OneCliente } from './cliente.selector';
export const anuncioState = createFeatureSelector<fromAppReducer.AppState>('anuncioState');

export const AllAnuncios = createSelector(
    anuncioState,
    (elements) => {
        const result = Object.values(elements.entities);
        
        
        return result
    }
);

export const OneAnuncio = (url: string) => createSelector(
    AllAnuncios,
    (elements) => {
        const result = elements.filter(elem => elem.url === url)[0];
        return result
    }
);

export const favoritosAnuncio = (id?: string) => createSelector(
    OneCliente(id),
    AllAnuncios,
    (cliente, anuncios) => {
        if(!cliente){return []}
        const favoritos = cliente.favoritos as string[] ?? [];
        const result = favoritos.map(fav => {
            const res = anuncios.filter(anun => anun.id === fav)[0];
            return res;
        });
        return result
    }
);

export const recomendadosAnuncio = (id: string) => createSelector(
    OneCliente(id),
    AllAnuncios,
    (cliente, anuncios) => {
        const recomendados = cliente.recomendados as string[] ?? [];
        const result = recomendados.map(fav => {
            const res = anuncios.filter(anun => anun.id === fav)[0];
            return res;
        });
        return result
    }
);