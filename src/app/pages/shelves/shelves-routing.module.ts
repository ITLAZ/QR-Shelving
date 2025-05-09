import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShelvesPage } from './shelves.page';

const routes: Routes = [
  {
    path: '',
    component: ShelvesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelvesPageRoutingModule {}
