import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<{ recipes: Recipe[] }> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<{ recipes: Recipe[] }> | Promise<{ recipes: Recipe[] }> | { recipes: Recipe[] } {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(RecipeActions.fetchRecipes());
          return this.actions$.pipe(ofType(RecipeActions.setRecipes), take(1));
        } else {
          return of({recipes});
        }
      })
    )
  }
}
