import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundRoutingModule } from './page-not-found-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule,
    PageNotFoundRoutingModule
  ],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {

}
