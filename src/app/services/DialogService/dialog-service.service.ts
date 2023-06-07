import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {
  private dialogRef: MatDialogRef<any> | undefined;

  setDialogRef(dialogRef: MatDialogRef<any>) {
    this.dialogRef = dialogRef;
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
