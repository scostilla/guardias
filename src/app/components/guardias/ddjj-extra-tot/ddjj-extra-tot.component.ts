import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


export interface DialogData {
  observ: string;
}

@Component({
  selector: 'app-ddjj-extra-tot',
  templateUrl: './ddjj-extra-tot.component.html',
  styleUrls: ['./ddjj-extra-tot.component.css']
})
export class DdjjExtraTotComponent {
  observ!: string;
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogObserv, {
      data: {observ: this.observ},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.observ = result;
    });
  }
}

@Component({
  selector: 'dialog-observ',
  templateUrl: 'dialog-observ.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class DialogObserv {
  constructor(
    public dialogRef: MatDialogRef<DialogObserv>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
