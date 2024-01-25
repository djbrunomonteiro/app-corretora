import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UploadService } from '../../services/upload.service';
import { EFolderUpload } from '../../enums/folders';
import { UtilsService } from '../../services/utils.service';
import {NgxDropzoneModule} from 'ngx-dropzone';
import { MaterialModule } from '../../modules/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-image-dropzone',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MaterialModule,
  ],
  providers:[

  ],
  templateUrl: './image-dropzone.component.html',
  styleUrl: './image-dropzone.component.scss'
})
export class ImageDropzoneComponent implements OnInit, OnDestroy {

  @Input() multiple: boolean = true;
  @Input() folder!: EFolderUpload;
  @Input() urls$!: BehaviorSubject<any[]>;
  @Output() getImgs = new EventEmitter<any[]>();

  imgs: File[] = [];
  uploading = false;

  fileCtrl = new FormControl();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private uploadService: UploadService,
    private utils: UtilsService,
  ) { }

  clear() {
    this.fileCtrl.setValue(null);
  }

  async ngOnInit(): Promise<void> {

    this.urls$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async urls => {
        if (!urls.length) { return };
        this.uploading = true;
        for (let index = 0; index < urls.length; index++) {
          const url = urls[index];
          const result = await this.obterImagem(url);
          if (result?.error) {
            break;
          } else {
            this.imgs.push(result?.file)
          }
        }
        this.uploading = false;
      })


  }

  /** Para exibir no dropzone é preciso obter a imagem atraves da
   * Url = dominio/{pastaPrincipal}/{subpasta}/{filename} 
   * e transformar em um FILE
   * 
  */
  obterImagem(url: string) {
    return new Promise<any>(resolve => {
      this.uploadService.obterImagemComoFile(url).subscribe({
        next: (file) => resolve({ error: false, file }),
        error: (err) => {
          console.error(err);
          resolve({ error: true, file: undefined })
        }
      })

    })
  }


  /**
   * Seleciona as imgens do dropzone e realiza o upload
   * E envia ao componente pai as imagens caso o upload ocorrer com sucesso.  
   */
  async onSelect(event: any) {
    const images = [...event.addedFiles] ?? [];

    if (!images.length) { return }
    this.uploading = true;

    const result = await this.uploadFoto(images);
    if (result) {
      if (this.multiple) {
        this.imgs.push(...result);
      } else {
        this.imgs = [...result];
      }
    }
    this.uploading = false;
    this.getImgs.emit(this.imgs)
  }

  onRemoveDropzone(event: any) {
    this.imgs.splice(this.imgs.indexOf(event), 1);
    this.getImgs.emit(this.imgs)
  }

  /*Faz o upload das imagens em tres subpastas(small|medium|large) da PastaPrincipal e atribuiu o filename gerado pela API.
    Para visualizar, a url deve ser > dominio/{pastaPrincipal}/{subpasta}/{filename}
*/
  async uploadFoto(images: File[]) {
    return new Promise<any[] | undefined>(async resolve => {

      const newImages: File[] = [];

      for (let index = 0; index < images.length; index++) {
        const file = images[index] as File;;
        const result = await this.uploadService.uploadImg(file, this.folder);
        if (result?.status === 200) {
          const newFile = new File([file], result?.file, { type: 'image/jpeg' });
          newImages.push(newFile);
          continue
        } else {
          resolve(undefined)
          break;
        }
      }

      // const imgsRenomeadas = this.renameImages(filename, images)

      resolve(newImages)
    })

  }

  //renomeia as imagens com o name gerado pela api
  renameImages(name: string, images: File[]) {
    const newImgs = images.map(file => {
      const newFile = new File([file], name, { type: 'image/jpeg' });
      return newFile ?? file;
    });

    return newImgs;
  }

  teste(){
    console.log(this.fileCtrl.value);
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
