export interface Product {
    cost: number;            // Costo unitario del producto
    createdAt: string;       // Fecha de creación (ISO string)
    expires: string;         // Fecha de expiración
    lot: string;             // Lote del producto
    name: string;            // Nombre descriptivo
    price: number;           // Precio de venta
    qrCode: string;          // Imagen base64 del código QR
    quantity: number;        // Cantidad actual en stock
    shelf: boolean;          // Indica si está asignado a un estante
    sku: string;             // Código SKU único, ej. "KRI-003"
  }
  