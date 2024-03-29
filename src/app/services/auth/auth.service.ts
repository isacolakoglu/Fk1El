import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, pipe, tap, throwError } from 'rxjs';
import { CustomError } from '../../core/errors/custom-error';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedToken: any;
  private authToken: string | null = null;
  private url = 'http://localhost:3000';
  private tokenUrl = 'http://localhost:3000/variable';
  private loginUrl = 'https://assign-api.piton.com.tr/api/rest/login';
  private registerUrl = 'https://assign-api.piton.com.tr/api/rest/register';

  user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient, private route: Router) {
    this.authToken = this.getAuthToken();
  }

  registerUser(email: any, name: any, password: any): Observable<any> {
    return this.http.post<User[]>(this.registerUrl, { email, name, password }).pipe(
      tap((action_register: any) => {
        console.log(action_register.action_register.token);
        const registerToken = action_register.action_register.token;
        this.saveAuthToken(registerToken);
        sessionStorage.setItem(`Authorization`, JSON.stringify(registerToken));
        console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile kullanılıyor...');
        return registerToken;
      }),
    );
  }

  loginUser(email: any, password: any, rememberme: boolean): Observable<any> {
    return this.http.post<User[]>(this.loginUrl, { email, password }).pipe(
      switchMap((action_login: any) => {
        console.log(action_login.action_login.token);
        const loginToken = action_login.action_login.token;
        this.saveAuthToken(loginToken);
        if (loginToken) {
          const storage = rememberme ? localStorage : sessionStorage;
          storage.setItem('Authorization', JSON.stringify(loginToken));
          console.log('Giriş yapıldı, Token Alındı. Kullanılan Storage:', rememberme ? 'localStorage' : 'sessionStorage');
          return loginToken;
        } else {
          console.error('Böyle bir hesap yok YADA Kullanıcı adı veya şifre yanlış.');
        }
      }),
      catchError((error) => {
        // HTTP isteği hatası
        // console.error('HTTP İsteği Başarısız:', error);
        console.error('HTTP İsteği Başarısız. Lütfen tekrar deneyiniz.');
        return throwError(error);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('Authorization');
    sessionStorage.removeItem('Authorization');
  }

  isLogged(): Observable<boolean> {
    const authToken = this.getAuthToken();
    return of(!!authToken);
  }

  saveAuthToken(token: string): void {
    this.authToken = token;
  }

  private getAuthToken(): string | null {
    const localStorageToken = localStorage.getItem('Authorization');
    const sessionStorageToken = sessionStorage.getItem('Authorization');

    if (localStorageToken !== null) {
      return localStorageToken;
    }
    if (sessionStorageToken !== null) {
      return sessionStorageToken;
    }
    return null;
  }

  // logout(): void {
  //   this.getToken().subscribe((logoutToken) => {
  //     const key = logoutToken[0].key;
  //     this.isLoggedToken = logoutToken[0].value;
  //     console.log(this.isLoggedToken);
  //     localStorage.removeItem(`${key}`);
  //     if (typeof Storage !== 'undefined') {
  //       if (localStorage.getItem(`${key}`)) {
  //         localStorage.removeItem(`${key}`);
  //         console.log('localStorageden token kaldırıldı.');
  //         this.route.navigate(['/']);
  //       } else if (sessionStorage.getItem(`${key}`)) {
  //         sessionStorage.removeItem(`${key}`);
  //         console.log('sessionStorageden token kaldırıldı.');
  //         this.route.navigate(['/']);
  //       }
  //     } else {
  //       console.log('Zaten token yok çıkış yapılamaz.');
  //     }
  //     this.isLogged();
  //   });
  // }

  // isLogged(): Observable<boolean> {
  //   return this.getToken().pipe(
  //     map((token: any) => {
  //       console.log(token);
  //       return !!token;
  //     }),
  //     catchError((error) => {
  //       console.error('Token kontrolü hatası', error);
  //       return of(false);
  //     }),
  //   );
  // }

  // getToken(): Observable<any> {
  //   return this.http.get<any>(this.tokenUrl).pipe(
  //     map((response: any) => {
  //       return response;
  //     }),
  //     catchError((error) => {
  //       console.error('Sunucudan token alınamadı. Hata:', error);
  //       return throwError('Sunucudan token alınamadı. Lütfen tekrar deneyiniz.');
  //     }),
  //   );
  // }

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
}
