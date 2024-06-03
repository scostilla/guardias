import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-ddjj',
  templateUrl: './dialog-confirm-ddjj.component.html',
  styleUrls: ['./dialog-confirm-ddjj.component.css']
})
export class DialogConfirmDdjjComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogConfirmDdjjComponent>) { }
  
    confirmar(): void {
      this.dialogRef.close(true);
    }
  
    cancelar(): void {
      this.dialogRef.close(false);
    }
  }
