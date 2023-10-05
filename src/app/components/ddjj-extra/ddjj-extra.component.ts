import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from '../ddjj-extra-tot/ddjj-extra-tot.component';

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

export class DialogObserv {
  constructor(
    public dialogRef: MatDialogRef<DialogObserv>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
