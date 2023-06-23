import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
  }
}
