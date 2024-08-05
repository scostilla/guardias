import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {
  asistencialForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  initialData: any;
  asistencialId!: number;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private tipoGuardiaService: TipoGuardiaService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      esAsistencial: ['', Validators.required],
      cuil: ['', [Validators.required, Validators.pattern('^([0-9]{2}-[0-9]{8}-[0-9]{1})$')]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      tiposGuardias: [[], [Validators.required]] 
    });

    this.listTipoGuardia();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.asistencialId = +params['id'];
        this.loadAsistencialData(this.asistencialId);
      }
    });

    this.initialData = this.asistencialForm.value;
  }

  loadAsistencialData(id: number): void {
    this.asistencialService.getByIds([id]).subscribe(data => {
      if (data && data.length > 0) {
        this.asistencialForm.patchValue(data[0]); // Asigna el primer elemento del arreglo, ya que getByIds devuelve un arreglo de Asistencial
      }
    });
  }
  
  listTipoGuardia(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tiposGuardias = data;
    }, error => {
      console.log(error);
    });
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

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;
      
      // Limpiar los guiones del CUIL antes de construir el DTO
      const cleanedCuil = asistencialData.cuil.replace(/-/g, '');

      const asistencialDto = new AsistencialDto(
        asistencialData.nombre,
        asistencialData.apellido,
        asistencialData.dni,
        cleanedCuil,  // Usar el CUIL limpio
        asistencialData.fechaNacimiento,
        asistencialData.sexo,
        asistencialData.telefono,
        asistencialData.email,
        asistencialData.domicilio,
        asistencialData.esAsistencial,
        asistencialData.activo,
        asistencialData.tiposGuardias
      );

      if (this.esEdicion && this.asistencialId) {
        this.asistencialService.update(this.asistencialId, asistencialDto).subscribe(
          result => {
            this.toastr.success('Asistencial editado con éxito', 'Éxito', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
        });
            this.router.navigate(['/person']);
          },
          error => {
            console.log(error);
            this.toastr.error('Ocurrió un error inesperado y no se guardaron los cambios', 'Error');
          }
        );
      } else {
        this.asistencialService.save(asistencialDto).subscribe(
          result => {
            this.toastr.success('Asistencial creado con éxito', 'Éxito');
            this.router.navigate(['/person']);
          },
          error => {
            console.log(error);
            this.toastr.error('Ocurrió un error inesperado y no se creo el asistencial', 'Error');
          }
        );
      }
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos.', 'Advertencia');
    }
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
});

    this.router.navigate(['/person']);
  }

  onTipoGuardiaSelectionChange(event: any): void {
    // Lógica para cambios en la selección de tipo de guardia
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.asistencialForm.value);
  }
}



/*import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';


@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {
  asistencialForm: FormGroup;
  initialData: any;
  tiposGuardias: TipoGuardia[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PersonEditComponent>,
    private asistencialService: AsistencialService,
    private tipoGuardiaService: TipoGuardiaService,
    @Inject(MAT_DIALOG_DATA) public data: Asistencial
  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      esAsistencial: ['', Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      tiposGuardias: [[], [Validators.required]] 
    });

    this.listTipoGuardia();

    if (data) {
      this.asistencialForm.patchValue({
        ...data,
        tiposGuardias: data.tiposGuardias ? data.tiposGuardias.map((tipoGuardia: any) => tipoGuardia.id) : []
      });
    }
  }

  ngOnInit(): void {
    this.initialData = this.asistencialForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.asistencialForm.value);
  }

  listTipoGuardia(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tiposGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

      const asistencialDto = new AsistencialDto(
        asistencialData.nombre,
        asistencialData.apellido,
        asistencialData.dni,
        asistencialData.cuil,
        asistencialData.fechaNacimiento,
        asistencialData.sexo,
        asistencialData.telefono,
        asistencialData.email,
        asistencialData.domicilio,
        asistencialData.esAsistencial,
        asistencialData.activo,
        asistencialData.tiposGuardias
      );

      if (this.data && this.data.id) {
        this.asistencialService.update(this.data.id, asistencialDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.asistencialService.save(asistencialDto).subscribe(
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
    this.dialogRef.close({ type: 'cancel' });
  }

  onTipoGuardiaSelectionChange(event: any): void {
    const selectedValues = this.asistencialForm.get('tiposGuardias')!.value;
  
    if (selectedValues.includes(1)) {
      this.asistencialForm.patchValue({
        tiposGuardias: [1]
      });
    } else if (selectedValues.includes(5)) {
      this.asistencialForm.patchValue({
        tiposGuardias: [5]
      });
    } else {
      this.asistencialForm.patchValue({
        tiposGuardias: selectedValues.filter((value: number) => value !== 1 && value !== 5)
      });
    }
  }
}
  */