import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.scss'],
  standalone: false,
})
export class QrReaderComponent {
  @Input() title: string = 'Escáner QR';
  @Output() scanned = new EventEmitter<string>();

  onCodeResult(result: string) {
    this.scanned.emit(result);
  }
}
