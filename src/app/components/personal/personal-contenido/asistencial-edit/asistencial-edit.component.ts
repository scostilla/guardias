import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-asistencial-edit',
  templateUrl: './asistencial-edit.component.html',
  styleUrls: ['./asistencial-edit.component.css']
})
export class AsistencialEditComponent implements OnInit {

  asistencialForm: FormGroup;
  initialData: Asistencial | undefined;
  idAsistencial: number = 0;

  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private toastr: ToastrService,

  ) {
    this.asistencialForm = this.fb.group({
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
      email: ['', [Validators.required, Validators.email]],
    });


    // recupera el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.initialData = navigation.extras.state['asistencial'];  // Recibo el asistencial
    }

  }

  ngOnInit(): void {
    if (this.initialData) {
      this.idAsistencial = this.initialData.id ?? 0;

      this.asistencialForm.patchValue({
        ...this.initialData,
      });

      // dividir CUIL de BD
      this.dividirCuil(this.initialData.cuil);
    }

    // mantener cuilDni sincronizado si cambian DNI
    this.asistencialForm.get('dni')?.valueChanges.subscribe(dni => {
      this.asistencialForm.get('cuilDni')?.setValue(dni || '', { emitEvent: false });
    });
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.asistencialForm.value);
  }

  updateAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

      asistencialData.nombre = this.capitalizeWords(asistencialData.nombre);
      asistencialData.apellido = this.capitalizeWords(asistencialData.apellido);

      const prefijo = this.asistencialForm.get('cuilPrefijo')?.value;
      const dni = this.asistencialForm.get('dni')?.value;
      const sufijo = this.asistencialForm.get('cuilSufijo')?.value;

      const cuilCompleto = `${prefijo}${dni}${sufijo}`;

      const asistencialDto = new AsistencialDto(
        asistencialData.nombre,
        asistencialData.apellido,
        asistencialData.dni,
        cuilCompleto,
        true, // esAsistencial
        true, // activo
        asistencialData.email,
        asistencialData.fechaNacimiento ?? null,
        asistencialData.sexo ?? null,
        asistencialData.telefono ?? null,
        asistencialData.domicilio ?? null,
        asistencialData.idLegajos ?? [],
      );

      console.log("asistencial dto que quiero guardar", asistencialDto);

      this.asistencialService.update(this.idAsistencial, asistencialDto).subscribe(
        (result) => {
          this.toastr.success('Asistencial modificado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();
        },
        (error) => {
          this.toastr.error('Ocurrió un error al crear el Asistencial', error, {
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
    this.asistencialForm.get('nombre')?.setValue(formattedValue, { emitEvent: false });
  }
  
  onApellidoInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.asistencialForm.get('apellido')?.setValue(formattedValue, { emitEvent: false });
  }

  private dividirCuil(cuil: string): void {
  if (!cuil || cuil.length < 11) return;

  const limpio = cuil.replace(/\D/g, '');

  const prefijo = limpio.substring(0, 2);
  const dni = limpio.substring(2, limpio.length - 1);
  const sufijo = limpio.substring(limpio.length - 1);

  this.asistencialForm.patchValue({
    cuilPrefijo: prefijo,
    cuilSufijo: sufijo,
  }, { emitEvent: false });

  this.asistencialForm.get('cuilDni')?.setValue(dni, { emitEvent: false });
  }
  
  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  cancel(): void {
    this.toastr.info('No se realizó ninguna modificación.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.location.back();
  }
}