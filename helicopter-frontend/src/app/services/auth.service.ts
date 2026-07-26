import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Django Login API (use relative paths to avoid mixed-content in HTTPS)
  private apiUrl = '/api/login/';

  constructor(private http: HttpClient) {}

  // Login
  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  // Logout
  logout(): void {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
  }

  // Get Access Token
  getToken(): string | null {
    return sessionStorage.getItem('access');
  }

  // Check Login Status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getProfile() {
    return this.http.get('/api/profile/');
  }

  register(user: any) {
  return this.http.post(
    'http://127.0.0.1:8000/api/register/',
    user
  );
}
}



