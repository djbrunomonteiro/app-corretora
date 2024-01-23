import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../layout/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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
  ]


  getUrl(url: string) {
    return `url(${url})`;
  }

}
