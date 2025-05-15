import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/login/Usuario';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent implements OnInit {

  usuario!: Usuario;
  rolesString: string = '';

  nombresRoles: { [key: string]: string } = {
    'ROLE_ADMIN': 'Administrativo',
    'ROLE_USER': 'Usuario',
    'ROLE_DPH': 'DPH',
    'ROLE_SUPERUSER': 'Super usuario',
    'ROLE_AUTORIDAD': 'Autoridad'
  };

  constructor(
    private dialogRef: MatDialogRef<UsuarioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario 
  ) { }

  ngOnInit(): void {
    this.usuario = this.data;

    // Aquí convertimos los roles a una cadena legible
    if (this.usuario.roles && this.usuario.roles.length > 0) {
      this.rolesString = this.usuario.roles
        .map((rol: any) => this.nombresRoles[rol.rolNombre] || rol.rolNombre)
        .join(', ');
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
