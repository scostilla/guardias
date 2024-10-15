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
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
          this.nombresEfectores = response.efectores;
  
          // Comprueba si hay un efector guardado
          const savedEfectorId = localStorage.getItem('selectedEfectorId');
          if (savedEfectorId) {
            this.selectedEfector = this.nombresEfectores.find(efector => efector.id === Number(savedEfectorId)) || this.nombresEfectores[0];
          } else if (this.nombresEfectores.length > 0) {
            this.selectedEfector = this.nombresEfectores[0];
          }
  
          // Establece el ID del efector actual si hay uno seleccionado
          if (this.selectedEfector) {
            this.asistencialService.setCurrentEfectorId(this.selectedEfector.id);
            this.fetchAsistenciales(this.selectedEfector.id);
          }
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
      this.selectedEfector = null; // Reiniciar el efector seleccionado si no está logueado
    }
  }
    
  onEfectorChange() {
    if (this.selectedEfector) {
      console.log('ID del efector seleccionado:', this.selectedEfector.id);
      this.asistencialService.setCurrentEfectorId(this.selectedEfector.id);
      // Guardar el ID del efector seleccionado en el almacenamiento local
      localStorage.setItem('selectedEfectorId', this.selectedEfector.id.toString());
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
    localStorage.removeItem('selectedEfectorId'); // Limpiar el ID del efector
    window.location.reload(); // Recargar la página
  }
}
