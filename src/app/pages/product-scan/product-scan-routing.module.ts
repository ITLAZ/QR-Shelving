import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductScanPage } from './product-scan.page';

const routes: Routes = [
  {
    path: '',
    component: ProductScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductScanPageRoutingModule {}
