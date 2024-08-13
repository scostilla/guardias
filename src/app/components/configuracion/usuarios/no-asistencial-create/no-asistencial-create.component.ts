import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/noAsistencial/NoAsistencialDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';
@Component({
  selector: 'app-no-asistencial-create',
  templateUrl: './no-asistencial-create.component.html',
  styleUrls: ['./no-asistencial-create.component.css']
})
export class NoAsistencialCreateComponent implements OnInit{
  noAsistencialForm: FormGroup;
  initialData: any;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NoAsistencialCreateComponent>,
    private noAsistencialService: NoAsistencialService,
    private rolService: RolService,
    private authService: AuthService,

    @Inject(MAT_DIALOG_DATA) public data: NoAsistencial
  ) {
    // Inicializo el formulario
    this.noAsistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      esAsistencial: ['', Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.pattern(/^\d{9,30}$/)]],
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]]
    });

    this.listRoles();

    if (data) {
      this.noAsistencialForm.patchValue({
        ...data,
        roles: data.usuario ? data.usuario.roles.map((rol: any) => rol.id) : []
      });
    }
  }

  ngOnInit(): void {
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.noAsistencialForm.value);
  }

  listRoles(): void {
    this.rolService.list().subscribe(data => {
      this.roles = data;
    }, error => {
      console.log(error);
    });
  }

  saveNoAsistencial(): void {
    if (this.noAsistencialForm.valid) {
      const noAsistencialData = this.noAsistencialForm.value;

      const nuevoUsuario = new NuevoUsuario(
        noAsistencialData.nombreUsuario,
        noAsistencialData.email,
        noAsistencialData.password,
        noAsistencialData.roles
      );
      // Verifica si existe un usuario con el nombreUsuario especificado
      this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
        (existingUsuario) => {
          if (!existingUsuario) {
            // Usuario no encontrado, creamos
            this.createNewUserAndNoAsistencial(nuevoUsuario, noAsistencialData);
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

  createNewUserAndNoAsistencial(nuevoUsuario: NuevoUsuario, noAsistencialData: any): void {
    //creamos el usuario
    this.authService.create(nuevoUsuario).subscribe(
      () => {
        // buscar el usuario recién creado
        this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
          (newUsuario) => {
            if (newUsuario && newUsuario.id !== undefined) {
              //creo el asistencial con el id de usuario creado
              this.createNoAsistencialDtoAndSave(noAsistencialData, newUsuario.id);
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

  createNoAsistencialDtoAndSave(noAsistencialData: any, usuarioId: number): void {
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
      usuarioId
    );

    this.noAsistencialService.save(noAsistencialDto).subscribe(
      result => {
        this.dialogRef.close({ type: 'save', data: result });
      },
      error => {
        console.error('Error al guardar el no asistencial', error);
        this.dialogRef.close({ type: 'error', data: error });
      }
    );
  }

  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }

}
