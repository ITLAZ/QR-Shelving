import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddShelfPage } from './add-shelf.page';

const routes: Routes = [
  {
    path: '',
    component: AddShelfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddShelfPageRoutingModule {}
