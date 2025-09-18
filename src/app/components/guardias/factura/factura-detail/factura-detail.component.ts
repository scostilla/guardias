import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Factura } from 'src/app/models/Factura';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrls: ['./factura-detail.component.css']
})
export class FacturaDetailComponent {

  factura: Factura;

  constructor(
    private dialogRef: MatDialogRef<FacturaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Factura
  ) {
    this.factura = data;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
