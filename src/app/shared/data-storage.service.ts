import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    // Manage the subscription , get the latest user and unsubscribe
    this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.put<Recipe[]>(
          'https://angular-project-11f6f.firebaseio.com/recipes.json',
          recipes,
          {params: new HttpParams().set('auth', user.token)}
        );
      })).subscribe(response => {
      // Should log the recipes
      console.log(response);
    });
  }

  fetchRecipes(): Observable<Recipe[]> {
    // Manage the subscription , get the latest user and unsubscribe
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(
          'https://angular-project-11f6f.firebaseio.com/recipes.json',
          {params: new HttpParams().set('auth', user.token)}
        );
      }),
      map(recipes => {
        return recipes.map(recipe => {
          // Set the ingredients to an empty array if it is not set
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}
