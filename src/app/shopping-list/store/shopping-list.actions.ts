import { createAction, props } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{ ingredient: Ingredient }>()
);
export const addIngredients = createAction(
  '[Shopping List] Add Ingredients',
  props<{ ingredients: Ingredient[] }>()
);
export const updateIngredient = createAction(
  '[Shopping List] Update Ingredient',
  props<{ ingredient: Ingredient }>()
);
export const deleteIngredient = createAction(
  '[Shopping List] Delete Ingredient'
);
export const startEdit = createAction(
  '[Shopping List] Start Edit',
  props<{ index: number }>()
);
export const stopEdit = createAction(
  '[Shopping List] Stop Edit'
);
