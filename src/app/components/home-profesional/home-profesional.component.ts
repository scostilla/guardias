import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { RegistroPendienteService } from 'src/app/services/registroPendiente.service';

@Component({
  selector: 'app-home-profesional',
  templateUrl: './home-profesional.component.html',
  styleUrls: ['./home-profesional.component.css']
})
export class HomeProfesionalComponent {

  showRegistro: boolean = false;
  showAsistencia: boolean = false;
  isLogged = false;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  ultimoRegistro: RegistroActividad | null = null;
  usuarioPersona: number | null = null;

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private registroActividadService: RegistroActividadService,
    private registroPendienteService: RegistroPendienteService
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;

      const userId = this.tokenService.getUserIdFromToken();
      console.log('ID del usuario logeado:', userId);

      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
          this.nombresEfectores = response.efectores; // Asignar efectores

          // Log para mostrar el usuario y los efectores
          console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario, this.usuarioPersona);
          console.log('Efectores asociados:', this.nombresEfectores);
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
  } else {
      this.isLogged = false;
      console.log('El usuario no está logueado.');
      this.router.navigateByUrl('');
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
    const idEfector = 43; // ID estático para prueba
    const mes = new Date().getMonth() + 1; // Mes actual
    const anio = new Date().getFullYear(); // Año actual
  
    this.registroPendienteService.detailByEfectorAndFechaAndAsistencial(idEfector, mes, anio, this.usuarioPersona!)
    .subscribe(
      (registro) => {
        console.log('Registro pendiente:', registro);
        console.log('Mes:', mes, 'Año:', anio, 'ID Asistencial:', this.usuarioPersona);
        
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
