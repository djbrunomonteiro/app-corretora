import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../modules/material/material.module';

@Component({
  selector: 'app-search-home',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule],
  templateUrl: './search-home.component.html',
  styleUrl: './search-home.component.scss'
})
export class SearchHomeComponent {

  form = this.fb.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: ['']
  })

  constructor(
    private fb: FormBuilder,
    public core: CoreService,
    private router: Router,
  ){}

  search(){
    const queryParams = { categoria: this.form.value.categoria, tipo: this.form.value.tipo, termo: this.form.value.termo } as NavigationExtras
    this.router.navigate(['buscar'], {queryParams} )
  }


}
