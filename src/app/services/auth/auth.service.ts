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
  constructor(private http: HttpClient, private route: Router) {}

  registerUser(email: any, name: any, password: any): Observable<any> {
    return this.http.post<User[]>(this.registerUrl, { email, name, password }).pipe(
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

  loginUser(email: any, password: any, rememberme: boolean): Observable<any> {
    return this.http.post<User[]>(this.loginUrl, { email, password }).pipe(
      switchMap((action_login: any) => {
        this.authToken = action_login[0];
        // console.log(this.authToken);  undefined (Sunucudan boş token geldiği zaman)
        if (this.authToken !== undefined) {
          const storage = rememberme ? localStorage : sessionStorage;
          storage.setItem('Authorization', JSON.stringify(this.authToken));
          console.log(
            'Giriş yapıldı, Token Alındı. Kullanılan Storage:',
            rememberme ? 'localStorage' : 'sessionStorage',
          );
          this.route.navigate(['/']);
          return of(this.authToken);
        } else {
          return this.getToken().pipe(
            switchMap((tokenData: any) => {
              if (email === tokenData[0].email && password === tokenData[0].password) {
                const { key, value, id } = tokenData[0];
                const storage = rememberme ? localStorage : sessionStorage;
                storage.setItem(tokenData[0].key, JSON.stringify(tokenData[0].value));
                console.log(
                  'Giriş yapıldı, JSON Token alındı. Kullanılan Storage:',
                  rememberme ? 'localStorage' : 'sessionStorage',
                );

                this.route.navigate(['/']);
                return of(tokenData[0].value);
              } else {
                return throwError('Kullanıcı adı veya şifre yanlış. Lütfen tekrar deneyiniz.');
              }
            }),
          );
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
    this.getToken().subscribe((logoutToken) => {
      const key = logoutToken[0].key;
      this.isLoggedToken = logoutToken[0].value;
      console.log(this.isLoggedToken);
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
      this.isLogged();
    });
  }

  isLogged(): Observable<boolean> {
    return this.getToken().pipe(
      map((token: any) => {
        return !!token;
      }),
      catchError((error) => {
        console.error('Token kontrolü hatası', error);
        return of(false);
      }),
    );
  }

  getToken(): Observable<any> {
    return this.http.get<any>(this.tokenUrl).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.error('Sunucudan token alınamadı. Hata:', error);
        return throwError('Sunucudan token alınamadı. Lütfen tekrar deneyiniz.');
      }),
    );
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

// http://localhost:3000/variable URL'den key, value ve id değerlerini alıp token oluşturuldu.
// isLogged(): boolean {
//   this.getToken().subscribe((isLoggedToken) => {
//     const key = isLoggedToken[0].key;
//     let token = localStorage.getItem(`${key}`);
//     if (!token) {
//       token = sessionStorage.getItem(`${key}`);
//     }
//     if (token) {
//       this.isLoggedToken = token;
//       console.log('Token var:', token);
//     } else {
//       console.log('Token yok. Giriş yap!');
//     }
//   });
//   return !!this.isLoggedToken;
// }

// autoLogin(): void {
//   this.getToken().pipe(
//     tap((key) => {
//       console.log(key);
//       if (localStorage.getItem(`${key}`)) {
//         this.authToken = localStorage.getItem(`${key}`);
//         this.isAuthenticated = true;
//         return;
//       }

//       const sessionStorageToken = sessionStorage.getItem(`${key}`);
//       if (sessionStorageToken) {
//         this.authToken = sessionStorageToken;
//         this.isAuthenticated = true;
//       }
//     }),
//   );
// }

// checkLoginValidator(email: any, password: any) {
//   return this.http.get(this.url + '/variable' + '?email=' + email + '&password=' + password).subscribe({
//     next: (data: any) => {
//       if (data && data.length > 0 && data[0].name) {
//         console.log(`Hoşgeldiniz ${data[0].name} JSON aracılığıyla girdiniz...`);
//       } else {
//         console.log('Kullanıcı adı veya şifre yanlış');
//         localStorage.removeItem('Authorization');
//         sessionStorage.removeItem('Authorization');
//         this.route.navigate(['/']);
//       }
//     },
//     error: (error: any) => {
//       console.log('Sunucu hatası');
//     },
//   });
// }

// loginUser(email: any, password: any, rememberme: boolean): Observable<any> {
//   return this.http.post(this.loginUrl, { email, password }).pipe(
//     tap(
//       (action_login: any) => {
//         this.authToken = action_login[0];
//         console.log(this.authToken);
//         if (action_login[0] !== undefined) {
//           if (rememberme === true) {
//             localStorage.setItem(`Authorization`, JSON.stringify(action_login[0]));
//             console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile localStorage kullanılıyor...');
//           } else {
//             sessionStorage.setItem(`Authorization`, JSON.stringify(action_login[0]));
//             console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile sessionStorage kullanılıyor...');
//           }
//           this.route.navigate(['/']);
//         } else {
//           this.getToken().subscribe((tokenData) => {
//             if (email === tokenData[0].email && password === tokenData[0].password) {
//               const { key, value, id } = tokenData[0];
//               if (rememberme === true) {
//                 sessionStorage.removeItem(`${key}`);
//                 localStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
//                 console.log("Üye olundu, Token alındı. JSON'dan gelen token ile kullanılıyor...", tokenData[0]);
//               } else {
//                 localStorage.removeItem(`${key}`);
//                 sessionStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
//               }
//               this.route.navigate(['/']);
//             } else {
//               console.error('Kullanıcı adı veya şifre yanlış!!');
//             }
//           });
//         }
//       },
//       (error) => {
//         console.error('Sunucudan yanıt gelmemektedir. Lütfen daha sonra deneyiniz. ', error);
//       },
//     ),
//   );
// }

// if (rememberme === true) {
//   localStorage.setItem(`Authorization`, JSON.stringify(action_login[0]));
//   console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile localStorage kullanılıyor...');
// } else {
//   sessionStorage.setItem(`Authorization`, JSON.stringify(action_login[0]));
//   console.log('Üye olundu, Token Alındı. Sunucudan gelen token ile sessionStorage kullanılıyor...');
// }

// if (rememberme === true) {
//   sessionStorage.removeItem(`${key}`);
//   localStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
//   console.log("Üye olundu, Token alındı. JSON'dan gelen token ile kullanılıyor...", tokenData[0]);
// } else {
//   localStorage.removeItem(`${key}`);
//   sessionStorage.setItem(`${key}`, JSON.stringify(tokenData[0].value));
// }
