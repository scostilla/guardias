import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';


export interface DialogData {
  observ: string;
}

@Component({
  selector: 'app-ddjj-extra',
  templateUrl: './ddjj-extra.component.html',
  styleUrls: ['./ddjj-extra.component.css'],
})
export class DdjjExtraComponent {
  displayedColumns = [
    'position',
    'servicio',
    'nya',
    'cuil',
    'vinculo',
    'categoria',
    'novedades',
  ];

  profesionales: any[] = [];
  enableTotales: boolean = false;
  observ!: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.enableTotales = false;
    this.route.queryParams.subscribe((params) => {
      if (params['vector']) {
        this.profesionales = JSON.parse(params['vector']);
        console.log(this.profesionales);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogObserv, {
      data: {observ: this.observ},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.observ = result;
    });
  }

  btnPaseDPH(){
    this.enableTotales = true;
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
