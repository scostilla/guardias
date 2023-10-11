import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProfessionalFormDeletComponent } from '../professional-form-delet/professional-form-delet.component';
import { ProfessionalFormEditComponent } from '../professional-form-edit/professional-form-edit.component';

@Component({
  selector: 'app-professional-dh',
  templateUrl: './professional-dh.component.html',
  styleUrls: ['./professional-dh.component.css'],
})
export class ProfessionalDhComponent implements OnInit {
  id: string | null | undefined;
  person: any;
  totalSemanal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public dialogReg: MatDialog
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
          this.calcularTotalSemanal();
        }
      });
  }

  calcularTotalSemanal() {
    if(this.person){
      this.person.cargoSabado = this.person.cargoSabado ||0 + this.person.agrupacionSabado ||0 ;
      this.person.cargoDomingo = this.person.cargoDomingo ||0 + this.person.agrupacionDomingo ||0 ;
      this.person.cargoLunes = this.person.cargoLunes ||0 + this.person.agrupacionLunes ||0 ;
      this.person.cargoMartes = this.person.cargoMartes ||0 + this.person.agrupacionMartes ||0 ;
      this.person.cargoMiercoles = this.person.cargoMiercoles ||0 + this.person.agrupacionMiercoles ||0 ;
      this.person.cargoJueves = this.person.cargoJueves ||0 + this.person.agrupacionJueves ||0 ;
      this.person.cargoViernes = this.person.cargoViernes ||0 + this.person.agrupacionViernes ||0 ;

    }
    this.totalSemanal =
    (this.person.cargoSabado ?? 0) +
    (this.person.cargoDomingo ?? 0) +
    (this.person.cargoLunes ?? 0) +
    (this.person.cargoMartes ?? 0) +
    (this.person.cargoMiercoles ?? 0) +
    (this.person.cargoJueves ?? 0) +
    (this.person.cargoViernes ?? 0);
  }

  openFormEdit() {
    const dialogRef: MatDialogRef<ProfessionalFormEditComponent> =
      this.dialogReg.open(ProfessionalFormEditComponent, {
        width: '600px',
        disableClose: true,
        data: { id: this.id },
      });
  }

  openFormDelet() {
    this.dialogReg.open(ProfessionalFormDeletComponent, {
      width: '600px',
      disableClose: true,
    });
  }
}
