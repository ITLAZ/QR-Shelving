import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: false,
})
export class AddProductPage implements OnInit {
  productForm!: FormGroup;
  qrData: string | null = null;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      expires: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      lot: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]],
    });
  }

  async addProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      this.qrData = JSON.stringify(product);

      setTimeout(async () => {
        const qrElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;

        if (qrElement) {
          const qrBase64 = qrElement.toDataURL('image/png');
          const now = new Date();

          const productWithQR = {
            ...product,
            qrCode: qrBase64,
            createdAt: now.toISOString(),
          };

          try {
            await this.databaseService.addFirestoreDocument('products', productWithQR);
            console.log('Producto guardado en Firebase:', productWithQR);

            const alert = await this.alertController.create({
              header: 'Éxito',
              message: 'Producto agregado y guardado correctamente.',
              buttons: ['OK']
            });
            await alert.present();
          } catch (error) {
            console.error('Error al guardar el producto en Firebase:', error);
          }
        } else {
          console.error('No se pudo obtener el QR para guardar.');
        }
      }, 500);
    }
  }

  downloadQR() {
    const qrElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;

    if (qrElement && this.productForm.value.name) {
      const imgData = qrElement.toDataURL('image/png');

      const productName = this.productForm.value.name.replace(/\s+/g, '_');
      const now = new Date();
      const formattedDate = now.toLocaleDateString('es-ES').replace(/\//g, '-');
      const fileName = `${productName}-${formattedDate}.png`;

      const a = document.createElement('a');
      a.href = imgData;
      a.download = fileName;
      a.click();
    } else {
      console.error('No se encontró el elemento QR para descargar o el nombre del producto no está definido.');
    }
  }
}
