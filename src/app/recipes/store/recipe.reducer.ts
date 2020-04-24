import { Action, createReducer, on } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions'

// const recipes: Recipe[] = [
//   new Recipe(
//     'Tasty Schnitzel',
//     'A super-tasty Schnitzel - Just awesome',
//     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
//     [
//       new Ingredient('Chicken', 1),
//       new Ingredient('Lemon', 2),
//       new Ingredient('French Fries', 20)
//     ]
//   ),
//   new Recipe(
//     'Big Fat Burger',
//     'What else do you need to say?',
//     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
//     [
//       new Ingredient('Buns', 2),
//       new Ingredient('Salad', 1),
//       new Ingredient('Cheddar', 2),
//       new Ingredient('Patty', 1)
//     ]
//   )
// ];

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(recipeState: State | undefined, recipeAction: Action) {
  return createReducer(
    initialState,
    on(RecipeActions.setRecipes, (state, action) => ({
      ...state,
      recipes: [...action.recipes]
    })),
    on(RecipeActions.addRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.concat({...action.recipe})
    })),
    on(RecipeActions.updateRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.map((recipe, index) =>
        index === action.index ? {...action.recipe} : recipe
      )
    })),
    on(RecipeActions.deleteRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.filter((recipe, index) => index !== action.index)
    }))
  )(recipeState, recipeAction);
}
