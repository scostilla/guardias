import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ProfessionalFormEditComponent} from '../professional-form-edit/professional-form-edit.component';
import { ProfessionalFormDeletComponent} from '../professional-form-delet/professional-form-delet.component';

@Component({
  selector: 'app-professional-plantilla-dh',
  templateUrl: './professional-plantilla-dh.component.html',
  styleUrls: ['./professional-plantilla-dh.component.css']
})
export class ProfessionalPlantillaDhComponent implements OnInit {
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
    this.dialogReg.open(ProfessionalFormEditComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openFormDelet(){
    this.dialogReg.open(ProfessionalFormDeletComponent, {
      width: '600px',
      disableClose: true,
    })
  }

}
