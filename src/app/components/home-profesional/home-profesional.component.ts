import { Component, OnInit } from '@angular/core';
import { RegistroDiarioProfesionalComponent } from '../actividades/registro-diario-profesional/registro-diario-profesional.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';

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
  ultimoRegistro: RegistroActividad | null = null;

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private registroActividadService: RegistroActividadService
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
    this.registroActividadService.getLastActiveRegistro().subscribe(
      (registro) => {
        this.ultimoRegistro = registro; // Asigna el último registro a la variable
  
        if (this.ultimoRegistro) {
          // Verificamos si la fecha de egreso es null o una cadena vacía
          if (!this.ultimoRegistro.fechaEgreso) {
            // Si hay un registro, pero sin fecha de egreso
            this.router.navigateByUrl(`/registro-actividades-egreso/${this.ultimoRegistro.id}`);
          } else {
            // Si hay un registro con fecha de egreso
            this.router.navigateByUrl('/registro-actividades-ingreso');
          }
        } else {
          // Si no existe ningún registro
          this.router.navigateByUrl('/registro-actividades-ingreso');
        }
      },
      (error) => {
        console.error('Error al obtener el último registro activo:', error);
        // Manejar el error, por ejemplo, redirigir a la página de ingreso
        this.router.navigateByUrl('/registro-actividades-ingreso');
      }
    );
  }

  cargarRegistro(): void {
    const id = 3; // ID que deseas enviar
    console.log('ID enviado desde el componente inicial:', id);
    this.registroActividadService.setRegistroId(id);
    this.router.navigate(['/registro-actividades-egreso']);
  }
    
  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
