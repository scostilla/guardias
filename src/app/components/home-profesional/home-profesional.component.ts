import { Component, OnInit } from '@angular/core';
import { RegistroDiarioProfesionalComponent } from '../actividades/registro-diario-profesional/registro-diario-profesional.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

@Component({
  selector: 'app-home-profesional',
  templateUrl: './home-profesional.component.html',
  styleUrls: ['./home-profesional.component.css']
})
export class HomeProfesionalComponent implements OnInit {

  showRegistro: boolean = false;
  showAsistencia: boolean = false;
  isLogged = false;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;

      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
          this.nombresEfectores = response.efectores; // Asignar efectores

          // Log para mostrar el usuario y los efectores
          console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario);
          console.log('Efectores asociados:', this.nombresEfectores);
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
      console.log('El usuario no está logueado.');
    }
  }

  goToProfessionalForm() {
    console.log('Redirecting to professional form');
    this.router.navigateByUrl('/professional-form');
  }

  toggleRegistro() {
    this.showRegistro = !this.showRegistro;
  }

  toggleAsistencia() {
    this.showAsistencia = !this.showAsistencia;
  }

  openRegistroDiarioProfesional() {
    this.dialogReg.open(RegistroDiarioProfesionalComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
