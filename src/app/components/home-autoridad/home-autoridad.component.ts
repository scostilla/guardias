import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';

@Component({
  selector: 'app-home-autoridad',
  templateUrl: './home-autoridad.component.html',
  styleUrls: ['./home-autoridad.component.css'],
})
export class HomeAutoridadComponent implements OnInit {
  isLogged = false;
  nombresEfectores: EfectorSummaryDto[] = [];
  selectedEfector: EfectorSummaryDto | null = null;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private asistencialService: AsistencialService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
  
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      console.log('Usuario logeado, token encontrado');
  
      const userId = this.tokenService.getUserIdFromToken();
      console.log('ID del usuario logeado:', userId);
  
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          console.log('Respuesta de detailPersonBasicPanel:', response);
  
          this.nombresEfectores = response.efectores;
          console.log('Efectores obtenidos:', this.nombresEfectores);
  
          // Verificar que el arreglo de efectores no esté vacío antes de asignar el primer efector
          if (this.nombresEfectores && this.nombresEfectores.length > 0) {
            console.log('Efectores disponibles, iniciando selección del efector');
            
            const savedEfectorId = this.asistencialService.getCurrentEfectorId(); // Obtener el ID del efector actual
            console.log('ID del efector guardado:', savedEfectorId);
  
            if (savedEfectorId) {
              this.selectedEfector = this.nombresEfectores.find(efector => efector.id === savedEfectorId) || this.nombresEfectores[0];
              console.log('Efector seleccionado según el ID guardado:', this.selectedEfector);
            } else {
              this.selectedEfector = this.nombresEfectores[0]; // Si no hay efector guardado, selecciona el primero
              console.log('No se encontró un efector guardado, seleccionando el primer efector:', this.selectedEfector);
            }
  
            // Establece el ID en el BehaviorSubject
            this.asistencialService.setCurrentEfectorId(this.selectedEfector.id);
            console.log('ID del efector seleccionado guardado en el BehaviorSubject:', this.selectedEfector.id);
            
            // Fetch asistenciales
            this.fetchAsistenciales(this.selectedEfector.id);
  
          } else {
            console.warn('No hay efectores disponibles');
            this.selectedEfector = null;
          }
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
      console.log('No hay token, el usuario no está logeado');
      this.selectedEfector = null;
    }
  }
        
  onEfectorChange() {
    if (this.selectedEfector) {
      this.asistencialService.setCurrentEfectorId(this.selectedEfector.id);
      this.fetchAsistenciales(this.selectedEfector.id);
    }
  }
  
  fetchAsistenciales(efectorId: number) {
    this.asistencialService.listByEfectorAndTipoGuardia(efectorId).subscribe(
      (asistenciales) => {
        console.log('Asistenciales filtrados para efector ID:', efectorId, asistenciales);
      },
      (error) => {
        console.error('Error al obtener asistenciales:', error);
      }
    );
  }

  goToProfessionalForm() {
    this.router.navigateByUrl('/professional-form');
  }

  onLogOut(): void {
    this.tokenService.logOut(); // Limpiar el sessionStorage
    this.asistencialService.setCurrentEfectorId(null); // Reiniciar el ID del efector
    window.location.reload(); // Recargar la página
  }
}
