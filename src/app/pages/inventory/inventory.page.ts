import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false,
})
export class InventoryPage implements OnInit {
  elementsPerPage = 5;
  currentPage = 0;

  displayedData: PeriodicElement[] = [];
  totalPages = 0;

  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Pan', quantity: 30, price: 1.50, expirationDate: '01/11/2026' },
    { position: 2, name: 'Barra de chocolate', quantity: 20, price: 2.00, expirationDate: '10/10/2026' },
    { position: 3, name: 'Gaseosa', quantity: 50, price: 1.20, expirationDate: '15/09/2026' },
    { position: 4, name: 'Agua mineral', quantity: 60, price: 0.80, expirationDate: '22/08/2026' },
    { position: 5, name: 'Leche', quantity: 40, price: 1.90, expirationDate: '05/11/2026' },
    { position: 6, name: 'Arroz', quantity: 70, price: 3.00, expirationDate: '30/12/2026' },
    { position: 7, name: 'Aceite', quantity: 25, price: 4.50, expirationDate: '17/01/2027' },
    { position: 8, name: 'Sal', quantity: 80, price: 0.60, expirationDate: '15/05/2027' },
    { position: 9, name: 'Azúcar', quantity: 55, price: 2.10, expirationDate: '09/03/2027' },
    { position: 10, name: 'Yogurt', quantity: 35, price: 1.75, expirationDate: '12/07/2026' },
  ];

  ngOnInit() {
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = this.currentPage * this.elementsPerPage;
    const end = start + this.elementsPerPage;
    this.displayedData = this.ELEMENT_DATA.slice(start, end);
    this.totalPages = Math.ceil(this.ELEMENT_DATA.length / this.elementsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }
}

export interface PeriodicElement {
  position: number;
  name: string;
  quantity: number;
  price: number;
  expirationDate: string;
}
