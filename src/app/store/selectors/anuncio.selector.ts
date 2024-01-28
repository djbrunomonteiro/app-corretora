import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const anuncioState = createFeatureSelector<fromAppReducer.AppState>('anuncioState');

export const AllAnuncios = createSelector(
    anuncioState,
    (elements) => {
        const result = Object.values(elements.entities);
        console.log('result', result);
        
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