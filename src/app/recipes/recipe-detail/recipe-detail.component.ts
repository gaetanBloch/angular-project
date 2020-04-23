import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => +params.id),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes')
        }),
        map(recipesState => recipesState.recipes[this.id])
      )
      .subscribe(recipe => this.recipe = recipe);
  }

  onSendToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

  hasIngredients(): boolean {
    return this.recipe.ingredients.length > 0;
  }
}
