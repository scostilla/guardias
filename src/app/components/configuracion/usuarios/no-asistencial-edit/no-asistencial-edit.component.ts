import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/NoAsistencialDto';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';

@Component({
  selector: 'app-no-asistencial-edit',
  templateUrl: './no-asistencial-edit.component.html',
  styleUrls: ['./no-asistencial-edit.component.css']
})
export class NoAsistencialEditComponent implements OnInit {
  noAsistencialForm: FormGroup;
  initialData: any;
  idNoAsistencial: number = 0;
  roles: Rol[] = [];
  
  constructor(
    private fb: FormBuilder,
    private noAsistencialService: NoAsistencialService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.noAsistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      esAsistencial: [true, Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      //email: [''/* , [Validators.required, Validators.email] */],
      //nombreUsuario: [''/* , [Validators.required] */],
      //password: [''/* , [Validators.required] */],
      //roles: [[]/* , [Validators.required] */],
    });

    // recupera el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.initialData = navigation.extras.state['noAsistencial'];  // Recibo el no asistencial
    }
  }

  ngOnInit(): void {
    if (this.initialData) {
      console.log("noAsistencial a modificar", this.initialData);
      console.log("nombreUsuario", this.initialData.usuario?.nombreUsuario);
      this.idNoAsistencial = this.initialData.id ?? 0;
      this.noAsistencialForm.patchValue({
        ...this.initialData
      });

      console.log("id noAsis a modificar", this.idNoAsistencial);
    }
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.noAsistencialForm.value);
  }

  updateNoAsistencial(): void {
    if (this.noAsistencialForm.valid) {
      const noAsistencialData = this.noAsistencialForm.value;

      noAsistencialData.nombre = this.capitalizeWords(noAsistencialData.nombre);
      noAsistencialData.apellido = this.capitalizeWords(noAsistencialData.apellido);

      noAsistencialData.cuil = noAsistencialData.cuil.replace(/-/g, '');

      const noAsistencialDto = new NoAsistencialDto(
        noAsistencialData.nombre,
        noAsistencialData.apellido,
        noAsistencialData.dni,
        noAsistencialData.cuil,
        noAsistencialData.fechaNacimiento,
        noAsistencialData.sexo,
        noAsistencialData.telefono,
        noAsistencialData.email,
        noAsistencialData.domicilio,
        noAsistencialData.esAsistencial,
        noAsistencialData.activo,
        this.initialData?.usuario?.id ?? 0
      );

      console.log("No asistencial dto que quiero guardar", noAsistencialDto);

      this.noAsistencialService.update(this.idNoAsistencial, noAsistencialDto).subscribe(
        (result) => {
          this.toastr.success('No asistencial modificado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.router.navigate(['/personal-no-asistencial'], { state: { noAsistencialModificado: result } }); // Redirijo a la lista de noAsistenciales y paso el noAsistencial modificado
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

  formatCuil(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Elimina todos los caracteres que no son dígitos
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)/, '$1-$2'); // Añade un guion después de los primeros 2 dígitos
    }
    if (value.length > 10) {
      value = value.replace(/^(\d{2})-(\d{8})(\d+)/, '$1-$2-$3'); // Añade otro guion después de los siguientes 8 dígitos
    }
    event.target.value = value;
    this.noAsistencialForm.get('cuil')?.setValue(value, { emitEvent: false });
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
    this.router.navigate(['/personal-no-asistencial']);
  }
}