import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-scan',
  templateUrl: './product-scan.page.html',
  styleUrls: ['./product-scan.page.scss'],
  standalone: false,
})
export class ProductScanPage {

  constructor(private alertCtrl: AlertController) {}

  parsedProduct: any = null;
  scannedData: string[] = [];

  async handleScanSuccess(data: string) {
    // Evitar duplicados exactos
    if (!this.scannedData.includes(data)) {
      this.scannedData.push(data);

      try {
        const parsed = JSON.parse(data);
        this.parsedProduct = parsed;

        const alert = await this.alertCtrl.create({
          header: 'Producto escaneado',
          message: `Nombre: ${parsed.name} \n Precio: $${parsed.price}`,
          buttons: ['OK'],
        });

        await alert.present();

        console.log('Escaneo registrado:', parsed);
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message:
            'El código escaneado no contiene un formato válido de producto.',
          buttons: ['OK'],
        });
        await alert.present();

        this.parsedProduct = null;
        console.error('QR inválido:', e);
      }
    }
  }
}
