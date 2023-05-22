import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.css']
})
export class SearchPopupComponent {
  constructor(private dialogRef: MatDialogRef<SearchPopupComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
