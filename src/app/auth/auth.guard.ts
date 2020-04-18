import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      map(user => {
        // return !!user;
        const isAuthenticated = !!user;
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      }),
      // tap(isAuthenticated => {
      //   if (!isAuthenticated) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }
}
