import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ingredient } from '../shared/ingredient.model';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  hasIngredients(): Observable<fromShoppingList.State> {
    return this.store.select('shoppingList');
  }
}
