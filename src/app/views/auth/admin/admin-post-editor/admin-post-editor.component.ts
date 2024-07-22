import { CommonModule } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../../pipes/url-fotos.pipe';
import { AnunciosStore } from '../../../../store/anuncios-store';
import { UtilsService } from '../../../../services/utils.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { UploadService } from '../../../../services/upload.service';
import { BlogStore } from '../../../../store/blog-store';
import { IPost } from '../../../../models/post';

@Component({
  selector: 'app-admin-post-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    UrlFotosPipe,
    NgxEditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-post-editor.component.html',
  styleUrl: './admin-post-editor.component.scss'
})
export class AdminPostEditorComponent implements OnInit, AfterViewInit {

  blogStore = inject(BlogStore);
  formBuilder = inject(FormBuilder);
  utils = inject(UtilsService);
  uploadService = inject(UploadService);

  form = this.formBuilder.group({
    id: [''],
    titulo: ['', [Validators.required]],
    fotoInput: [''],
    foto: [''],
    post: [''],
    url: [''],
    created_at: ['']
  });
  ctrlFotoInput = this.form.get('fotoInput') as FormControl;
  ctrlFoto = this.form.get('foto') as FormControl;

  editor!: Editor;
  html = '';
  loadingSave = false;
  loadingUpload = false;

  foto$= new BehaviorSubject<string>('');

  constructor(
    public dialogRef: MatDialogRef<AdminPostEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}



  ngOnInit(){

    this.editor = new Editor();

    if(this.data){
      this.form.patchValue({...this.data});
      if(!this.ctrlFoto.value){return}
      this.getFoto(this.ctrlFoto.value) 
    }
  }

  ngAfterViewInit(): void {
    this.ctrlFotoInput.valueChanges.subscribe(async c => {
      if(!c){return}
      await this.upload(c)
    })
  }


  async salvar(){
    this.loadingSave = true;
    const item = {...this.form.value, post: this.html, url: this.createUrl()} as any;
    delete item.fotoInput;
    const response = await this.blogStore.saveOne(item);
    this.loadingSave = false;
    const {error, message, results} = response;
    this.utils.showMessage(message);
    if(error){return};
    this.dialogRef.close();
  }

  createUrl(){
    const titulo = String(this.form.value.titulo).toLocaleLowerCase();
    let result = `blog/post/${titulo}`;
    result = result.replace(/[áàãâäéèêëíìîïóòõôöúùûü]/g, (match) => {
      switch (match) {
        case "á": return "a";
        case "à": return "a";
        case "ã": return "a";
        case "â": return "a";
        case "ä": return "a";
        case "é": return "e";
        case "è": return "e";
        case "ê": return "e";
        case "ë": return "e";
        case "í": return "i";
        case "ì": return "i";
        case "î": return "i";
        case "ï": return "i";
        case "ó": return "o";
        case "ò": return "o";
        case "õ": return "o";
        case "ô": return "o";
        case "ö": return "o";
        case "ú": return "u";
        case "ù": return "u";
        case "û": return "u";
        case "ü": return "u";
        default: return match;
      }
    }).replace(/\s+/g, '-');

    return result;

  }

  async getFoto(item: string){
    this.loadingUpload = true;
    const fullPath = await this.uploadService.getFoto(item, 'anuncios');
    this.loadingUpload = false;
    this.foto$.next(fullPath);
  }

  async upload(file: File){
    this.loadingUpload = true;
    const res = await this.uploadService.uploadIMG(file);
    const fullPath = await this.uploadService.getFoto(res, 'anuncios');
    this.ctrlFoto.setValue(res)
    this.foto$.next(fullPath);
    this.loadingUpload = false;
  }

}
