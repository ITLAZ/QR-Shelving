import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShelveScanPage } from './shelve-scan.page';

const routes: Routes = [
  {
    path: '',
    component: ShelveScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelveScanPageRoutingModule {}
