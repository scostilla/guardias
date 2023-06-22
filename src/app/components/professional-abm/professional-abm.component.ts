import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  professionalForm: FormGroup;
  options: any[] | undefined;


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
    public dialogRef: MatDialogRef<ProfessionalAbmComponent>,
    private fb: FormBuilder
  ) {
    this.professionalForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      cuil: ['', Validators.required],
      professional: ['', Validators.required],
      specialty: ['', ],
      revista: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['',],
      udo: ['', Validators.required],
      hospital: ['', Validators.required],
      service: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

  addEditProfessional() {

    if (this.professionalForm.valid) {
      console.log('professional form valid');
      const formData = this.professionalForm.value;
      console.log(formData);
    } else {
      console.log('professional form not valid');
      this.markFormGroupTouched(this.professionalForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    console.log('error list');
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });}

  cancel() {
    this.dialogRef.close();
  }
}
