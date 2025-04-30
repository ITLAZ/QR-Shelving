import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    public db: DatabaseService
  ) {
    this.db.fetchFirestoreCollection('Productos').subscribe((res: any) => {
      console.log('res', res);
    });

    // this.db.addFirestoreDocument('Estantes',
    //   {
    //     name: 'Estantes',
    //     size: 150 
    //   }).then((res) => {
    //     console.log('Escrito con exito', res);
    //   }).catch((error) => {
    //     console.error('Error writing document: ', error);
    //   });
  }
}
