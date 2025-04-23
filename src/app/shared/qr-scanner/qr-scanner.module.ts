import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { IonicModule } from '@ionic/angular';

import { QrReaderComponent } from './components/qr-reader/qr-reader.component';

@NgModule({
  declarations: [QrReaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    ZXingScannerModule
  ],
  exports: [QrReaderComponent]  // Para poder usarlo en otros módulos
})
export class QrScannerModule {}
