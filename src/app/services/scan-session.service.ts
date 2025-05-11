import { Injectable } from '@angular/core';
import { Shelf } from '../models/shelf.model';
import { Product } from '../models/product.model';
import { DatabaseService } from './database.service';

@Injectable({ providedIn: 'root' })
export class ScanSessionService {
  private currentShelf: Shelf | null = null;
  private isReplenishing = false;

  constructor(private db: DatabaseService) {}

  async handleScan(data: any) {
    if (data.code && data.capacity) {
      // QR corresponde a un estante
      this.currentShelf = {
        code: data.code,
        description: data.description || `Estante ${data.code}`,
        location: data.location || 'Ubicación desconocida',
        capacity: data.capacity,
        size: data.size || 'Tamaño desconocido',
        createdAt: data.createdAt || new Date().toISOString(),
        qrCode: data.qrCode || '',
        content: [],
        shelf: data.shelf // Inicializamos vacío, luego se sincroniza con la base de datos
      };
      this.isReplenishing = true;
      console.log(`Reponiendo estante: ${data.code}`);
    } else if (data.sku) {
      // QR corresponde a un producto
      const product: Product = {
        sku: data.sku,
        name: data.name || 'Producto sin nombre',
        cost: data.cost || 0,
        createdAt: data.createdAt || new Date().toISOString(),
        expires: data.expires || '',
        lot: data.lot || 'Lote desconocido',
        price: data.price || 0,
        qrCode: data.qrCode || '',
        quantity: data.quantity || 1,
        shelf: this.isReplenishing
      };

      if (this.isReplenishing && this.currentShelf) {
        await this.addProductToShelf(product);
      } else {
        await this.removeProductFromShelf(product);
      }
    }
  }

  private async addProductToShelf(product: Product) {
    if (!this.currentShelf) return;

    const shelf = await this.db.getShelfByCode(this.currentShelf.code);

    const alreadyExists = shelf.content.some(p => p.sku === product.sku);
    if (!alreadyExists) {
      if (shelf.content.length < shelf.capacity) {
        shelf.content.push(product);
        await this.db.updateShelf(shelf.code, { content: shelf.content });
        console.log(`Producto ${product.sku} añadido a ${shelf.code}`);
      } else {
        console.warn('Estante lleno');
      }
    } else {
      console.warn('Producto ya está en el estante');
    }
  }

  private async removeProductFromShelf(product: Product) {
    const shelf = await this.db.findShelfContainingProduct(product.sku);
    if (!shelf) {
      console.error(`Producto ${product.sku} no está en ningún estante`);
      return;
    }

    shelf.content = shelf.content.filter(p => p.sku !== product.sku);
    await this.db.updateShelf(shelf.code, { content: shelf.content });
    console.log(`Producto ${product.sku} retirado del estante ${shelf.code}`);
  }

  resetSession() {
    this.currentShelf = null;
    this.isReplenishing = false;
  }
}
