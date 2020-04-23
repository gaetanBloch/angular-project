import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] Set Recipes'

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(payload: Recipe[]) {
  }
}

export type RecipeActions = SetRecipes;
