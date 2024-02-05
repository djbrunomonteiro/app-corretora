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

  async uploadIMG(file: File, folder = 'anuncios') {
    return new Promise<string>(async resolve => {
      const filesResize = await this.gerarMultiplosTamanhos(file);
      let results = ''
      for (let index = 0; index < filesResize.length; index++) {
        const size = filesResize[index]?.size;
        const fileR = filesResize[index]?.file;
        if(!fileR){return;}
        this.storageRef = ref(this.storage, `${folder}/${size}/${fileR?.name}`);
        const resUpload = await uploadBytes(this.storageRef, fileR);
        results = resUpload?.ref.name;
      }

      resolve(results)

    })



  }


  async uploadFILE(file: File, folder = 'documentos') {
    return new Promise<string>(async resolve => {
      const access_token = localStorage.getItem('access_token') ?? '';
      const custom = {access_token}
      let results = '';
      this.storageRef = ref(this.storage, `${folder}/${file.name}`);
      const resUpload = await uploadBytes(this.storageRef, file, {customMetadata: custom});
      results = resUpload?.ref.fullPath;
      resolve(results)

    })



  }

  generateNewFileName(file: File): string {
    const extension = file.name.split('.').pop();
    const newName = `${Date.now()}${Math.random().toString(36).substring(7)}.${extension}`;
    return newName;
  };

  async getFoto(name: string, folder: string, size: string = ESize.medium) {
    const path = `${folder}/${size}/${name}`
    this.storageRef = ref(this.storage, path);
    console.log('path', path);
    
    console.log(this.storageRef);
    
    return await getDownloadURL(this.storageRef)


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


}
