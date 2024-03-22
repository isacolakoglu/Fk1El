import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLogged()) {
      if (state.url.includes('/auth')) {
        return this.router.createUrlTree(['/']);
      }
      return true;
    } else {
      if (state.url === '/') {
        return this.router.createUrlTree(['/auth']);
      }
      return true;
    }
  }
}

/*


if (this.authService.isLogged()) {
      return true;
    } else {
      return this.router.createUrlTree(['/auth']);
    }

    */
