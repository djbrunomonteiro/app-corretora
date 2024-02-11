import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { EAction, EGroup, IAction } from "./app.actions";


export interface AppState extends EntityState<any> {};

export const adapter: EntityAdapter<any> = createEntityAdapter<any>();
export const inititalState = adapter.getInitialState({})

export class actionsReducer {

    //Entity adapter = altera o estado da aplicação usando suas funções auxiliares
    public static UserReducer = (state = inititalState, action: IAction) => {
        switch (action.type) {
            case `[${EGroup.User}-${EAction.SetOneStore}]`:
                const item = action.props?.item;
                return item ? adapter.setOne(action?.props?.item, state) : state
            case `[${EGroup.User}-${EAction.Clear}]`:
                return adapter.removeAll(inititalState)
            default:
                return state;
        }
    }

    public static AnuncioReducer = (state = inititalState, action: IAction) => {
        switch (action.type) {
            case `[${EGroup.Anuncio}-${EAction.SetAllStore}]`:
                const itens = action.props?.itens;
                return itens ? adapter.upsertMany(itens, state) : state;

            case `[${EGroup.Anuncio}-${EAction.SetOneStore}]`:
                const item = action.props?.item;
                return item ? adapter.setOne(action?.props?.item, state) : state

            case `[${EGroup.Anuncio}-${EAction.DeleteOneStore}]`:
                const id = action?.props?.id;
                return id ? adapter.removeOne(id, state) : state;
            case `[${EGroup.Anuncio}-${EAction.Clear}]`:
                return adapter.removeAll(inititalState)
            default:
                return state;
        }
    }

    public static LeadReducer = (state = inititalState, action: IAction) => {
        switch (action.type) {
            case `[${EGroup.Lead}-${EAction.SetAllStore}]`:
                const itens = action.props?.itens;
                return itens ? adapter.upsertMany(itens, state) : state;

            case `[${EGroup.Lead}-${EAction.SetOneStore}]`:
                const item = action.props?.item;
                return item ? adapter.setOne(action?.props?.item, state) : state

            case `[${EGroup.Lead}-${EAction.DeleteOneStore}]`:
                const id = action?.props?.id;
                return id ? adapter.removeOne(id, state) : state;
            case `[${EGroup.Lead}-${EAction.Clear}]`:
                return adapter.removeAll(inititalState)
            default:
                return state;
        }
    }

    public static ClienteReducer = (state = inititalState, action: IAction) => {
        let id: any;
        switch (action.type) {
            case `[${EGroup.Cliente}-${EAction.SetAllStore}]`:
                const itens = action.props?.itens;
                return itens ? adapter.upsertMany(itens, state) : state;

            case `[${EGroup.Cliente}-${EAction.SetOneStore}]`:
                const item = action.props?.item;
                return item ? adapter.setOne(action?.props?.item, state) : state

            case `[${EGroup.Cliente}-${EAction.DeleteOneStore}]`:
                id = action?.props?.id;
                return id ? adapter.removeOne(id, state) : state;

            case `[${EGroup.Cliente}-${EAction.UpdateOneStore}]`:
                id = action?.params?.id;
                const changes = action?.props?.item;
                return changes ? adapter.updateOne({id, changes}, state) : state;
            case `[${EGroup.Cliente}-${EAction.Clear}]`:
                return adapter.removeAll(inititalState)

            default:
                return state;
        }
    }

    public static AgendamentoReducer = (state = inititalState, action: IAction) => {
        let id: any;
        switch (action.type) {
            case `[${EGroup.Agendamento}-${EAction.SetAllStore}]`:
                const itens = action.props?.itens;
                return itens ? adapter.upsertMany(itens, state) : state;

            case `[${EGroup.Agendamento}-${EAction.SetOneStore}]`:
                const item = action.props?.item;
                return item ? adapter.setOne(action?.props?.item, state) : state

            case `[${EGroup.Agendamento}-${EAction.DeleteOneStore}]`:
                id = action?.props?.id;
                return id ? adapter.removeOne(id, state) : state;

            case `[${EGroup.Agendamento}-${EAction.UpdateOneStore}]`:
                id = action?.params?.id;
                const changes = action?.props?.item;
                return changes ? adapter.updateOne({id, changes}, state) : state;
            case `[${EGroup.Agendamento}-${EAction.Clear}]`:
                return adapter.removeAll(inititalState)

            default:
                return state;
        }
    }


}