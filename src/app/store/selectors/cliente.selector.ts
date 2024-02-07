import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const clienteState = createFeatureSelector<fromAppReducer.AppState>('clienteState');

export const AllClientes = createSelector(
    clienteState,
    (elements) => {
        const result = Object.values(elements.entities);
        return result
    }
);

export const ClienteIsAuth =  createSelector(
    AllClientes,
    (elements) => {
        const result = elements.filter(elem => elem.auth)[0];
        console.log(result);
        
        return result
    }
);

export const OneCliente = (id?: string) => createSelector(
    AllClientes,
    (elements) => {
        const result = elements.filter(elem => elem.id === id)[0];
        return result
    }
);

export const isFavorito = (id: string) => createSelector(
    ClienteIsAuth,
    (element) => {
        if(!element){return false;}
        return element.favoritos?.includes(id)
    }
);