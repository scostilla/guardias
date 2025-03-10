import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenService } from 'src/app/services/login/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selector-roles',
  templateUrl: './selector-roles.component.html',
  styleUrls: ['./selector-roles.component.css']
})
export class SelectorRolesComponent {

  selectedRole!: string;

  nombresRoles: { [key: string]: string } = {
    'ROLE_ADMIN': 'Administrativo',
    'ROLE_USER': 'Usuario',
    'ROLE_DPH': 'DPH',
    'ROLE_SUPERUSER': 'Super usuario',
    'ROLE_AUTORIDAD': 'Autoridad'
  };

  constructor(
    public dialogRef: MatDialogRef<SelectorRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenService: TokenService,
    private router: Router
    ) {}

  // Función para cerrar el diálogo y devolver el rol seleccionado
  onSelectRole(role: string): void {
    this.tokenService.setCurrentRole(role);
    this.dialogRef.close(role);
  }

  // Método para obtener el nombre legible de un rol
  getRoleNombres(role: string): string {
    return this.nombresRoles[role] || role;  // Si no se encuentra el rol, devuelve el rol tal cual
  }

  cancelar(): void {
    // Cierra el diálogo y cierra la sesión
    this.dialogRef.close();
    this.tokenService.logOut(); // Cerrar la sesión
    this.router.navigate(['/']); // Redirige al login
  }
}