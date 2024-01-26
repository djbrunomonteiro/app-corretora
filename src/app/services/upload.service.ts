import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable, catchError, first, map, of, switchMap, throwError } from 'rxjs';
import { EFolderUpload, ESize } from '../enums/folders';
import { UtilsService } from './utils.service';
import { StorageReference, getStorage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage'
import { IResize } from '../models/resize';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  basePath = '/anuncios';
  storage = getStorage()
  storageRef: StorageReference = ref(this.storage);

  constructor(
    private http: HttpClient,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private utils: UtilsService,
  ) { }


  async uploadStorage(file: File, folder = 'anuncios') {
    return new Promise<string>(async resolve => {
      const filesResize = await this.gerarMultiplosTamanhos(file);
      let results = ''
      for (let index = 0; index < filesResize.length; index++) {
        const size = filesResize[index]?.size;
        const fileR = filesResize[index]?.file;
        this.storageRef = ref(this.storage, `${folder}/${size}/${fileR?.name}`);
        const resUpload = await uploadBytes(this.storageRef, file);
        results = resUpload?.ref.name;
      }

      resolve(results)

    })



  }

  async getFoto(name: string, folder: string, size: string = ESize.medium) {
    const path = `${folder}/${size}/${name}`
    this.storageRef = ref(this.storage, path);
    return await getDownloadURL(this.storageRef)


  }


  /* Realiza o upload nas subpastas (small|medium|large) da pasta principal.
     caso ocorrá algum erro em um dos envios, vai parar o envio e retornará um objeto com error: true ;
  */
  async uploadImg(file: any, folder: EFolderUpload) {
    return new Promise<any>(async (resolve) => {
      let resEnvio;
      const msgErro = 'Ocorreu um erro ao realizar upload da imagem. Tente novamente!'
      const resMultiplos = await this.gerarMultiplosTamanhos(file);
      if (!resMultiplos) { resolve({ error: true, status: 500, message: msgErro }) };

      const itens = resMultiplos as any[] ?? [];

      for (let index = 0; index < itens.length; index++) {
        const elem = itens[index] as any;
        const resFile = elem?.file as File;
        const size = elem?.size as string;
        const subFolder = `${folder}/${size}`;

        resEnvio = await this.enviar(resFile, subFolder);
        if (resEnvio?.error) {
          resolve({ error: true, status: resEnvio?.status, message: msgErro })
          break;
        }
      }

      resolve(resEnvio)

    })


  }

  enviar(file: File, folder: string) {
    return new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('filename', file.name);

      const result$ = this.http.post(`/uploads`, formData).pipe(
        map((res: any) => {
          const data = this.extractData(res);
          const resData = { ...data, error: false }
          return resData;
        }),
        catchError(this.handleError)
      )

      result$.subscribe({
        next: (res) => {
          resolve(res)
        },
        error: (err) => {
          resolve({ status: 500, error: true, message: err })
        }
      })

    })
  }

  uploadFile(file: any, folder: any): Observable<{}> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post(`/uploads`, formData).pipe(
      map((res: any) => this.extractData(res)),
      catchError(this.handleError)
    )
  }


  /* Como default criará 2 arquivos de tamanhos diferentes mas com o mesmo name.*/
  async gerarMultiplosTamanhos(file: File) {
    return new Promise<IResize[]>(async (resolve, reject) => {
      const results: any[] = [];
      const name = new Date().getTime() + '.jpg';
      let resResize;
      let size: ESize = ESize.large;

      for (let index = 0; index < 2; index++) {
        switch (index) {
          case 0:
            resResize = await this.resizeImg(file, name, 300, 300);
            size = ESize.medium
            break;
          default:
            resResize = await this.resizeImg(file, name, 1500, 1500);
            size = ESize.large
            break;
        }

        if (resResize.hasOwnProperty('error')) {
          results.push({ error: true, file: undefined, size })
        } else {
          results.push({ error: false, file: resResize, size })
        }

      }

      const houveErro = results.filter(elem => elem.error);
      if (houveErro.length) {
        reject(undefined)
      } else {
        resolve(results)
      }
    })

  }

  resizeImg(file: File, name: string, maxWidth: number, maxHeigth: number) {
    return new Promise<any>(resolve => {
      const resize$ = this.ng2ImgMaxService.resizeImage(file, maxWidth, maxHeigth);
      resize$.pipe(
        switchMap(resize => {
          const newFile = new File([resize], name, { type: 'image/jpeg' });
          const compres$ = this.ng2ImgMaxService.compressImage(newFile, 0.120);
          return compres$;
        }),
        catchError(() => of({ error: true })),
      ).subscribe(res => resolve(res))
    })
  }

  obterImagemComoFile(url: string): Observable<File> {
    const filename = url.split('/').pop() ?? 'filename';
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      first(),
      map((arrayBuffer: ArrayBuffer) => {
        const blob = new Blob([arrayBuffer]);
        const file = new File([blob], filename, { type: blob.type });
        return file;
      })
    );
  }

  // if(res.hasOwnProperty('error')){return;}
  extractData(res: Response) {
    const body = res;
    return body || {}
  }

  handleError(error: Response | any) {
    let message: string;
    if (error instanceof Response) {
      const err = error || '';
      message = `${error.status} - ${error.statusText} || '' ${err}`;
    } else {
      message = error.message ? error.message : error.toString();
    }
    return throwError(message);
  }

}
