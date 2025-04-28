import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductPageRoutingModule } from './add-product-routing.module';

import { AddProductPage } from './add-product.page';

import { QRCodeComponent } from 'angularx-qrcode'; // ✅ Importar el componente QRCode

import { ReactiveFormsModule } from '@angular/forms'; // ✅ Importar Reactive Forms

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProductPageRoutingModule,
    QRCodeComponent, // ✅ Añadir el componente QRCode a los imports
    ReactiveFormsModule // ✅ Añadir Reactive Forms a los imports
  ],
  declarations: [AddProductPage]
})
export class AddProductPageModule {}
