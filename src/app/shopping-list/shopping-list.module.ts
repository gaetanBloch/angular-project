import { NgModule } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    FormsModule,
    RouterModule,
    ShoppingListRoutingModule
  ],
  exports: [
    ShoppingListComponent,
    ShoppingEditComponent
  ]
})
export class ShoppingListModule {

}
