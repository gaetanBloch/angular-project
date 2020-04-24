import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSubscription: Subscription;


  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData(): void {
    this.store.dispatch(RecipeActions.storeRecipes());
  }

  onFetchData(): void {
    this.store.dispatch(RecipeActions.fetchRecipes())
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
