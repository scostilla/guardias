import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-ddjj',
  templateUrl: './dialog-confirm-ddjj.component.html',
  styleUrls: ['./dialog-confirm-ddjj.component.css']
})
export class DialogConfirmDdjjComponent {
  estado: 'APROBADO' | 'RECHAZADO' = 'APROBADO';
  motivo: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmDdjjComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm(): void {
    this.dialogRef.close({ estado: this.estado, motivo: this.motivo });
  }
}

