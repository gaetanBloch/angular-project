import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {
  }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put<Recipe[]>(
      'https://angular-project-11f6f.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      console.log(recipes);
    });
  }
}
