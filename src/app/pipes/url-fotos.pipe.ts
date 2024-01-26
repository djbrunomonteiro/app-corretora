import { Pipe, PipeTransform } from '@angular/core';
import { ESize } from '../enums/folders';
import { UploadService } from '../services/upload.service';
import { BehaviorSubject } from 'rxjs';

@Pipe({
  name: 'urlFotos',
  standalone: true
})
export class UrlFotosPipe implements PipeTransform {

  constructor(private uploadService: UploadService){}

  transform(name: string, folder: string, size: string = ESize.medium): any {

    return ''
  }

}
