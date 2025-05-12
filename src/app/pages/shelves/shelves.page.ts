import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.page.html',
  styleUrls: ['./shelves.page.scss'],
  standalone: false
})
export class ShelvesPage {
  shelves: any[] = [];
  fullData: any[] = [];
  displayedShelves: any[] = [];
  elementsPerPage = 5;
  currentPage = 0;
  totalPages = 0;

  qrModalOpen = false;
  selectedQR: any = null;

  constructor(private dbService: DatabaseService, private location: Location) {
    this.dbService.fetchFirestoreCollection('shelves').subscribe((data) => {
      this.fullData = data;
      this.totalPages = Math.ceil(this.fullData.length / this.elementsPerPage);
      this.updateDisplayedData();
      this.shelves = data;
    });
  }

  updateDisplayedData() {
    const start = this.currentPage * this.elementsPerPage;
    const end = start + this.elementsPerPage;
    this.displayedShelves = this.fullData.slice(start, end);
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

  openQRModal(shelf: any) {
    this.selectedQR = shelf;
    this.qrModalOpen = true;
  }

  downloadSelectedQR(qrImage: HTMLImageElement) {
    const a = document.createElement('a');
    a.href = qrImage.src;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(2);
    const filename = `${this.selectedQR?.code || 'QR'}-${dd}-${mm}-${yy}.png`;
    a.download = filename;
    a.click();
  }
  deleteItem(id: string) {
    this.dbService.deleteFireStoreDocument('shelves', id).then(() => {
      this.fullData = this.fullData.filter((item) => item.id !== id);
      this.totalPages = Math.ceil(this.fullData.length / this.elementsPerPage);
      this.updateDisplayedData();
    });
  }
   goBack() {
    this.location.back();
  }
}
