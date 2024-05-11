import { Pipe, PipeTransform } from '@angular/core';
import { ESize } from '../enums/folders';
import { UploadService } from '../services/upload.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Pipe({
  name: 'urlFotos',
  standalone: true
})
export class UrlFotosPipe implements PipeTransform {

  constructor(private uploadService: UploadService){}

  transform(name: string, folder: string, size: string = ESize.large): Observable<string> {
    return new Observable<string>(sub => {
      this.uploadService.getFoto(name, folder, size)
        .then(res => {
          sub.next(res);
          sub.complete(); // Sinalizar a finalização do Observable
        })
        .catch(err => {
          // Tratar erros adequadamente, por exemplo, emitindo um valor padrão
          sub.next('');
          sub.complete();
        });
    });
  }

}
