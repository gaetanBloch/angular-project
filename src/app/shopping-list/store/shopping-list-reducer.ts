import { Action, createReducer, on } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editIndex: -1
};

export function shoppingListReducer(shoppingListState: State | undefined,
                                    shoppingListAction: Action) {
  return createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, action) => ({
      ...state,
      ingredients: state.ingredients.concat(action.ingredient)
    })),
    on(ShoppingListActions.addIngredients, (state, action) => ({
      ...state,
      ingredients: state.ingredients.concat(...action.ingredients)
    })),
    on(ShoppingListActions.updateIngredient, (state, action) => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.map((ingredient, index) =>
        index === state.editIndex ? {...action.ingredient} : ingredient
      )
    })),
    on(ShoppingListActions.deleteIngredient, state => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.filter((ig, index) => index !== state.editIndex)
    })),
    on(ShoppingListActions.startEdit, (state, action) => ({
      ...state,
      editIndex: action.index,
    })),
    on(ShoppingListActions.stopEdit, state => ({
      ...state,
      editIndex: -1,
    }))
  )(shoppingListState, shoppingListAction)
}
