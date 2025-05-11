import { Product } from "./product.model";

// shelf.model.ts
export interface Shelf {
    code: string;
    description: string;
    location: string;
    capacity: number;
    size: string;
    createdAt: string;
    qrCode: string;
    content: Product[]; // array de SKUs
    shelf: boolean;
  }
  