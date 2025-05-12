import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Shelf } from 'src/app/models/shelf.model';
import { Product } from 'src/app/models/product.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-product-scan',
  templateUrl: './product-scan.page.html',
  styleUrls: ['./product-scan.page.scss'],
  standalone: false,
})
export class ProductScanPage {
  scannedData: string[] = [];
  currentShelf: Shelf | null = null;
  parsedProduct: Product | null = null;
  shelves: Shelf[] = [];

  constructor(
    private alertCtrl: AlertController,
    private databaseService: DatabaseService
  ) {}

  async handleScanSuccess(data: string) {
    if (!this.scannedData.includes(data)) {
      this.scannedData.push(data);

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        return this.showAlert(
          'Error',
          'El código escaneado no es un JSON válido.'
        );
      }

      if (parsed?.hasOwnProperty('capacity')) {
        // Buscar el estante por código desde Firebase
        this.currentShelf = await this.loadShelfFromFirestore(parsed.code);
        if (this.currentShelf) {
          await this.showAlert(
            'Estante escaneado',
            `Se está reponiendo el estante: ${this.currentShelf.code}`
          );
        } else {
          await this.showAlert(
            'No encontrado',
            'Este estante no está registrado.'
          );
        }
      } else if (parsed?.hasOwnProperty('sku')) {
        this.parsedProduct = parsed;
        if (this.currentShelf) {
          const added = this.addProductToShelf(parsed, this.currentShelf);
          if (added) {
            await this.showAlert(
              'Producto añadido',
              `Se añadió ${parsed.name} al estante.`
            );
            // Aquí puedes guardar la modificación si deseas
            // await this.databaseService.updateFirestoreDocument('shelves', this.currentShelf.code, this.currentShelf);
            await this.databaseService.updateFirestoreDocument(
              'shelves',
              this.currentShelf.code,
              this.currentShelf
            );
            await this.showAlert(
              'Producto añadido',
              `Se añadió ${parsed.name} al estante.`
            );
          } else {
            await this.showAlert(
              'Estante lleno',
              'No se puede añadir más productos, estante lleno.'
            );
          }
        } else {
          const shelf = this.findShelfWithProduct(parsed.sku);
          if (shelf) {
            const removed = this.removeProductFromShelf(parsed.sku, shelf);
            if (removed) {
              await this.databaseService.updateFirestoreDocument(
                'shelves',
                shelf.code,
                shelf
              );
              await this.showAlert(
                'Venta registrada',
                `Se vendió ${parsed.name}.`
              );
            } else {
              await this.showAlert('Error', 'El producto no tiene stock.');
            }
          } else {
            await this.showAlert(
              'No encontrado',
              'Este producto no está en ningún estante.'
            );
          }
        }
      } else {
        await this.showAlert(
          'Formato desconocido',
          'El QR no es ni producto ni estante.'
        );
      }
    }
  }

  async loadShelfFromFirestore(code: string): Promise<Shelf | null> {
    try {
      const doc = await this.databaseService.getFirestoreDocumentID('shelves', code);
      if (doc) {
        const shelf = doc as Shelf;
  
        // Asegurar que el campo content esté definido como array
        if (!Array.isArray(shelf.content)) {
          shelf.content = [];
        }
  
        // Evitar agregar duplicados
        const alreadyLoaded = this.shelves.find((s) => s.code === shelf.code);
        if (!alreadyLoaded) {
          this.shelves.push(shelf);
        }
  
        return shelf;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener el estante desde Firebase:', error);
      return null;
    }
  }

  addProductToShelf(product: Product, shelf: Shelf): boolean {
    if (!Array.isArray(shelf.content)) {
      shelf.content = [];
    }

    if (shelf.content.length < shelf.capacity) {
      shelf.content.push(product);
      return true;
    }
    return false;
  }

  findShelfWithProduct(sku: string): Shelf | undefined {
    return this.shelves.find(
      (shelf) =>
        Array.isArray(shelf.content) &&
        (shelf.content as Product[]).some((p: Product) => p.sku === sku)
    );
  }

  removeProductFromShelf(sku: string, shelf: Shelf): boolean {
    if (!Array.isArray(shelf.content)) return false;
    const index = shelf.content.findIndex((p: Product) => p.sku === sku);
    if (index !== -1) {
      shelf.content.splice(index, 1);
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
