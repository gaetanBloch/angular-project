import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: false}) shoppingForm: NgForm;
  subscription: Subscription;
  editMode = false;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editIndex > -1) {
        this.editMode = true;
        this.shoppingForm.setValue({
          name: stateData.ingredients[stateData.editIndex].name,
          amount: stateData.ingredients[stateData.editIndex].amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onAddOrUpdateItem(form: NgForm): void {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.updateIngredient({ingredient}));
    } else {
      this.store.dispatch(ShoppingListActions.addIngredient({ingredient}));
    }
    this.resetForm();
  }

  onClear(): void {
    this.resetForm();
  }

  onDelete(): void {
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.resetForm();
  }

  private resetForm(): void {
    this.editMode = false;
    this.shoppingForm.reset();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
