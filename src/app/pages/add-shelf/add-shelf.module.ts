import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddShelfPageRoutingModule } from './add-shelf-routing.module';

import { AddShelfPage } from './add-shelf.page';

import { QRCodeComponent } from 'angularx-qrcode'; // ✅ Importar el componente QRCode

import { ReactiveFormsModule } from '@angular/forms'; // ✅ Importar Reactive Forms

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddShelfPageRoutingModule,
    QRCodeComponent, // ✅ Añadir el componente QRCode a los imports
    ReactiveFormsModule // ✅ Añadir Reactive Forms a los imports
  ],
  declarations: [AddShelfPage]
})
export class AddShelfPageModule {}
