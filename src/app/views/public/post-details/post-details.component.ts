import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { BlogStore } from '../../../store/blog-store';
import { EMeta } from '../../../enums/meta';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { MatIconModule } from '@angular/material/icon';
import { IMenu } from '../../../models/menu';
import { MaterialModule } from '../../../modules/material/material.module';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    CommonModule,
    UrlFotosPipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent {
  blogStore = inject(BlogStore);
  post: any;

  empresaMenu: IMenu[] = [
    {
      title: 'Whatsapp',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://api.whatsapp.com/send?phone=5598970278027&text=Estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20telmamonteiro.com.br%20e%20gostaria%20de%20solicitar%20atendimento.',
      target: '_blank'
    },    
    {
      title: 'Instagram',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ==',
      target: '_blank'
    },    {
      title: 'Facebook',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.facebook.com/telma.monteiro.79?mibextid=ZbWKwL',
      target: '_blank'
    },
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) public platformId: Object,
    private core: CoreService
  ){
    effect(() => {
      this.getPost();
    })

  }

  ngOnInit(): void {
    this.getPost();
  }

  async getPost(){
    if(isPlatformBrowser(this.platformId)){
      const url = this.activatedRoute.snapshot.paramMap.get('url');
      console.log(url);
      
      if (!url) { return };
      this.post = this.blogStore.selectOne(url);
      console.log(this.post);
      
      if(!this.post){return}
      const key = this.removeHtmlTags(this.post.post);
      this.core.setTitle(`Telma Monteiro - ${this.post.titulo}`);
      this.core.updateMeta(`Telma Monteiro - ${this.post}`, `${key}`);
    }
  }

  removeHtmlTags(input: string | undefined): string {
    if(!input){return EMeta.KEY_DEFAULT}
    const regex = /<.*?>/g;
    return input.replace(regex, '');
}

}
