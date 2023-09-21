import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProfessionalFormDeletComponent } from '../professional-form-delet/professional-form-delet.component';
import { ProfessionalFormEditComponent } from '../professional-form-edit/professional-form-edit.component';


@Component({
  selector: 'app-professional-dh',
  templateUrl: './professional-dh.component.html',
  styleUrls: ['./professional-dh.component.css']
})
export class ProfessionalDhComponent implements OnInit {
  id: string | null | undefined;
  person: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, public dialogReg: MatDialog,
    ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', this.id);
    this.cargarDatosperson(parseInt(this.id ?? '', 10));
  }

  cargarDatosperson(id: number) {
    this.http
      .get<any[]>('../../../assets/jsonFiles/profesionales.json')
      .subscribe((data: any[]) => {
        this.person = data.find((item) => item.id === id);
        if (this.person) {
          console.log(this.person);
        }
      });
  }
  openFormEdit(){
    const dialogRef: MatDialogRef<ProfessionalFormEditComponent> = this.dialogReg.open(ProfessionalFormEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: this.id }
    })
  }

  openFormDelet(){
    this.dialogReg.open(ProfessionalFormDeletComponent, {
      width: '600px',
      disableClose: true,
    })
  }

}
