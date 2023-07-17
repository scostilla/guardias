import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Specialty {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-professional-abm',
  templateUrl: './professional-abm.component.html',
  styleUrls: ['./professional-abm.component.css'],
})
export class ProfessionalAbmComponent {
  selectedProfessional: string = 'Medico';
  selectedRevista: string = 'contratado';
  selectedCarga: string = '40';
  professionalForm: FormGroup;
  options: any[] | undefined;
  person: any;

  specialties: Specialty[] = [
    { value: 'ANESTESISTA', viewValue: 'ANESTESISTA' },
    { value: 'CARDIOLOGIA', viewValue: 'CARDIOLOGIA' },
    { value: 'CIRUGIA', viewValue: 'CIRUGIA' },
    { value: 'CIRUGIA INFANTIL', viewValue: 'CIRUGIA INFANTIL' },
    { value: 'CIRUGIA MATERNA', viewValue: 'CIRUGIA MATERNA' },
    { value: 'CLINICA', viewValue: 'CLINICA' },
    { value: 'ECOGRAFIA', viewValue: 'ECOGRAFIA' },
    { value: 'GINECÓLOGIA', viewValue: 'GINECÓLOGIA' },
    { value: 'HEMOTERAPIA', viewValue: 'HEMOTERAPIA' },
    { value: 'INFECTOLOGIA', viewValue: 'INFECTOLOGIA' },
    { value: 'INTERNACION PEDIATRICA', viewValue: 'INTERNACION PEDIATRICA' },
    { value: 'MEDICINA GENERAL', viewValue: 'MEDICINA GENERAL' },
    { value: 'NEONATOLOGIA', viewValue: 'NEONATOLOGIA' },
    { value: 'NEUROCIRUGIA', viewValue: 'NEUROCIRUGIA' },
    { value: 'OBSTETRICIA', viewValue: 'OBSTETRICIA' },
    { value: 'PEDIATRIA', viewValue: 'PEDIATRIA' },
    { value: 'TERAPIA INTENSIVA', viewValue: 'TERAPIA INTENSIVA' },
    {
      value: 'TERAPIA INTENSIVA INFANTIL',
      viewValue: 'TERAPIA INTENSIVA INFANTIL',
    },
    { value: 'TOCOGINECOLOGIA', viewValue: 'TOCOGINECOLOGIA' },
    { value: 'TRAUMATOLOGIA', viewValue: 'TRAUMATOLOGIA' },
    { value: 'UROLOGIA', viewValue: 'UROLOGIA' },
  ];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ProfessionalAbmComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.professionalForm = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')],
      ],
      apellido: [
        '',
        [Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*'), Validators.required],
      ],
      dni: ['', [Validators.pattern('[0-9]*'), Validators.required]],
      cuil: ['', [Validators.pattern('[0-9]*'), Validators.required]],
      professional: ['', Validators.required],
      specialty: [''],
      revista: ['', Validators.required],
      categoria: [''],
      cargaHoraria: [''],
      adicional: [''],
      udo: [''],
      hospital: ['', Validators.required],
    });

    if (this.data.id !== -1) {
      this.http
        .get<any[]>('../../../assets/jsonFiles/profesionales.json')
        .subscribe((data: any[]) => {
          this.person = data.find((item) => item.id === this.data.id);
          if (this.person) {
            console.log(this.person.nombre);
            this.patchFormValues();
          }
        });
    }
  }

  ngOnInit() {
    console.log('Received id:', this.data.id);
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

  patchFormValues() {
    this.professionalForm.patchValue({
      nombre: this.person.nombre,
      apellido: this.person.apellido,
      dni: this.person.dni,
      cuil: this.person.cuil,
      professional: this.person.profesion,
      specialty: this.person.especialidad,
      revista: this.person.sitRevista,
      categoria: this.person.cat,
      cargaHoraria: this.person.cargHoraria,
      adicional: this.person.adicional,
      udo: this.person.udo,
      hospital: this.person.hospital,
    });
    console.log(this.professionalForm)
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
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
