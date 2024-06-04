import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoridadDto } from 'src/app/dto/Configuracion/AutoridadDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Autoridad } from 'src/app/models/Configuracion/Autoridad';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';

@Component({
  selector: 'app-autoridad-edit',
  templateUrl: './autoridad-edit.component.html',
  styleUrls: ['./autoridad-edit.component.css']
})
export class AutoridadEditComponent implements OnInit {

  autoridadForm: FormGroup;
  initialData: any;
  efectores: Efector[] = [];
  personas : Asistencial[] =[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AutoridadEditComponent>,
    private autoridadService: AutoridadService,
    private asistencialService : AsistencialService,
    private hospitalService : HospitalService,
    
    @Inject(MAT_DIALOG_DATA) public data: Autoridad
  ){
    this.autoridadForm = this.fb.group({
      persona: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: [''/* , Validators.required */],
      esActual: ['', Validators.required],
      esRegional: ['', Validators.required],
      efector: ['', Validators.required]
    });

    this.listAsistenciales();
    this.listEfectores();

    if (data) {
      this.autoridadForm.patchValue(data);
    }

    
  }

  ngOnInit(): void {
    this.initialData = this.autoridadForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.autoridadForm.value);
  }

  listAsistenciales(): void {
    this.asistencialService.list().subscribe(data => {
      console.log('Lista de Asistenciales:', data);
      this.personas = data;
    }, error => {
      console.log(error);
    });
  }

  listEfectores(): void {
    /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
    this.hospitalService.list().subscribe(data => {
      console.log('Lista de Efectores:', data);
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

  saveAutoridad(): void {
    if (this.autoridadForm.valid) {
      const autoridadData = this.autoridadForm.value;

      const autoridadDto = new AutoridadDto(
        autoridadData.nombre,
        autoridadData.fechaInicio,
        autoridadData.fechaFinal,
        autoridadData.esActual,
        autoridadData.esRegional,
        autoridadData.efector.id,
        autoridadData.persona.id
        
       /* 
        autoridadData.udo.id,
        autoridadData.persona.id */
      );

      /* AYUDA: si this.data tiene un valor y un ID asociado */
      if (this.data && this.data.id) {
        this.autoridadService.update(this.data.id, autoridadDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        
        this.autoridadService.save(autoridadDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
  }

  comparePersona(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareEfector(p1: Efector, p2: Efector): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
}
