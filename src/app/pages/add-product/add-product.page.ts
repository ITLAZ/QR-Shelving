import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // ✅ Importar Reactive Forms


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: false, // está bien, porque usas NgModules
})
export class AddProductPage implements OnInit {
  productForm!: FormGroup;   // ✅ Definimos el FormGroup
  qrData: string | null = null; // ✅ Definimos el valor del QR

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // ✅ Inicializamos el formulario
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required],
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      this.qrData = JSON.stringify(product);
      console.log('Producto agregado:', product);
    }
  }

  downloadQR() {
    const qrElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (qrElement) {
      const imgData = qrElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = 'producto-qr.png';
      a.click();
    } else {
      console.error('No se encontró el elemento QR para descargar.');
    }
  }
}
