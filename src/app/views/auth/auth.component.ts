import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { EGroup, EAction } from '../../store/app.actions';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {

  constructor(
    private storeService: StoreService
  ){}

  ngOnInit(): void {
    this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
  }

}
