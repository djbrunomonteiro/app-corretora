import { Action } from '@ngrx/store';

export enum EGroup {
    User = "User",
    Anuncio = "Anuncio",
    Lead = "Lead"
}

export enum EAction {
    GetAll = "GetAll",
    SetAllStore = "SetAllStore",
    GetAllSucess = "GetAllSucess",
    GetAllError = "GetAllError",

    
    SetOne = "SetOne",
    SetOneStore = "SetOneStore",
    SetOneSucess = "SetOneSucess",
    SetOneError = "SetOneError",
    
    GetOne = "GetOne",
    GetOneSucess = "GetOneSucess",
    GetOneError = "GetOneError",

    UpdateOne = "UpdateOne",
    UpdateOneStore = "UpdateOneStore",
    UpdateOneSucess = "UpdateOneSucess",
    UpdateOneError = "UpdateOneError",

    DeleteOne = "DeleteOne",
    DeleteOneStore = "DeleteOneStore",
    DeleteOneSucess = "DeleteOneSucess",
    DeleteOneError = "DeleteOneError"

}

export interface IAction extends Action{
    props?: IProps,
    params?: IParams,
    force?: boolean
}

export interface MyAction {
    group: EGroup,
    action: EAction,
    props?: IProps,
    params?: IParams,
    force?: boolean
}

export interface IProps {
    id?: string,
    item?: Object,
    itens?: any[],
    email?: string ,
    senha?: string
    message?: string,
    error?: boolean,
    status?: number
}

export interface IParams {
    id?: string | undefined | null,
    url?: string,
    start?: number,
    end?: number
}


export const appActions = (action: MyAction) => ({
    type: `[${action.group}-${action.action}]`,
    props: action.props,
    params: action.params,
    force: action.force
})

export const getAction = (group: EGroup, action: EAction) => {
    return `[${group}-${action}]`;
}