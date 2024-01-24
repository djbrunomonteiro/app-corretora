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
            default:
                return state;
        }
    }


}