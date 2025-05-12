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
    try {
      if (data.code && data.capacity) {
        // Estante escaneado
        this.currentShelf = {
          code: data.code,
          description: data.description || `Estante ${data.code}`,
          location: data.location || 'Ubicación desconocida',
          capacity: data.capacity,
          size: data.size || 'Tamaño desconocido',
          createdAt: data.createdAt || new Date().toISOString(),
          qrCode: data.qrCode || '',
          content: [],
          shelf: data.shelf,
        };
        this.isReplenishing = true;
        console.log(`Reponiendo estante: ${data.code}`);
      } else if (data.sku) {
        // Producto escaneado
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
          shelf: this.isReplenishing,
        };

        if (this.isReplenishing && this.currentShelf) {
          await this.addProductToShelf(product);
        } else {
          await this.removeProductFromShelf(product);
        }
      }
    } catch (error) {
      console.error('Error al procesar escaneo:', error);
    }
  }

  private async addProductToShelf(product: Product) {
    if (!this.currentShelf) {
      console.warn('No hay un estante seleccionado actualmente.');
      return;
    }

    const shelf = await this.db.getShelfByCode(this.currentShelf.code);

    if (!shelf) {
      console.error(
        `No se encontró el estante con código ${this.currentShelf.code}`
      );
      return;
    }

    if (!Array.isArray(shelf.content)) {
      shelf.content = [];
    }

    const alreadyExists = shelf.content.some((p) => p.sku === product.sku);
    if (alreadyExists) {
      console.warn(`El producto ${product.sku} ya está en el estante.`);
      return;
    }

    if (shelf.content.length < shelf.capacity) {
      shelf.content.push(product);
      await this.db.updateShelf(shelf.code, { content: Array.isArray(shelf.content) ? shelf.content : [] });
      console.log(`Producto ${product.sku} añadido al estante ${shelf.code}`);
      console.log('Contenido actual del estante:', shelf.content);
    } else {
      console.warn(`El estante ${shelf.code} está lleno.`);
    }
  }

  private async removeProductFromShelf(product: Product) {
    const shelf = await this.db.findShelfContainingProduct(product.sku);
    if (!shelf) {
      console.error(`Producto ${product.sku} no está en ningún estante`);
      return;
    }

    shelf.content = shelf.content.filter((p) => p.sku !== product.sku);
    await this.db.updateShelf(shelf.code, { content: Array.isArray(shelf.content) ? shelf.content : [] });
    console.log(`Producto ${product.sku} retirado del estante ${shelf.code}`);
  }

  resetSession() {
    this.currentShelf = null;
    this.isReplenishing = false;
  }
}
