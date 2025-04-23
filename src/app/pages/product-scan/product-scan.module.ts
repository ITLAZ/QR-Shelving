import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductScanPageRoutingModule } from './product-scan-routing.module';

import { ProductScanPage } from './product-scan.page';

import { QrScannerModule } from 'src/app/shared/qr-scanner/qr-scanner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductScanPageRoutingModule,
    QrScannerModule
  ],
  declarations: [ProductScanPage]
})
export class ProductScanPageModule {}
