import {Component, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SoporteFormComponent } from './soporte-form/soporte-form.component';
import {MatCardModule} from '@angular/material/card';




@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent {
  panelOpenState = false;

  dialogRef!: MatDialogRef<SoporteFormComponent>;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  supportForm(): void {
    this.dialogRef = this.dialog.open(SoporteFormComponent, { 
      width: '600px',
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

}
