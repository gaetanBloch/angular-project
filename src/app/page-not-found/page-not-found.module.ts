import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundRoutingModule } from './page-not-found-routing.module';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [RouterModule, PageNotFoundRoutingModule],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {

}
