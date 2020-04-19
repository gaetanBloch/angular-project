import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';

const appRoutes: Routes = [
  {path: 'shopping-list', component: ShoppingListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {

}
