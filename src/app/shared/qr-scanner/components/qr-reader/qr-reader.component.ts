import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.scss'],
  standalone: false,
})
export class QrReaderComponent {
  @Input() title: string = 'Escáner QR';
  @Output() scanSuccess = new EventEmitter<string>();

  allowedFormats = [BarcodeFormat.QR_CODE];

  devices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.devices = devices.filter((device) => device.kind === 'videoinput');
      this.currentDevice = this.devices[0]; // usa la primera cámara disponible
    });
  }

  onCodeResult(result: string): void {
    if (result) {
      this.scanSuccess.emit(result);
    }
  }
}
