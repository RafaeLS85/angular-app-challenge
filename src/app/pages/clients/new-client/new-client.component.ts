import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ClientService } from '../services/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAge } from '../utils/share-functions';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
export class NewClientComponent {
  
  date;

  clientForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required]),
  });

  formatDate(date) {
    this.date = moment(date).format('DD/MM/YYYY');
  }

  constructor(private service: ClientService, private _snackBar: MatSnackBar) {}

  onSubmit() {
    if (this.clientForm.valid) {
      try {
        this.clientForm.get('birthdate').setValue(this.date);

        if (getAge(this.date) > 125) {
          throw new Error('Edad fuera de rango');
        } else if (getAge(this.date) <= 0) {
          throw new Error('Debe tener al menos un año de edad');
        }

        this.service
          .createClient(this.clientForm.value)
          .then(() => {
            this.clientForm.reset();
            this.openSnackBar('Cliente agregado', 'Aceptar');
          })
          .catch((err) => {
            this.openSnackBar(err, 'Cerrar');
          });
      } catch (error) {
        this.openSnackBar(error, 'Cerrar');
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}