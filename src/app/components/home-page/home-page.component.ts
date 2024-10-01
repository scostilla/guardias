import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit{

  isLogged = false;
  nombresEfectores: string[] = [];
  selectedEfector: string | null = null;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    if(this.tokenService.getToken()){
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
    }else {
      this.isLogged = false;
    }
  }

  goToProfessionalForm() {
    console.log('redirecting to professional form');
    this.router.navigateByUrl('/professional-form');
  }

  onLogOut(): void{
    this.tokenService.logOut();
    window.location.reload();
  }
}