import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AuthService } from 'src/app/services/login/auth.service';

@Component({
  selector: 'app-asistencial-create',
  templateUrl: './asistencial-create.component.html',
  styleUrls: ['./asistencial-create.component.css']
})

export class AsistencialCreateComponent implements OnInit {

  asistencialForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      domicilio: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ0-9,.#/@\\-° ]{1,90}$')]],
      cuilPrefijo: ['', [Validators.required, Validators.pattern(/^(20|23|27)$/)]],
      cuilDni: [{ value: '', disabled: true }],
      cuilSufijo: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      fechaNacimiento: [''],
      sexo: [''],
      telefono: ['', [Validators.pattern(/^\d{9,30}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit(): void {
    this.asistencialForm.get('dni')?.valueChanges.subscribe(dni => {
      if (!dni) {
        this.asistencialForm.get('cuilDni')?.setValue('', { emitEvent: false });
        return;
      }

      this.asistencialForm.get('cuilDni')?.setValue(dni, { emitEvent: false });
    });
  }

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

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

    this.asistencialService.save(asistencialDto).subscribe(
      (result) => {
        this.toastr.success('Asistencial creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/personal-sin-legajo']); // Redirigir a la lista de asistenciales y pasar el asistencial creado
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal']);
  }
}