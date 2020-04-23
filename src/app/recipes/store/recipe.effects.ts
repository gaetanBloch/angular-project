import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';

export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://angular-project-11f6f.firebaseio.com/recipes.json'
      ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            // Set the ingredients to an empty array if it is not set
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        map(recipes => new RecipeActions.SetRecipes(recipes))
      )
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {
  }
}
