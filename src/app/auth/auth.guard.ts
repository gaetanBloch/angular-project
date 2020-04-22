import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Manage the subscription, get the latest user and unsubscribe
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        const isAuthenticated = !!user;
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
