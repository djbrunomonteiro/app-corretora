import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClienteIsAuth, OneCliente } from './cliente.selector';
import { UtilsService } from '../../services/utils.service';
import { ESlides } from '../../enums/slides';
import { IAnuncio } from '../../models/anuncio';
import {AnuncioState, AnunciosStore} from '../anuncios-store'
import { inject } from '@angular/core';

export interface AppS {
    anuncios: AnuncioState
}


export const anuncioState = createFeatureSelector<AnuncioState>('user');

export const AllAnuncios = createSelector(
    anuncioState,
    (elements) => {
        console.log('chamou o select pai', elements);
        
        return []
        const result = Object.values(elements.entities);
        console.log(result);
        
        return result as IAnuncio[]
    }
);

export const UltimosAnuncios = (start = 0, end = 8) => createSelector(
    AllAnuncios,
    (elements) => {
        let result = UtilsService.prototype.ordenarItens(elements, 'created_at');
        result = result.filter((_, i) => i >= start && i <= end)
        return result
    }
);

export const OneAnuncio = (url: string) => createSelector(
    AllAnuncios,
    (elements) => {
        console.log(url);
        
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

export const anunciosSlides = (tipo: ESlides, start = 0, end = 8) => createSelector(
    AllAnuncios,
    (elements) => {

        console.log('elementios', elements);
        
        let result: IAnuncio[] = UtilsService.prototype.ordenarItens(elements, 'created_at');
        result = result.filter((elem) => String(elem.tipo).includes(tipo) && elem.status === 'aberto')
        result = result.filter((_, i) => i >= start && i <= end)
        return result
    }
);

export const SearchAnuncios = (search: any, order?: any) => createSelector(
    AllAnuncios,
    (elements) => {

        let results: any[] = [];
        
        const {all,termo, categoria, tipo, preco_max} = search;
        if(all){return {results: results.concat(elements), recomends: elements} }


        results = [...elements];

        if(termo){

            const resTermo = results.filter(elem => 
                String(elem.titulo).toLowerCase().includes(search?.termo.toLowerCase()) ||
                String(elem.descricao).toLowerCase().includes(search?.termo.toLowerCase()) ||
                String(elem.end_bairro).toLowerCase().includes(search?.termo.toLowerCase()) ||
                String(elem.end_cidade).toLowerCase().includes(search?.termo.toLowerCase()) ||
                String(elem.tipo).toLowerCase().includes(search?.termo.toLowerCase()) ||
                String(elem.codigo).toLowerCase().includes(search?.termo.toLowerCase())
                );
                
            results = [...resTermo]
        }



        if(categoria){
            results = results.filter(elem => elem.categoria === search?.categoria);
        }

        if(tipo){

            results = results.filter(elem => elem.tipo === search?.tipo);
        }

        if(preco_max){
            results = results.filter(elem => {
                const preco = Number(elem.preco) ?? 0; 
                if(preco === 0){return true};
                return preco <= Number(search?.preco_max) && preco >= Number(search?.preco_min)
            } );
        }


        return {results, recomends: elements} 
    }
);