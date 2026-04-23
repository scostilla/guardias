import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/NoAsistencialDto';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-no-asistencial-edit',
  templateUrl: './no-asistencial-edit.component.html',
  styleUrls: ['./no-asistencial-edit.component.css']
})
export class NoAsistencialEditComponent implements OnInit {
  noAsistencialForm: FormGroup;
  initialData: any;
  idNoAsistencial: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private noAsistencialService: NoAsistencialService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
  ) {
    this.noAsistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      domicilio: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9,.#/@\\-° ]{1,90}$')]],
      cuilPrefijo: ['', [Validators.required, Validators.pattern(/^(20|23|27)$/)]],
      cuilDni: [{ value: '', disabled: true }],
      cuilSufijo: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      fechaNacimiento: [''],
      sexo: [''],
      telefono: ['', [Validators.pattern(/^\d{9,30}$/)]],
      email: ['' , [Validators.required, Validators.email]],
    });

    // recupera el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.initialData = navigation.extras.state['noAsistencial'];  // Recibo el no asistencial
    }
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.idNoAsistencial = this.initialData.id ?? 0;
      this.noAsistencialForm.patchValue({
        ...this.initialData
      });

      // dividir CUIL de BD
      this.dividirCuil(this.initialData.cuil);
    }

    // mantener cuilDni sincronizado si cambian DNI
    this.noAsistencialForm.get('dni')?.valueChanges.subscribe(dni => {
      this.noAsistencialForm.get('cuilDni')?.setValue(dni || '', { emitEvent: false });
    });
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.noAsistencialForm.value);
  }

  updateNoAsistencial(): void {
    if (this.noAsistencialForm.valid) {
      const noAsistencialData = this.noAsistencialForm.value;

      noAsistencialData.nombre = this.capitalizeWords(noAsistencialData.nombre);
      noAsistencialData.apellido = this.capitalizeWords(noAsistencialData.apellido);

      const prefijo = this.noAsistencialForm.get('cuilPrefijo')?.value;
      const dni = this.noAsistencialForm.get('dni')?.value;
      const sufijo = this.noAsistencialForm.get('cuilSufijo')?.value;

      const cuilCompleto = `${prefijo}${dni}${sufijo}`;

      const noAsistencialDto = new NoAsistencialDto(
        noAsistencialData.nombre,
        noAsistencialData.apellido,
        noAsistencialData.dni,
        cuilCompleto,
        false, // esAsistencial
        true, // activo
        noAsistencialData.email,
        noAsistencialData.fechaNacimiento ?? null,
        noAsistencialData.sexo ?? null,
        noAsistencialData.telefono ?? null,
        noAsistencialData.domicilio ?? null,
        noAsistencialData.descripcion ?? null,
        noAsistencialData.idLegajos ?? []
      );

      console.log("No asistencial dto que quiero guardar", noAsistencialDto);

      this.noAsistencialService.update(this.idNoAsistencial, noAsistencialDto).subscribe(
        (result) => {
          this.toastr.success('No asistencial modificado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();
          /*this.router.navigate(['/personal-no-asistencial'], { state: { noAsistencialModificado: result } }); // Redirijo a la lista de noAsistenciales y paso el noAsistencial modificado */
        },
        (error) => {
          this.toastr.error('Ocurrió un error al crear el No asistencial', error, {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      );
    }
  }

  capitalizeWords(value: string): string {
    return value.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  onNombreInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.noAsistencialForm.get('nombre')?.setValue(formattedValue, { emitEvent: false });
  }
  
  onApellidoInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.noAsistencialForm.get('apellido')?.setValue(formattedValue, { emitEvent: false });
  }

  private dividirCuil(cuil: string): void {
  if (!cuil || cuil.length < 11) return;

  const limpio = cuil.replace(/\D/g, '');

  const prefijo = limpio.substring(0, 2);
  const dni = limpio.substring(2, limpio.length - 1);
  const sufijo = limpio.substring(limpio.length - 1);

  this.noAsistencialForm.patchValue({
    cuilPrefijo: prefijo,
    cuilSufijo: sufijo,
  }, { emitEvent: false });

  this.noAsistencialForm.get('cuilDni')?.setValue(dni, { emitEvent: false });
  }

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  cancel(): void {
    this.toastr.info('No se guardó ninguna modificación.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.location.back();
  }
}