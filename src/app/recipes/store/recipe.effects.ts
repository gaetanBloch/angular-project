import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeEffects {

  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://angular-project-11f6f.firebaseio.com/recipes.json'
        ).pipe(
          map(recipes => {
            if (recipes) {
              return recipes.map(recipe => {
                // Set the ingredients to an empty array if it is not set
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
              });
            } else {
              return [];
            }
          }),
          map(recipes => RecipeActions.setRecipes({recipes}))
        )
      })
    )
  );

  storeRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.storeRecipes),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put<Recipe[]>(
          'https://angular-project-11f6f.firebaseio.com/recipes.json',
          recipesState.recipes
        );
      })
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {
  }
}
