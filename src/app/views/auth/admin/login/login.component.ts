import { Component } from '@angular/core';
import { MaterialModule } from '../../../../modules/material/material.module';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AdminLoginComponent {
  constructor(
    public authService: AuthService
  ){}

}
