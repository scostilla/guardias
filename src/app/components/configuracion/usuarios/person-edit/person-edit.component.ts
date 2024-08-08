import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { error } from 'console';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { PersonDto } from 'src/app/dto/Configuracion/PersonDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {
  asistencialForm: FormGroup;
  initialData: any;
  tiposGuardias: TipoGuardia[] = [];
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PersonEditComponent>,
    private asistencialService: AsistencialService,
    private tipoGuardiaService: TipoGuardiaService,
    private rolService: RolService,
    private authService: AuthService,

    @Inject(MAT_DIALOG_DATA) public data: Asistencial
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
      telefono: ['', [Validators.pattern(/^\d{9,30}$/)]],
      tiposGuardias: [[], [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]]
    });

    this.listTipoGuardia();
    this.listRoles();

    if (data) {
      this.asistencialForm.patchValue({
        ...data,
        tiposGuardias: data.tiposGuardias ? data.tiposGuardias.map((tipoGuardia: any) => tipoGuardia.id) : [],
        roles: data.usuario ? data.usuario.roles.map((rol: any) => rol.id) : []
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

  listRoles(): void {
    this.rolService.list().subscribe(data => {
      this.roles = data;
    }, error => {
      console.log(error);
    });
  }

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

      const nuevoUsuario = new NuevoUsuario(
        asistencialData.nombreUsuario,
        asistencialData.email,
        asistencialData.password,
        asistencialData.roles
      );

      console.log('Verificando existencia del usuario:', nuevoUsuario.nombreUsuario);

      // Verifica si existe un usuario con el nombreUsuario especificado
      this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
        (existingUsuario) => {
          if (existingUsuario && existingUsuario.id != undefined) {
            console.error('El nombre de usuario ya existe.');
          }else {
            console.error('Error: No se pudo encontrar el usuario, aunque la respuesta no fue un error 404.');
        }
        },
        (error) => {
          if (error.status === 404) {
            console.log('Usuario no encontrado, procediendo a crear uno nuevo.');
            // Usuario no encontrado, a crearlo
            this.createNewUserAndAsistencial(nuevoUsuario, asistencialData);
        } else {
            console.error('Error al buscar el usuario existente', error);
        }
        }
      );
    }
  }

  createNewUserAndAsistencial(nuevoUsuario: NuevoUsuario, asistencialData: any): void {
    console.log("nuevo usuario" , nuevoUsuario.nombreUsuario , nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.roles);
    this.authService.create(nuevoUsuario).subscribe(
        () => {

          console.log('Usuario creado exitosamente:', nuevoUsuario.nombreUsuario);
            // Una vez creado, buscar el usuario recién creado

            this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
                (newUsuario) => {
                    if (newUsuario && newUsuario.id !== undefined) {
                      console.log('Usuario encontrado después de la creación:', newUsuario);
                        this.createAsistencialDtoAndSave(asistencialData, newUsuario.id);
                    } else {
                        console.error('Error: No se pudo encontrar el nuevo usuario después de crearlo.');
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
}

  createAsistencialDtoAndSave(asistencialData: any, usuarioId: number): void {
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

    console.log('Guardando asistencial:', asistencialDto);
    this.saveOrUpdateAsistencial(asistencialDto);
  }

  saveOrUpdateAsistencial(asistencialDto: AsistencialDto): void {

    if (this.data && this.data.id) {
      this.asistencialService.update(this.data.id, asistencialDto).subscribe(
        result => {
          this.dialogRef.close({ type: 'save', data: result });
        },
        error => {
          console.error('Error al actualizar el asistencial', error);
          this.dialogRef.close({ type: 'error', data: error });
        }
      );
    } else {
      this.asistencialService.save(asistencialDto).subscribe(
        result => {
          this.dialogRef.close({ type: 'save', data: result });
        },
        error => {
          console.error('Error al guardar el asistencial', error);
          this.dialogRef.close({ type: 'error', data: error });
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }

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
}