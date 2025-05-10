import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-shelf',
  templateUrl: './add-shelf.page.html',
  styleUrls: ['./add-shelf.page.scss'],
  standalone: false,
})
export class AddShelfPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
