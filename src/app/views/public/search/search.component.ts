import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  constructor(
    private fb: FormBuilder,
    public core: CoreService,
    private router: Router
  ){}

}
