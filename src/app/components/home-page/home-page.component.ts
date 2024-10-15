import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit{

  isLogged = false;
  nombresEfectores: EfectorSummaryDto[] = [];
  selectedEfector: EfectorSummaryDto | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';


  constructor(
    private router: Router,
    private tokenService: TokenService,
  
    private http: HttpClient,
    private authService: AuthService,

  ) {}

    ngOnInit(): void {
      if (this.tokenService.getToken()) {
        this.isLogged = true;
  
       // Obtener nombres efectores asociados
       this.authService.detailPersonBasicPanel()
       .subscribe(
         response => {
           if ( response.nombresEfectores.length > 0) {
            this.nombresEfectores = response.nombresEfectores;
            this.selectedEfector = this.nombresEfectores[0];
          }
         },
         error => {
           console.error('Error al obtener efectores asociados:', error);
         }
       );
  
      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel()
        .subscribe(
          (response: PersonBasicPanelDto) => {
            // Log para mostrar el usuario
            this.nombreUsuario = response.nombre;
            this.apellidoUsuario = response.apellido;
            console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario);
            
            // Obtener nombres efectores asociados
            if (response.efectores.length > 0) {
              this.nombresEfectores = response.efectores;
              this.selectedEfector = this.nombresEfectores[0];
            }

            // Log para mostrar los efectores
            console.log('Efectores asociados:', this.nombresEfectores);
          },
          error => {
            console.error('Error al obtener detalles del usuario:', error);
          }
        );
    } else {
        this.isLogged = false;
      }
    }

  goToProfessionalForm() {
    console.log('redirecting to professional form');
    this.router.navigateByUrl('/professional-form');
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
