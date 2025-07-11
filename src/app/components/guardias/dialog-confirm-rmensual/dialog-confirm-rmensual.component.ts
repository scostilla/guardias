import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-rmensual',
  templateUrl: './dialog-confirm-rmensual.component.html',
  styleUrls: ['./dialog-confirm-rmensual.component.css']
})
export class DialogConfirmRmensualComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogConfirmRmensualComponent>) { }
  
    confirmar(): void {
      this.dialogRef.close(true);
    }
  
    cancelar(): void {
      this.dialogRef.close(false);
    }
  }
