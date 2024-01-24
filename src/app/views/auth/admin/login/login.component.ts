import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../modules/material/material.module';
import { AuthService } from '../../../../services/auth.service';
import { StoreService } from '../../../../services/store.service';
import { userData } from '../../../../store/selectors/user.selector';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private storeService: StoreService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.storeService.select(userData).pipe(first(user => user?.id)).subscribe(() =>  this.router.navigate(['auth/admin/home']))
  }

}
