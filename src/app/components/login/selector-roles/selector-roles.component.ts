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

  cancelar(): void {
    // Cierra el diálogo y cierra la sesión
    this.dialogRef.close();
    this.tokenService.logOut(); // Cerrar la sesión
    this.router.navigate(['/']); // Redirige al login
  }
}