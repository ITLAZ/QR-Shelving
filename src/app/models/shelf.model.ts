// shelf.model.ts
export interface Shelf {
    code: string;
    description: string;
    location: string;
    capacity: number;
    size: string;
    createdAt: string;
    qrCode: string;
    content: string[]; // array de SKUs
  }
  