import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';

@Component({
  selector: 'app-asistencial-edit',
  templateUrl: './asistencial-edit.component.html',
  styleUrls: ['./asistencial-edit.component.css']
})
export class AsistencialEditComponent implements OnInit {

  asistencialForm: FormGroup;
  initialData: Asistencial | undefined;
  idAsistencial: number = 0;
  tiposGuardias: TipoGuardia[] = [];
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private router: Router,
    private tipoGuardiaService: TipoGuardiaService,
    private rolService: RolService,
    private authService: AuthService,
    private toastr: ToastrService,

  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      esAsistencial: ['', Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      tiposGuardias: [[], [Validators.required]],
      //email: [''/* , [Validators.required, Validators.email] */],
      //nombreUsuario: [''/* , [Validators.required] */],
      //password: [''/* , [Validators.required] */],
      //roles: [[]/* , [Validators.required] */],
    });

    this.listTipoGuardia();
    this.listRoles();

    // recupera el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.initialData = navigation.extras.state['asistencial'];  // Recibo el asistencial
    }

  }

  ngOnInit(): void {
    if (this.initialData) {
      console.log("asistencial a modificar", this.initialData);
      console.log("nombreUsuario", this.initialData.usuario?.nombreUsuario);
      this.idAsistencial = this.initialData.id ?? 0;
      this.asistencialForm.patchValue({
        ...this.initialData,
        tiposGuardias: this.initialData.tiposGuardias ? this.initialData.tiposGuardias.map((tipoGuardia: any) => tipoGuardia.id) : [],
      });

      console.log("id asis a modificar", this.idAsistencial);
    }
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

  listRoles(): void {
    this.rolService.list().subscribe(data => {
      this.roles = data;
    }, error => {
      console.log(error);
    });
  }

  updateAsistencial(): void {
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
        this.initialData?.usuario?.id ?? 0,
        asistencialData.tiposGuardias
      );

      console.log("asistencial dto que quiero guardar", asistencialDto);

      this.asistencialService.update(this.idAsistencial, asistencialDto).subscribe(
        (result) => {
          this.toastr.success('Asistencial modificado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.router.navigate(['/asistencial'], { state: { asistencialModificado: result } }); // Redirijo a la lista de asistenciales y paso el asistencial modificado
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

    /* const nuevoUsuario = new NuevoUsuario(
      asistencialData.nombreUsuario,
      asistencialData.email,
      asistencialData.password,
      asistencialData.roles
    );
    // Verifica si existe un usuario con el nombreUsuario especificado
    this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
      (existingUsuario) => {
        if (!existingUsuario) {
          // Usuario no encontrado, creamos
          this.createNewUserAndAsistencial(nuevoUsuario, asistencialData);
        } else {
          console.error('El nombre de usuario ya existe.');
        }
      },
      (error) => {
        console.log('Error al buscar el usuario existente', error);
      }
    );
  } */
  }

  /* createNewUserAndAsistencial(nuevoUsuario: NuevoUsuario, asistencialData: any): void {
    //creamos el usuario
    this.authService.create(nuevoUsuario).subscribe(
      () => {
        // buscar el usuario recién creado
        this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
          (newUsuario) => {
            if (newUsuario && newUsuario.id !== undefined) {
              //modifico el asistencial con el id de usuario creado
              this.updateAsistencialDtoAndSave(asistencialData, newUsuario.id);
            }
          },
          (searchError) => {
            console.error('Error al buscar el usuario después de crearlo', searchError);
          }
        );
      },
      (createError) => {
        console.error('Error al crear el usuario', createError);
      }
    );
  } */

  /* updateAsistencialDtoAndSave(asistencialData: any, usuarioId: number): void {
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
      usuarioId,
      asistencialData.tiposGuardias
    );

    console.log("asistencial dto que quiero guardar", asistencialDto);

    this.asistencialService.update(this.idAsistencial,asistencialDto).subscribe(
      (result) => {
        this.toastr.success('Asistencial modificado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/asistencial'], { state: { asistencialModificado: result } }); // Redirigir a la lista de asistenciales y pasar el asistencial modificado
      },
      (error) => {
        this.toastr.error('Ocurrió un error al crear el Asistencial', error, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    );
  } */

  onTipoGuardiaSelectionChange(event: any): void {
    const selectedValues = this.asistencialForm.get('tiposGuardias')!.value;

    // Si se selecciona CONTRAFACTURA, deseleccionar las demás opciones
    if (selectedValues.includes(1)) {
      this.asistencialForm.patchValue({
        tiposGuardias: [1]
      });
    } else if (selectedValues.includes(5)) {
      // Si se selecciona PASIVA, deseleccionar las demás opciones
      this.asistencialForm.patchValue({
        tiposGuardias: [5]
      });
    } else {
      // Si se seleccionan las opciones 2, 3 o 4, permitir que se elijan juntas
      this.asistencialForm.patchValue({
        tiposGuardias: selectedValues.filter((value: number) => value !== 1 && value !== 5)
      });
    }
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

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/asistencial']);
  }
}

