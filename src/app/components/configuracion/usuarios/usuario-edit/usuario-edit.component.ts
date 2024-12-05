import { Component } from '@angular/core';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent {


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

}
