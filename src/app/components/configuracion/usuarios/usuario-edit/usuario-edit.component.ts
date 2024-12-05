import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Usuario } from 'src/app/models/login/Usuario';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { AuthService } from 'src/app/services/login/auth.service';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {

  usuarioForm: FormGroup;
  initialData: any;
  inputValue: string = '';
  usuarioes: Usuario[] = []; 


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsuarioEditComponent>,
    private authService: AuthService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ){
    this.usuarioForm = this.fb.group({
      idPersona: ['', Validators.required],
    });

    this.loadUsuarioes();

    if (data) {
      this.inputValue = `${data.person!.apellido} ${data.person!.nombre}`; // Guarda el nombre completo
      this.usuarioForm.patchValue({
          idPersona: data.person!.id,
      });
  }

}

  ngOnInit(): void {
    this.initialData = this.usuarioForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.usuarioForm.value);
  }

  loadUsuarioes(): void {
    this.authService.list().subscribe(data => {
      this.usuarioes = data; // Guarda la lista de usuarioes
    }, error => {
      console.log(error);
    });
  }

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.usuarioForm.patchValue({ idPersona: result.id });
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }
/*
  saveAutoridad(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;

      if (!this.data || !this.data.id) {
        const existing = this.usuarioes.find(a => 
          a.person!.id === usuarioData.idPersona && a.activo === true
        );

        if (existing) {
          this.toastr.warning('El nombre de usuario que estas intentando crear ya existe.', 'Advertencia', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          return;
        }
      }

      const nuevoUsuario = new NuevoUsuario(
        usuarioData.nombreUsuario,
        usuarioData.email,
        usuarioData.password,
        usuarioData.roles
      );
  
      console.log('Datos a enviar:', nuevoUsuario);

      if (this.data && this.data.id) {
        this.authService.update(this.data.id, nuevoUsuario).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.authService.create(nuevoUsuario).subscribe(
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
*/
  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}


 /* 
       nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]],


 
 saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

      asistencialData.nombre = this.capitalizeWords(asistencialData.nombre);
      asistencialData.apellido = this.capitalizeWords(asistencialData.apellido);

      asistencialData.cuil = asistencialData.cuil.replace(/-/g, '');

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
            console.log("roles para el usuari que se creará", nuevoUsuario);
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
  }   */

