import { patchState, signalStore, type, withComputed, withMethods, withState } from "@ngrx/signals";
import { IPost } from "../models/post";
import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { removeEntity, setEntities, setEntity, withEntities } from "@ngrx/signals/entities";
import { computed, inject } from "@angular/core";
import { BlogService } from "../services/blog.service";
import { UtilsService } from "../services/utils.service";
import { CoreService } from "../services/core.service";
import { tapResponse } from "@ngrx/operators";
import { Observable, firstValueFrom } from "rxjs";
import { IResponse } from "../models/response";

export interface BlogState {
    entities: IPost[];
    isLoading: boolean
  };
  
  export const initialState: BlogState = {
    entities: [],
    isLoading: false,
  };
  
  export const BlogStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withDevtools('blog'),
    withState(initialState),
    withEntities({ entity: type<IPost>() }),
    withComputed(({ entities }) => ({
      allItens: computed(() => entities())
    })),
  
    withMethods((store, blogService = inject(BlogService), utils = inject(UtilsService), core = inject(CoreService)) => {
  
      function loadAll() {
        patchState(store, { isLoading: true });
        return blogService.getAll().pipe(
          tapResponse({
            next: (res: any) => {
              const { results } = res;
              let posts = results as IPost[];
              posts = utils.ordenarItens(posts, 'created_at')
              patchState(store, setEntities(posts));
              patchState(store, { isLoading: false });
            },
            error: console.error,
          })
        ).subscribe()
  
      };
  
  
      function saveOne(post: IPost | Partial<IPost>) {
        let response$: Observable<IResponse>;
  
        if (post.id) {
          response$ = blogService.updateOne(post);
        } else {
          response$ = blogService.addOne(post);
        }
  
        const result$: Observable<IResponse> = response$.pipe(
          tapResponse({
            next: (response: IResponse) => {
              const { results } = response;
              let post = results as IPost;
              patchState(store, setEntity(post));
              return response
            },
            error: (err: any) => {
              console.error(err);
              return { status: err?.status ?? 400, error: true, message: err?.message }
            },
          }
          )
        )
        return firstValueFrom(result$)
      }
  
      function removeOne(id: string) {
        const result$: Observable<IResponse> = blogService.deleteOne(id).pipe(
          tapResponse({
            next: (response: IResponse) => {
              const { error } = response;
              if (!error) {
                patchState(store, removeEntity(id));
              }
              return response
            },
            error: (err: any) => {
              console.error(err);
              return { status: err?.status ?? 400, error: true, message: err?.message }
            },
          }
          )
        )
        return firstValueFrom(result$)
  
      }

      function selectPosts(limit = 10) {
        const res = store.entities().filter((_, i) => i < 10);
        return res;
      }

      function selectOne(url: string) {
        const res = store.entities().filter((elem) => elem.url.includes(url))[0];
        return res;
      }
  
      
      return { 
        loadAll, 
        saveOne, 
        removeOne, 
        selectPosts,
        selectOne

      }
  
    },
  
  
  
  
    ));