import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false
})
export class InventoryPage {
  elementsPerPage = 5;
  currentPage = 0;
  displayedData: any[] = [];
  totalPages = 0;
  fullData: any[] = [];
  inventario: any[] = [];

  constructor(private dbService: DatabaseService) {
    this.dbService.fetchFirestoreCollection('Productos').subscribe(data => {
      this.fullData = data;
      this.totalPages = Math.ceil(this.fullData.length / this.elementsPerPage);
      this.updateDisplayedData();
      this.inventario = data;
      console.log(data);
    });
  }

  updateDisplayedData() {
    const start = this.currentPage * this.elementsPerPage;
    const end = start + this.elementsPerPage;
    this.displayedData = this.fullData.slice(start, end);
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

  editItem(item: any) {
    console.log('Editar', item);
  }

  deleteItem(id: string) {
    this.dbService.deleteFireStoreDocument('Productos', id).then(() => {
      this.fullData = this.fullData.filter(item => item.id !== id);
      this.totalPages = Math.ceil(this.fullData.length / this.elementsPerPage);
      this.updateDisplayedData();
    });
  }
}
