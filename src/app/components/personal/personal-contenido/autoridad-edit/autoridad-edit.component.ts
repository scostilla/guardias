import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoridadDto } from 'src/app/dto/Configuracion/AutoridadDto';
import { Autoridad } from 'src/app/models/Configuracion/Autoridad';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { AsistencialSelectorComponent } from '../asistencial-selector/asistencial-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-autoridad-edit',
  templateUrl: './autoridad-edit.component.html',
  styleUrls: ['./autoridad-edit.component.css']
})
export class AutoridadEditComponent implements OnInit {

  autoridadForm: FormGroup;
  initialData: any;
  inputValue: string = '';
  autoridades: Autoridad[] = []; 


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AutoridadEditComponent>,
    private autoridadService: AutoridadService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Autoridad
  ){
    this.autoridadForm = this.fb.group({
      idPersona: ['', Validators.required],
    });

    this.loadAutoridades();

    if (data) {
      this.inputValue = `${data.persona!.apellido} ${data.persona!.nombre}`; // Guarda el nombre completo
      this.autoridadForm.patchValue({
          idPersona: data.persona!.id,
      });
  }

}

  ngOnInit(): void {
    this.initialData = this.autoridadForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.autoridadForm.value);
  }

  loadAutoridades(): void {
    this.autoridadService.list().subscribe(data => {
      this.autoridades = data; // Guarda la lista de autoridades
    }, error => {
      console.log(error);
    });
  }

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.autoridadForm.patchValue({ idPersona: result.id });
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }

  saveAutoridad(): void {
    if (this.autoridadForm.valid) {
      const autoridadData = this.autoridadForm.value;
  
      if (!this.data || !this.data.id) {
        const existing = this.autoridades.find(a => 
          a.persona!.id === autoridadData.idPersona && a.activo === true
        );
  
        if (existing) {
          this.toastr.warning('Ya existe un registro activo para esta persona.', 'Advertencia', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          return;
        }
      }
  
      const autoridadDto = new AutoridadDto(
        true,
        autoridadData.idPersona,
      );
  
      console.log('Datos a enviar:', autoridadDto);
  
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
