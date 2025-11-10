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
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,20}$/)]],
      domicilio: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ0-9,.#/@\\-° ]{1,90}$')]],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],
      fechaNacimiento: [''],
      sexo: [''],
      telefono: ['', [Validators.pattern(/^\d{9,30}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit(): void {
    
  }

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

      asistencialData.cuil = asistencialData.cuil.replace(/-/g, '');

    const asistencialDto = new AsistencialDto(
      asistencialData.nombre,
      asistencialData.apellido,
      asistencialData.dni,
      asistencialData.cuil,
      asistencialData.fechaNacimiento,
      true, // esAsistencial
      true, // activo
      asistencialData.email,
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

  formatCuil(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Elimina todos los caracteres que no son dígitos
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)/, '$1-$2'); // Añade un guion después de los primeros 2 dígitos
    }
    if (value.length > 10) {
      value = value.replace(/^(\d{2})-(\d{8})(\d+)/, '$1-$2-$3'); // Añade otro guion después de los siguientes 8 dígitos
    }
    event.target.value = value;
    this.asistencialForm.get('cuil')?.setValue(value, { emitEvent: false });
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