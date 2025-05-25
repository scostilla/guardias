import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-registro-diario',
  templateUrl: './registro-diario.component.html',
  styleUrls: ['./registro-diario.component.css']
})
export class RegistroDiarioComponent implements OnInit {

  //Autenticación
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  currentRole: string | null = null;

  constructor(
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
  // Obtener rol actual
  this.tokenService.currentRole$.subscribe(role => {
    this.currentRole = role;
    this.UserRoles();

    if (!this.currentRole) {
      console.warn('No hay un rol seleccionado actualmente.');
    }
  });

  }

  // Roles a usar
  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      // Si no hay rol seleccionado, todos como false
      this.isAdministrativo = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

}