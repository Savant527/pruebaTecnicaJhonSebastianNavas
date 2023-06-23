import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService) {}
// Iniciar Sesión
  login(): void {
    this.authService.login(this.user.username, this.user.password);
  }
}