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
    private asistencialService: AsistencialService // Inyectamos el servicio de asistenciales
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;

      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;

          if (response.efectores.length > 0) {
            this.nombresEfectores = response.efectores;
            this.selectedEfector = this.nombresEfectores[0];
          }
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
    }
  }

  onEfectorChange() {
    if (this.selectedEfector) {
      console.log('ID del efector seleccionado:', this.selectedEfector.id); // Verifica que el id se esté imprimiendo correctamente
      this.asistencialService.setCurrentEfectorId(this.selectedEfector.id);
      this.fetchAsistenciales(this.selectedEfector.id);
    }
  }
      
  fetchAsistenciales(efectorId: number) {
    this.asistencialService.listByEfectorAndTipoGuardia(efectorId).subscribe(
      (asistenciales) => {
        console.log('Asistenciales filtrados para efector ID:', efectorId, asistenciales);
        // Aquí puedes manejar los datos de asistenciales según lo necesites
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
    this.tokenService.logOut();
    window.location.reload();
  }
}
