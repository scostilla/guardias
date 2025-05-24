import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { RegistroPendienteService } from 'src/app/services/registroPendiente.service';

@Component({
  selector: 'app-home-profesional',
  templateUrl: './home-profesional.component.html',
  styleUrls: ['./home-profesional.component.css']
})
export class HomeProfesionalComponent implements OnInit {

  showRegistro: boolean = false;
  showAsistencia: boolean = false;
  userId: number | null = null;
  idPersona: number | null = null;
  nombresEfectores: EfectorSummaryDto[] = [];
  ultimoRegistro: RegistroActividad | null = null;

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private tokenService: TokenService,
    private registroPendienteService: RegistroPendienteService
  ) {}

  ngOnInit(): void {
    const userId = this.tokenService.getUserIdFromToken();
    const idPersona = userId !== null ? Number(userId) : null;
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
    const idEfector = 43; // ID estático para prueba
    const mes = new Date().getMonth() + 1; // Mes actual
    const anio = new Date().getFullYear(); // Año actual
  
    this.registroPendienteService.detailByEfectorAndFechaAndAsistencial(idEfector, mes, anio, this.idPersona!)
    .subscribe(
      (registro) => {
        console.log('Registro pendiente:', registro);
        console.log('Mes:', mes, 'Año:', anio, 'ID Asistencial:', this.idPersona!);
        
        if (registro) { // Verificamos si hay un registro
          // Navegar a egreso con el ID del registro
          this.router.navigate([`/registro-actividades-egreso/${registro.id}`]);
        } else {
          // Si no hay registros pendientes, navegar a ingreso
          this.router.navigate(['/registro-actividades-ingreso']);
        }
      },
      (error) => {
        console.error('Error al verificar registros pendientes:', error);
        this.router.navigate(['/registro-actividades-ingreso']);
      }
    );
  }
              
  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
