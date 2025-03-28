import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CronogramaTentativoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-cronograma-create',
  templateUrl: './cronograma-create.component.html',
  styleUrls: ['./cronograma-create.component.css']
})
export class CronogramaCreateComponent {

  cronoForm: FormGroup;
  tiposGuardia: any[] = [];
  asistenciales: any[] = [];
  efectores: any[] = [];
  inputValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<CronogramaCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cronoService: CronogramaTentativoService,
    private hospitalService: HospitalService,
    private tipoGuardiaService: TipoGuardiaService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.cronoForm = this.fb.group({
      fechaIngreso: ['', Validators.required],
      fechaEgreso: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      horaEgreso: ['', Validators.required],
      tipoGuardia: ['', Validators.required],
      asistencial: ['', Validators.required],
      efector: ['', Validators.required],
      observacion: ['', [Validators.maxLength(250)]],
    });
  }

  ngOnInit(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tiposGuardia = data;
    });

    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
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
        this.cronoForm.patchValue({ asistencial: result.id });
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

  saveCronograma(): void {
    if (this.cronoForm.valid) {
      const formData = this.cronoForm.value;
      const cronogramaDto = new CronogramaTentativoDto(
        formData.fechaIngreso,
        formData.fechaEgreso,
        formData.horaIngreso,
        formData.horaEgreso,
        true, // activo
        false, // aceptado
        formData.tipoGuardia.id,
        formData.asistencial,
        formData.efector.id,
        formData.observacion
      );
  
      this.cronoService.save(cronogramaDto).subscribe(
        response => {
          this.toastr.success('Éxito, cronograma tentativo guardado', 'Guardado exitoso', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          this.cronoService.refresh$.next();
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error al guardar el cronograma:', error);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}