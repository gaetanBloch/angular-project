import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ShoppingListService } from '../shopping-list.service';
import { Ingredient } from '../../shared/ingredient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: false}) shoppingForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.shoppingForm.setValue({
          name: this.shoppingListService.getIngredient(index).name,
          amount: this.shoppingListService.getIngredient(index).amount
        });
      }
    );
  }

  onAddOrUpdateItem(form: NgForm): void {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.editMode = false;
    this.resetForm();
  }

  onClear(): void {
    this.resetForm();
  }

  /**
   * Reset the form
   */
  private resetForm(): void {
    this.shoppingForm.reset({
      name: '',
      amount: ''
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
