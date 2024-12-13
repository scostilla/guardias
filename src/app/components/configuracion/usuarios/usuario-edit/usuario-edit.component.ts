import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Usuario } from 'src/app/models/login/Usuario';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { AuthService } from 'src/app/services/login/auth.service';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
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
  nombreUsuarioError: string | null = null;
  private nombreUsuarioInicial: string | null = null;


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
      roles: ['', Validators.required],
      idPerson: ['', Validators.required],
      resetPassword: [false]
    });

    this.loadUsuarioes();
    this.listRoles();


    if (data) {
      this.inputValue = `${data.person!.apellido} ${data.person!.nombre}`; // Guarda el nombre completo
      this.usuarioForm.patchValue({
        idPerson: data.person!.id,
        nombreUsuario: data.nombreUsuario,
        roles: data.roles.map((rol: any) => rol.rolNombre),
        resetPassword: false
      });
      this.nombreUsuarioInicial = data.nombreUsuario;
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

  // Nueva función para verificar si el nombre de usuario ha cambiado
  isNombreUsuarioChanged(): boolean {
    const nombreUsuario = this.usuarioForm.get('nombreUsuario')?.value;
    return nombreUsuario !== this.nombreUsuarioInicial;
  }

  // Método para verificar si el nombre de usuario ya existe
  verificarUsuarioExistente() {
    const nombreUsuario = this.usuarioForm.get('nombreUsuario')?.value;

    if (nombreUsuario && this.isNombreUsuarioChanged()) {
      this.authService.checkUsername(nombreUsuario).subscribe(
        (exists) => {
          if (exists) {
            // Si el nombre de usuario ya existe, establecemos el error
            this.nombreUsuarioError = 'El nombre de usuario ya existe. Por favor elige otro.';
            // Opcional: también podemos marcar el control como inválido si lo deseas
            this.usuarioForm.get('nombreUsuario')?.setErrors({ 'usuarioExiste': true });
          } else {
            // Si el nombre de usuario no existe, limpiamos el error
            this.nombreUsuarioError = null;
            this.usuarioForm.get('nombreUsuario')?.setErrors(null);  // Limpiar los errores
          }
        },
        (error) => {
          console.error('Error al verificar el nombre de usuario', error);
          this.nombreUsuarioError = 'Hubo un problema al verificar el nombre de usuario. Intenta nuevamente.';
          this.usuarioForm.get('nombreUsuario')?.setErrors({ 'checkError': true });
        }
      );
    } else {
      // Si el nombre de usuario no ha cambiado, no realizamos la verificación
      this.nombreUsuarioError = null;
      this.usuarioForm.get('nombreUsuario')?.setErrors(null);  // Limpiar cualquier error
    }
  }

  // Método para abrir el diálogo de confirmación cuando se cambia el estado del checkbox
  onResetPasswordChange(event: any): void {
    const currentStatus = event.checked;

    // Abrir el diálogo de confirmación con el mensaje y el título
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que quieres resetear la contraseña?',
        title: 'Resetear contraseña',
      }
    });

    // Después de que el diálogo se cierre, decidimos qué hacer según la respuesta
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario confirma, actualizamos el estado del checkbox
        this.usuarioForm.patchValue({ resetPassword: true });
      } else {
        // Si el usuario cancela, revertimos el estado
        this.usuarioForm.patchValue({ resetPassword: false });
      }
    });
  }

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Extraemos el apellido y nombre del profesional seleccionado
        const { apellido, nombre } = result;
  
        // Actualizamos el valor legible para mostrarlo en el campo input
        this.inputValue = `${apellido} ${nombre}`;
  
        // Generamos un nuevo nombre de usuario con los nuevos datos
        const nombreUsuarioGenerado = this.generarNombreUsuario(nombre, apellido);
  
        // Siempre actualizamos el nombre de usuario con los nuevos datos
        this.usuarioForm.patchValue({
          nombreUsuario: nombreUsuarioGenerado,
          idPerson: result.id
        });
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
    
  // Método para generar el nombre de usuario automáticamente, normalizando caracteres especiales
  generarNombreUsuario(nombre: string, apellido: string): string {
    // Dividimos el nombre por espacio para obtener las palabras del nombre
    const nombres = nombre.split(' ');
  
    // Tomamos la primera letra de cada nombre
    const iniciales = nombres.map(n => this.normalizarTexto(n.charAt(0).toLowerCase())).join('');
  
    // Normalizamos el apellido y concatenamos la primera letra de cada nombre con el apellido
    const apellidoNormalizado = this.normalizarTexto(apellido.toLowerCase());
  
    // Unimos la primera letra de cada nombre + el apellido completo (normalizado)
    return iniciales + apellidoNormalizado;
  }
  
  normalizarTexto(texto: string): string {
    // Usamos la función normalize() para convertir caracteres acentuados a sus equivalentes sin acento
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
  }

  saveUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
  
      // Establecer la contraseña igual al nombre de usuario solo si es creación y el checkbox no está marcado
      let password = usuarioData.nombreUsuario;
      if (this.data && this.usuarioForm.get('resetPassword')?.value) {
        password = usuarioData.nombreUsuario; // Resetear contraseña al nombre de usuario
      }
  
    // Verificar si el usuario está siendo editado o creado
    if (!this.data || !this.data.id) {
      // Verificar si la persona ya tiene un usuario activo
      this.authService.verificarUsuarioActivo(usuarioData.idPerson).subscribe(
        (isUsuarioActivo) => {
          if (isUsuarioActivo) {
            // Si la persona ya tiene un usuario activo, mostrar advertencia
            this.toastr.warning('La persona ya tiene un usuario activo.', 'Advertencia', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            return; // Salir de la función si ya existe un usuario activo
          } else {
            // Verificar si la persona tiene un legajo activo
            this.authService.verificarLegajoActivo(usuarioData.idPerson).subscribe(
              (isLegajoActivo) => {
                if (!isLegajoActivo) {
                  // Si la persona no tiene un legajo activo, mostrar advertencia
                  this.toastr.warning('No puedes crear un usuario si la persona no tiene un legajo activo.', 'Advertencia', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });
                  return; // Salir de la función si no tiene legajo activo
                } else {
                    // Crear el nuevo usuario
                    const nuevoUsuario = new NuevoUsuario(
                      usuarioData.nombreUsuario,
                      password, // Usar la contraseña ya configurada
                      usuarioData.roles,
                      usuarioData.idPerson,
                      true
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
                },
                (error) => {
                  console.error('Error al verificar el legajo activo:', error);
                }
              );
            }
          },
          (error) => {
            console.error('Error al verificar si el usuario está activo:', error);
          }
        );
      } else {
        // En caso de que se esté actualizando un usuario, simplemente manejamos el cambio de contraseña
        const nuevoUsuario = new NuevoUsuario(
          usuarioData.nombreUsuario,
          password, // Si el checkbox está marcado, se actualiza a nombre de usuario
          usuarioData.roles,
          usuarioData.idPerson,
          true
        );
  
        console.log('Datos a enviar:', nuevoUsuario);
  
        this.authService.update(this.data.id, nuevoUsuario).subscribe(
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
