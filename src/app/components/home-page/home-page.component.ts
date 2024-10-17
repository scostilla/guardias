import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  isLogged = false;
  nombresEfectores: EfectorSummaryDto[] = [];
  selectedEfector: EfectorSummaryDto | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private asistencialService: AsistencialService
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
  
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.nombresEfectores = response.efectores;

          // Cargar el efector seleccionado desde el BehaviorSubject
          const savedEfectorId = this.asistencialService.getCurrentEfectorId(); // Método para obtener el ID del efector actual
          
          if (savedEfectorId) {
            this.selectedEfector = this.nombresEfectores.find(efector => efector.id === savedEfectorId) || this.nombresEfectores[0];
          } else {
            this.selectedEfector = this.nombresEfectores[0]; // Si no hay efector guardado, selecciona el primero
          }

          // Establece el ID en el BehaviorSubject
          this.asistencialService.setCurrentEfectorId(this.selectedEfector.id);
          this.fetchAsistenciales(this.selectedEfector.id);
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
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
