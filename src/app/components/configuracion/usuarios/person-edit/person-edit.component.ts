import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent {
  selectedType?: string;

  constructor(public dialogRef: MatDialogRef<PersonEditComponent>) {}

  onSelectionChange(type: string): void {
    this.selectedType = type;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  continuar(): void {
    this.dialogRef.close(this.selectedType);
  }
}