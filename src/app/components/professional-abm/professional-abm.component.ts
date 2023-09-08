import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Profesional from 'src/server/models/ConsultaProfesional';
import { DataSharingService } from '../../services/DataSharing/data-sharing.service';

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
  selectedProfesion: string = 'MEDICO';
  selectedRevista: string = 'CONTRATADO';
  selectedCargaHoraria: string = '30 horas';
  professionalForm: FormGroup;
  options: any[] | undefined;
  specialties: any[] | undefined;
  cargos: any[] | undefined;
  cargaHorariaList: any[] | undefined;
  guardias: any[] | undefined;
  profesionList: any[] | undefined;
  sitRevista: any[] | undefined;
  adicionales: any[] | undefined;
  categorias: any[] | undefined;
  person: any;
  profesionales?: Profesional[];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ProfessionalAbmComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dataSharingService: DataSharingService,
    private apiServiceService: ApiServiceService
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
      cuil: ['', [Validators.pattern('[0-9-]*'), Validators.required]],
      profesion: ['', Validators.required],
      especialidad: [''],
      sitRevista: ['', Validators.required],
      categoria: [''],
      cargaHoraria: [''],
      adicional: [''],
      udo: [''],
      hospital: ['', Validators.required],
      tipoGuardia: [''],
      matricula: [''],
      cargo: [''],
      profesionList: [''],
    });

    /*
    if (this.data.id !== -1) {
      this.apiServiceService.getProfesionales().subscribe((DBdata: any[]) => {
        console.log(DBdata);
        this.person = DBdata.find(
          (item) => item.idProfesional === this.data.id
        );
        if (this.person) {
          this.patchFormValues();
        }
      });
    }
  }*/

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

      this.http
      .get<any[]>('../assets/jsonFiles/especialidades.json')
      .subscribe((data) => {
        this.specialties = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/cargo.json')
      .subscribe((data) => {
        this.cargos = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/tipoGuardia.json')
      .subscribe((data) => {
        this.guardias = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/cargaHoraria.json')
      .subscribe((data) => {
        this.cargaHorariaList = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/profesion.json')
      .subscribe((data) => {
        this.profesionList = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/sitRevista.json')
      .subscribe((data) => {
        this.sitRevista = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/adicional.json')
      .subscribe((data) => {
        this.adicionales = data;
      });

      this.http
      .get<any[]>('../assets/jsonFiles/categoria.json')
      .subscribe((data) => {
        this.categorias = data;
      });
  }

  patchFormValues() {
    this.professionalForm.patchValue({
      nombre: this.person.nombre,
      apellido: this.person.apellido,
      dni: this.person.dni,
      cuil: this.person.cuil,
      profesion: this.person.profesion,
      especialidad: this.person.especialidad,
      sitRevista: this.person.sitRevista,
      categoria: this.person.categoria,
      cargaHoraria: this.person.cargaHoraria,
      adicional: this.person.adicional,
      udo: this.person.udo,
      hospital: this.person.hospital,
      idCargo: this.person.idCargo,
      cargo: this.person.cargo,
      matricula: this.person.matricula,
      tipoGuardia: this.person.tipoGuardia,
    });
  }

  addEditProfessional() {
    if (this.professionalForm.valid) {
      const formData = this.professionalForm.value;
      console.log(formData);
      console.log(this.data.id);

      //enviar el formData a professional-list
      this.dataSharingService.setProfessionalFormData(formData);
      this.dataSharingService.setProfessionalId(this.data.id);
      this.dataSharingService.setSendFormData(true);
    } else {
      console.log('professional form not valid');
      this.dataSharingService.setSendFormData(false);
      this.markFormGroupTouched(this.professionalForm);
    }
    this.dialogRef.close();
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

  isFormDirty() {
    return this.professionalForm.dirty;
  }

  cancel() {
    this.dataSharingService.setSendFormData(false);
    this.dialogRef.close();
  }
}
