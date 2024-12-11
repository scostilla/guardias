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
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { Rol } from 'src/app/models/Configuracion/Rol';


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
  roles: Rol[] = [];
  hide = true; 


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsuarioEditComponent>,
    private authService: AuthService,
    private rolService: RolService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ){
    this.usuarioForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      idPerson: ['', Validators.required],
    });

    this.loadUsuarioes();
    this.listRoles();


    if (data) {
      console.log('Datos del usuario:', data);
      console.log('Roles:', data.roles);  // Imprime los roles en la consola

      this.inputValue = `${data.person!.apellido} ${data.person!.nombre}`; // Guarda el nombre completo
      this.usuarioForm.patchValue({
        idPerson: data.person!.id,
        nombreUsuario: data.nombreUsuario,
        password: data.password,
        roles: data.roles.map((rol: any) => rol.rolNombre),
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

  listRoles(): void {
    this.rolService.list().subscribe(data => {
      this.roles = data;
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
        this.usuarioForm.patchValue({ idPerson: result.id });
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

  saveUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;

      if (!this.data || !this.data.id) {
        const existing = this.usuarioes.find(a => 
          a.person!.id === usuarioData.idPerson && a.activo === true
        );

        if (existing) {
          this.toastr.warning('El nombre de usuario que estas intentando crear ya existe. Debes usar otro nombre.', 'Advertencia', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          return;
        }
      }

      const nuevoUsuario = new NuevoUsuario(
        usuarioData.nombreUsuario,
        usuarioData.password,
        usuarioData.roles,
        usuarioData.idPerson,
        true,
      );
  
      console.log('Datos a enviar:', nuevoUsuario);

      if (this.data && this.data.id) {
        /*this.authService.update(this.data.id, nuevoUsuario).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );*/
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
