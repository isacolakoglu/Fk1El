import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { CustomError } from '../../core/errors/custom-error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenUrl = 'http://localhost:3000/variable';
  private loginUrl = 'https://assign-api.piton.com.tr/api/rest/login';
  private registerUrl = 'https://assign-api.piton.com.tr/api/rest/register';

  constructor(private http: HttpClient) {}

  registerUser(email: any, name: any, password: any) {
    return this.http.post(this.registerUrl, { email, name, password });
  }

  loginUser(email: any, password: any) {
    return this.http.post(this.loginUrl, { email, password });
  }

  getToken(): Observable<any> {
    let token;
    return this.http.get<any>(this.tokenUrl).pipe(
      tap((data) => {
        token = data[0];
      }),
    );
  }

  storeToken(token: any) {
    localStorage.setItem('Authorization', token);
    console.log('Beni Hatırla Tuşuna Basıldığında Kalıcı Token:', token);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('Authorization');
  }

  logout(): void {
    localStorage.removeItem('Authorization');
  }

  errorStatus(statusCode: number) {
    let errorMessage = '';
    switch (statusCode) {
      case 404:
        errorMessage: 'Kullanıcı bulunamadı. Lütfen önce kayıt olun.';
        break;
      case 401:
        errorMessage: 'Giriş hatası! Lütfen tekrar deneyin.';
        break;
      default:
    }
    const error = new CustomError(errorMessage, statusCode);
    return throwError(error);
  }

  // autoLogin() {
  //   const token = this.getToken();
  //   console.log(token);
  //   if (localStorage.getItem('Authorization') == null) {
  //     return;
  //   }
  //   const user = JSON.parse(localStorage.getItem('Authorization') || '{}');
  //   console.log('user_autoLogin', user);
  // }
}
