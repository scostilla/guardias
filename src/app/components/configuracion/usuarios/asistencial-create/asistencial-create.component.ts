import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';

@Component({
  selector: 'app-asistencial-create',
  templateUrl: './asistencial-create.component.html',
  styleUrls: ['./asistencial-create.component.css']
})
export class AsistencialCreateComponent implements OnInit {
  asistencialForm: FormGroup;
  initialData: any;
  tiposGuardias: TipoGuardia[] = [];
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AsistencialCreateComponent>,
    private asistencialService: AsistencialService,
    private tipoGuardiaService: TipoGuardiaService,
    private rolService: RolService,
    private authService: AuthService,

    @Inject(MAT_DIALOG_DATA) public data: Asistencial
  ) {
    // Inicializo el formulario
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
    }
  }

  createNewUserAndAsistencial(nuevoUsuario: NuevoUsuario, asistencialData: any): void {
    //creamos el usuario
    this.authService.create(nuevoUsuario).subscribe(
      () => {
        // buscar el usuario recién creado
        this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
          (newUsuario) => {
            if (newUsuario && newUsuario.id !== undefined) {
              //creo el asistencial con el id de usuario creado
              this.createAsistencialDtoAndSave(asistencialData, newUsuario.id);
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
