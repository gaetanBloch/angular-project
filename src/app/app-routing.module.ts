import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module')
      .then(module => module.RecipesModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module')
      .then(module => module.ShoppingListModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(module => module.AuthModule)
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module')
      .then(module => module.PageNotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
