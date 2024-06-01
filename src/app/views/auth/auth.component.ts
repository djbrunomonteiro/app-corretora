import { Component, OnInit, inject } from '@angular/core';
import { AnunciosStore } from '../../store/anuncios-store';
import { LeadsStore } from '../../store/leads-store';
import { ClientesStore } from '../../store/cliente-store';
import { UserStore } from '../../store/user-store';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {

  userStore = inject(UserStore)
  anuncioStore = inject(AnunciosStore);
  leadStore = inject(LeadsStore);
  clienteStore = inject(ClientesStore);

  ngOnInit(): void {
    this.anuncioStore.loadAll();
    if(this.userStore.user()){
      this.leadStore.loadAll();
      this.clienteStore.loadAll();
    }


  }

}
