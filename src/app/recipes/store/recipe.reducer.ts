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

export function recipeReducer(state: State = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      // Copy the recipe we want to update and merge the new recipe from the payload
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      };

      // Copy the recipes and replace the updated recipe
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.payload)
      };
    default:
      return state;
  }
}
