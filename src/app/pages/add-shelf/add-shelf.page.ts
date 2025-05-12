import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertController } from '@ionic/angular';
import { Shelf } from 'src/app/models/shelf.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-shelf',
  templateUrl: './add-shelf.page.html',
  styleUrls: ['./add-shelf.page.scss'],
  standalone: false,
})
export class AddShelfPage implements OnInit {
  shelfForm!: FormGroup;
  qrData: string | null = null;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private alertController: AlertController,
    private location: Location
  ) {}

  ngOnInit() {
    this.shelfForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      size: ['', Validators.required],
    });
  }

  async addShelf() {
    if (this.shelfForm.valid) {
      const shelfBase = this.shelfForm.value;
      this.qrData = JSON.stringify(shelfBase);

      setTimeout(async () => {
        const qrElement = document.querySelector(
          'qrcode canvas'
        ) as HTMLCanvasElement;

        if (qrElement) {
          const qrBase64 = qrElement.toDataURL('image/png');
          const now = new Date();

          const shelfWithQR: Shelf = {
            ...shelfBase,
            qrCode: qrBase64,
            createdAt: now.toISOString(),
            content: [], // Inicialmente vacío
            shelf: true, // Marcado como estante disponible
          };

          try {
            const exists = await this.databaseService.checkDocumentExists(
              'shelves',
              shelfWithQR.code
            );
            if (!exists) {
              await this.databaseService.addFirestoreDocumentID(
                'shelves',
                shelfWithQR.code,
                shelfWithQR
              );

              const alert = await this.alertController.create({
                header: 'Éxito',
                message: 'Estante agregado correctamente.',
                buttons: ['OK'],
              });
              await alert.present();

              this.shelfForm.reset();
              this.qrData = null;
            } else {
              const alert = await this.alertController.create({
                header: 'Error',
                message:
                  'El código del estante ya existe. Por favor, elige otro.',
                buttons: ['OK'],
              });
              await alert.present();
            }
          } catch (error) {
            console.error('Error al guardar el estante:', error);
          }
        } else {
          console.error('No se pudo obtener el QR para guardar.');
        }
      }, 500);
    }
  }

  downloadQR() {
    const qrElement = document.querySelector(
      'qrcode canvas'
    ) as HTMLCanvasElement;

    if (qrElement && this.shelfForm.value.code) {
      const imgData = qrElement.toDataURL('image/png');
      const fileName = `${this.shelfForm.value.code.replace(
        /\s+/g,
        '_'
      )}-QR.png`;

      const a = document.createElement('a');
      a.href = imgData;
      a.download = fileName;
      a.click();
    } else {
      console.error(
        'No se encontró el elemento QR o el código del estante no está definido.'
      );
    }
  }
  goBack() {
    this.location.back();
  }
}
