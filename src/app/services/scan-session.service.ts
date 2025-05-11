// scan-session.service.ts
import { Injectable } from '@angular/core';
import { Shelf } from '../models/shelf.model';
import { DatabaseService } from './database.service';

@Injectable({ providedIn: 'root' })
export class ScanSessionService {
  private currentShelf: Shelf | null = null;
  private isReplenishing = false;

  constructor(private db: DatabaseService) {}

  async handleScan(data: any) {
    if (data.code && data.capacity) {
      // QR corresponde a un estante
      this.currentShelf = data;
      this.isReplenishing = true;
      console.log(`Reponiendo estante: ${data.code}`);
    } else if (data.sku) {
      // QR corresponde a un producto
      if (this.isReplenishing && this.currentShelf) {
        await this.addProductToShelf(data.sku);
      } else {
        await this.removeProductFromShelf(data.sku);
      }
    }
  }

  private async addProductToShelf(sku: string) {
    if (!this.currentShelf) return;

    const shelf = await this.db.getShelfByCode(this.currentShelf.code);
    if (!shelf.content.includes(sku)) {
      if (shelf.content.length < shelf.capacity) {
        shelf.content.push(sku);
        await this.db.updateShelf(shelf.code, { content: shelf.content });
        console.log(`Producto ${sku} añadido a ${shelf.code}`);
      } else {
        console.warn('Estante lleno');
      }
    } else {
      console.warn('Producto ya está en el estante');
    }
  }

  private async removeProductFromShelf(sku: string) {
    const shelf = await this.db.findShelfContainingProduct(sku);
    if (!shelf) {
      console.error(`Producto ${sku} no está en ningún estante`);
      return;
    }

    shelf.content = shelf.content.filter(p => p !== sku);
    await this.db.updateShelf(shelf.code, { content: shelf.content });
    console.log(`Producto ${sku} retirado del estante ${shelf.code}`);
  }

  resetSession() {
    this.currentShelf = null;
    this.isReplenishing = false;
  }
}
