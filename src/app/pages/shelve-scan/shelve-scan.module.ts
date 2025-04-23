import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShelveScanPageRoutingModule } from './shelve-scan-routing.module';

import { ShelveScanPage } from './shelve-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShelveScanPageRoutingModule
  ],
  declarations: [ShelveScanPage]
})
export class ShelveScanPageModule {}
