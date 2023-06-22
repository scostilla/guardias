import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

interface Specialty {
  value: string;
  viewValue: string;
}

interface Service {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-professional-abm',
  templateUrl: './professional-abm.component.html',
  styleUrls: ['./professional-abm.component.css'],
})
export class ProfessionalAbmComponent {
  profesionSelected = 'Medico';
  specialtySelected = 'clinica';
  serviceSelected = 'clinico';
  options: any[] | undefined;
  selectedHospital: string = '';

  services: Service[] = [
    { value: 'anestesiologia', viewValue: 'ANESTESIOLOGIA' },
    { value: 'anestesiologia infantil', viewValue: 'ANESTESIOLOGIA INFANTIL' },
    { value: 'cardiologia', viewValue: 'CARDIOLOGIA' },
    { value: 'cirugia general', viewValue: 'CIRUGIA GENERAL' },
    { value: 'cirugia infantil', viewValue: 'CIRUGIA INFANTIL' },
    { value: 'clinico', viewValue: 'CLINICO' },
    { value: 'ginecologia', viewValue: 'GINECOLOGIA' },
    { value: 'guardia central', viewValue: 'GUARDIA CENTRAL' },
    { value: 'hemoterapia', viewValue: 'HEMOTERAPIA' },
    { value: 'laboratorio/ bioquimico', viewValue: 'LABORATORIO/ BIOQUIMICO' },
    { value: 'neonatologia', viewValue: 'NEONATOLOGIA' },
    { value: 'obstetricia/maternidad', viewValue: 'OBSTETRICIA/MATERNIDAD' },
    { value: 'oncohematologia', viewValue: 'ONCOHEMATOLOGIA' },
    { value: 'otro', viewValue: 'OTRO' },
    { value: 'pediatria', viewValue: 'PEDIATRIA' },
    {
      value: 'terapia intensiva adulto',
      viewValue: 'TERAPIA INTENSIVA ADULTO',
    },
    {
      value: 'terapia intensiva infantil',
      viewValue: 'TERAPIA INTENSIVA INFANTIL',
    },
    { value: 'terapia intermedia', viewValue: 'TERAPIA INTERMEDIA' },
    { value: 'tocoginecologia', viewValue: 'TOCOGINECOLOGIA' },
    { value: 'traumatologia', viewValue: 'TRAUMATOLOGIA' },
    { value: 'urologia', viewValue: 'UROLOGIA' },
  ];

  specialties: Specialty[] = [
    { value: 'anestesista', viewValue: 'ANESTESISTA' },
    { value: 'bioquímico', viewValue: 'BIOQUÍMICO' },
    { value: 'cardiologia', viewValue: 'CARDIOLOGIA' },
    { value: 'cirugia', viewValue: 'CIRUGIA' },
    { value: 'cirugia infantil', viewValue: 'CIRUGIA INFANTIL' },
    { value: 'cirugia materna', viewValue: 'CIRUGIA MATERNA' },
    { value: 'clinica', viewValue: 'CLINICA' },
    { value: 'ecografia', viewValue: 'ECOGRAFIA' },
    { value: 'ginecólogia', viewValue: 'GINECÓLOGIA' },
    { value: 'hemoterapia', viewValue: 'HEMOTERAPIA' },
    { value: 'infectologia', viewValue: 'INFECTOLOGIA' },
    { value: 'internacion pediatrica', viewValue: 'INTERNACION PEDIATRICA' },
    { value: 'medicina general', viewValue: 'MEDICINA GENERAL' },
    { value: 'neonatologia', viewValue: 'NEONATOLOGIA' },
    { value: 'neurocirugia', viewValue: 'NEUROCIRUGIA' },
    { value: 'obstetricia', viewValue: 'OBSTETRICIA' },
    { value: 'pediatria', viewValue: 'PEDIATRIA' },
    { value: 'terapia intensiva', viewValue: 'TERAPIA INTENSIVA' },
    {
      value: 'terapia intensiva infantil',
      viewValue: 'TERAPIA INTENSIVA INFANTIL',
    },
    { value: 'tocoginecologia', viewValue: 'TOCOGINECOLOGIA' },
    { value: 'traumatologia', viewValue: 'TRAUMATOLOGIA' },
    { value: 'urologia', viewValue: 'UROLOGIA' },
  ];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ProfessionalAbmComponent>
  ) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
