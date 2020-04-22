import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Manage the subscription, get the latest user and unsubscribe
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const newRequest = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(newRequest);
      })
    );
  }
}
