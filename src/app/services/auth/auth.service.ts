import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, tap, throwError } from 'rxjs';
import { CustomError } from '../../core/errors/custom-error';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedToken: any;
  private url = 'http://localhost:3000';
  private tokenUrl = 'http://localhost:3000/variable';
  private loginUrl = 'https://assign-api.piton.com.tr/api/rest/login';
  private registerUrl = 'https://assign-api.piton.com.tr/api/rest/register';

  constructor(private http: HttpClient, private route: Router) {}

  registerUser(email: any, name: any, password: any) {
    return this.http.post(this.registerUrl, { email, name, password }).pipe(
      tap((action_register: any) => {
        if (action_register[0] !== undefined) {
          sessionStorage.setItem(`Authorization`, JSON.stringify(action_register[0]));
          console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile kullanılıyor...');
        } else {
          this.getToken().subscribe(
            (tokenData) => {
              console.log('Üye olundu, Token Alındı. Başarılı (/variable hesabı kullanılıyor...):', tokenData[0]);
              const { key, value, id } = tokenData[0];
              console.log(key, value, id);
              sessionStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
              this.route.navigate(['/']);
            },
            (error) => {
              console.error('Kayıt Hatası, Token Alınamadı. Başarısız:', error);
            },
          );
        }
      }),
    );
  }

  loginUser(email: any, password: any, rememberme: boolean) {
    return this.http.post(this.loginUrl, { email, password }).pipe(
      tap((action_login: any) => {
        if (action_login[0] !== undefined) {
          if (rememberme === true) {
            localStorage.setItem(`Authorization`, JSON.stringify(action_login[0]));
            console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile localStorage kullanılıyor...');
          } else {
            sessionStorage.setItem(`Authorization`, JSON.stringify(action_login[0]));
            console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile sessionStorage kullanılıyor...');
          }
        } else if (action_login[0] === undefined) {
          this.getToken().subscribe(
            (tokenData) => {
              if (email === tokenData[0].email && password === tokenData[0].password) {
                const { key, value, id } = tokenData[0];
                if (rememberme === true) {
                  sessionStorage.removeItem(`${key}`);
                  localStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
                  console.log("Üye olundu, Token alındı. JSON'dan gelen token ile kullanılıyor...", tokenData[0]);
                } else {
                  localStorage.removeItem(`${key}`);
                  sessionStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
                }
                this.route.navigate(['/']);
              } else {
                console.log('Kullanıcı adı veya şifre yanlış!!');
              }
            },
            (error) => {
              console.error('Token Alınamadı, Başarısız:', error);
              return of(null);
            },
          );
        }
      }),
    );
  }

  checkLoginValidator(email: any, password: any) {
    return this.http.get(this.url + '/variable' + '?email=' + email + '&password=' + password).subscribe({
      next: (data: any) => {
        if (data && data.length > 0 && data[0].name) {
          console.log(`Hoşgeldiniz ${data[0].name} JSON aracılığıyla girdiniz...`);
        } else {
          console.log('Kullanıcı adı veya şifre yanlış');
          localStorage.removeItem('Authorization');
          sessionStorage.removeItem('Authorization');
          this.route.navigate(['/']);
        }
      },
      error: (error: any) => {
        console.log('Sunucu hatası');
      },
    });
  }

  // http://localhost:3000/variable URL'den key, value ve id değerlerini alıp token oluşturuldu.

  isLogged(): boolean {
    this.getToken().subscribe((isLoggedToken) => {
      const key = isLoggedToken[0].key;
      let token = localStorage.getItem(`${key}`);
      if (!token) {
        token = sessionStorage.getItem(`${key}`);
      }
      if (token) {
        this.isLoggedToken = token;
        console.log('Token var:', token);
      } else {
        console.log('Token yok. Giriş yap!');
      }
    });
    return !!this.isLoggedToken;
  }

  logout(): void {
    this.getToken().subscribe((logoutToken) => {
      const key = logoutToken[0].key;
      localStorage.removeItem(`${key}`);
      if (typeof Storage !== 'undefined') {
        if (localStorage.getItem(`${key}`)) {
          localStorage.removeItem(`${key}`);
          console.log('localStorageden token kaldırıldı.');
          this.route.navigate(['/']);
        } else if (sessionStorage.getItem(`${key}`)) {
          sessionStorage.removeItem(`${key}`);
          console.log('sessionStorageden token kaldırıldı.');
          this.route.navigate(['/']);
        }
      } else {
        console.log('Zaten token yok çıkış yapılamaz.');
      }
    });
  }

  getToken(): Observable<any> {
    return this.http.get<any>(this.tokenUrl);
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
}
