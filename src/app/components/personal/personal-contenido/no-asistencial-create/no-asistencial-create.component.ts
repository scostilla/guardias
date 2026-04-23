import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/NoAsistencialDto';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { AuthService } from 'src/app/services/login/auth.service';

@Component({
  selector: 'app-no-asistencial-create',
  templateUrl: './no-asistencial-create.component.html',
  styleUrls: ['./no-asistencial-create.component.css']
})
export class NoAsistencialCreateComponent implements OnInit {

  noAsistencialForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private noAsistencialService: NoAsistencialService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,

  ){
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
      email: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit(): void {
    this.noAsistencialForm.get('dni')?.valueChanges.subscribe(dni => {
      if (!dni) {
        this.noAsistencialForm.get('cuilDni')?.setValue('', { emitEvent: false });
        return;
      }

      this.noAsistencialForm.get('cuilDni')?.setValue(dni, { emitEvent: false });
    });
  }


  saveNoAsistencial(): void {
    if (this.noAsistencialForm.valid) {
      const noAsistencialData = this.noAsistencialForm.value;

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

    console.log("noAsistencial dto que quiero guardar", noAsistencialDto);

    this.noAsistencialService.save(noAsistencialDto).subscribe(
      (result) => {
        this.toastr.success('No Asistencial creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/personal-sin-legajo'], { state: { noAsistencialCreado: result } }); // Redirigir a la lista de no asistenciales y pasar el noAsistencial creado
      },
      (error) => {
        this.toastr.error('Ocurrió un error al crear el No Asistencial', error, {
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal-no-asistencial']);
  }
}