import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-professional',
  templateUrl: './search-professional.component.html',
  styleUrls: ['./search-professional.component.css'],
})
export class SearchProfessionalComponent {
  constructor(private dialogRef: MatDialogRef<SearchProfessionalComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
