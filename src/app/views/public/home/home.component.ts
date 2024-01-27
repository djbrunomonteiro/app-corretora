import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../../../services/core.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  form = this.fb.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: ['']


  })

  cards = [
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
    'https://lh3.googleusercontent.com/BLUv8K8PVW-E5XPTI8MqUO_X9v_f5uzVjAVWuu-W3OOXtLneoLh2ZfCfq-yygq63kJVRMO99P_7sFniZPo2Z7FLW5nvSEixuv9bLC42R=s0',
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
  ]  
  lancamentos = [
    'https://lh3.googleusercontent.com/qINDSbuGxqeXZJB5n6X1RlfdS2HhX79OS4BrCvdtasvbvKFkoKMYpPqqXCVMpMzYevz-Z7Yra2T6v6kLD5_XSXcEvEeEapr5dhpBNNsqZQ=s0',
    'https://lh3.googleusercontent.com/BLUv8K8PVW-E5XPTI8MqUO_X9v_f5uzVjAVWuu-W3OOXtLneoLh2ZfCfq-yygq63kJVRMO99P_7sFniZPo2Z7FLW5nvSEixuv9bLC42R=s0',
  ];


  constructor(
    private fb: FormBuilder,
    public core: CoreService,
    private router: Router
  ){}

  getUrl(url: string) {
    return `url(${url})`;
  }

  search(){
    console.log('search');
    const queryParams = { categoria: this.form.value.categoria, tipo: this.form.value.tipo, termo: this.form.value.termo } as NavigationExtras
    this.router.navigate(['buscar'], {queryParams} )
    
  }


}
