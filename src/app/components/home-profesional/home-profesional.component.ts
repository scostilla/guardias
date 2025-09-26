import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { RegistroPendienteService } from 'src/app/services/registroPendiente.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';


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
  nombre: string | null = null;
  apellido: string | null = null;
  nombresEfectores: EfectorSummaryDto[] = [];
  ultimoRegistro: RegistroActividad | null = null;
  efectorId: number | null = null;
  efectorFijoId = 96
  selectedEfector: any;

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private efectorService: EfectorService,
    private tokenService: TokenService,
    private authService: AuthService,
    private registroPendienteService: RegistroPendienteService
  ) {}

  ngOnInit(): void {
    // Cargar el efector del administrativo automáticamente
    this.authService.detailPersonBasicPanel().subscribe(
      (response: PersonBasicPanelDto) => {
        if (response.efectores && response.efectores.length > 0) {
          this.selectedEfector = response.efectores[0];
          this.efectorService.setCurrentEfectorId(this.selectedEfector.id);
        } else {
          console.warn('No hay efectores disponibles para este hospital');
        }
      }
    );

  this.authService.detailPersonBasicPanel().subscribe((personDto: PersonBasicPanelDto) => {
    this.idPersona = personDto.id;
    this.nombre = personDto.nombre;
    this.apellido = personDto.apellido;
    console.log('ID de persona:', this.idPersona);
  });
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
    const mes = new Date().getMonth() + 1; // Mes actual
    const anio = new Date().getFullYear(); // Año actual
  
    this.registroPendienteService.tieneRegistroPendiente(this.efectorFijoId, mes, anio, this.idPersona!)
    .subscribe(
      (registro) => {
        console.log('Registro pendiente:', registro);
        console.log('Mes:', mes, 'Año:', anio, 'ID Asistencial:', this.idPersona!);
        
        if (registro) { // Verifico si hay un registro
          // Navegar a egreso con el ID del registro
          this.router.navigate([`/registro-actividades-egreso-profesional`]);
        } else {
          // Si no hay registros pendientes, navegar a ingreso
          this.router.navigate(['/registro-actividades-ingreso-profesional']);
        }
      },
      (error) => {
        console.error('Error al verificar registros pendientes:', error);
        this.router.navigate(['/registro-actividades-ingreso']);
      }
    );
  }

  onLogOutProfesional(): void {
  this.tokenService.logOutProfessional();
  this.router.navigate(['/home-hospital']); // vuelve al hospital logueado
}
              
  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
