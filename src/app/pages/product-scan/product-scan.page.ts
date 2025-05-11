import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Shelf } from 'src/app/models/shelf.model';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-scan',
  templateUrl: './product-scan.page.html',
  styleUrls: ['./product-scan.page.scss'],
  standalone: false,
})
export class ProductScanPage {
  scannedData: string[] = [];
  currentShelf: any = null; // Estante en contexto (si se escanea primero)
  parsedProduct: any = null; // Último producto escaneado y procesado

  shelves: Shelf[] = []; // Lista de estantes usando el modelo Shelf

  constructor(private alertCtrl: AlertController) {}

  async handleScanSuccess(data: string) {
    if (!this.scannedData.includes(data)) {
      this.scannedData.push(data);

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        return this.showAlert('Error', 'El código escaneado no es un JSON válido.');
      }

      if (parsed?.hasOwnProperty('capacity')) {
        // Es un estante
        this.currentShelf = this.getOrCreateShelf(parsed);
        this.parsedProduct = parsed;
        await this.showAlert(
          'Estante escaneado',
          `Se está reponiendo el estante: ${this.currentShelf.name}`
        );
      } else if (parsed?.hasOwnProperty('sku')) {
        this.parsedProduct = parsed;
        // Es un producto
        if (this.currentShelf) {
          const added = this.addProductToShelf(parsed, this.currentShelf);
          if (added) {
            await this.showAlert('Producto añadido', `Se añadió ${parsed.name} al estante.`);
          } else {
            await this.showAlert(
              'Estante lleno',
              'No se puede añadir más productos, estante lleno.'
            );
          }
        } else {
          // Venta: buscar en todos los estantes
          const shelf = this.findShelfWithProduct(parsed.sku);
          if (shelf) {
            const removed = this.removeProductFromShelf(parsed.sku, shelf);
            if (removed) {
              await this.showAlert('Venta registrada', `Se vendió ${parsed.name}.`);
            } else {
              await this.showAlert('Error', 'El producto no tiene stock.');
            }
          } else {
            await this.showAlert('No encontrado', 'Este producto no está en ningún estante.');
          }
        }
      } else {
        await this.showAlert('Formato desconocido', 'El QR no es ni producto ni estante.');
      }
    }
  }

  getOrCreateShelf(parsedShelf: any) {
    let shelf = this.shelves.find((s) => s.code === parsedShelf.id);
    if (!shelf) {
      shelf = { ...parsedShelf, content: [] as Product[] };
      if (shelf) {
        this.shelves.push(shelf);
      }
    }
    return shelf;
  }

  addProductToShelf(product: any, shelf: any): boolean {
    if (shelf.content.length < shelf.capacity) {
      shelf.content.push(product);
      return true;
    }
    return false;
  }

  findShelfWithProduct(sku: string) {
    // Asegúrate de que 'products' sea de tipo Product[]
    const products: Product[] = []; // Tu lista de productos

    // Filtrar o buscar usando tu función
    const result = products.find((p: Product) => p.sku === sku);
    return this.shelves.find((shelf) =>
      Array.isArray(shelf.content) && (shelf.content as unknown[]).every(item => item && typeof item === 'object' && 'sku' in item) &&
      Array.isArray(shelf.content) &&
      shelf.content.every(item => typeof item === 'object' && 'sku' in item) &&
      (shelf.content as Product[]).some((p: Product) => p.sku === sku)
    );
  }

  removeProductFromShelf(sku: string, shelf: any): boolean {
    const index = shelf.content.findIndex((p: { sku: string; name: string }) => p.sku === sku);
    if (index !== -1) {
      shelf.content.splice(index, 1); // Fixed the property name here
      return true;
    }
    return false;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
