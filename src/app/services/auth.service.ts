import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin';

  constructor(private router: Router) {}
  
// Iniciar Sesión
  login(username: string, password: string): boolean {
    const loggedIn = username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD;
    if (loggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      console.error('Error de autenticación');
    }
    this.loggedIn = loggedIn;
    localStorage.setItem('loggedIn', this.loggedIn.toString());
    return loggedIn;
  }

// Cerrar sesión
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }

}
