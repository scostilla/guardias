import { Component, OnInit } from '@angular/core';
import { RegistroDiarioProfesionalComponent } from '../actividades/registro-diario-profesional/registro-diario-profesional.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-home-profesional',
  templateUrl: './home-profesional.component.html',
  styleUrls: ['./home-profesional.component.css']
})
export class HomeProfesionalComponent {

  showRegistro: boolean = false;
  showAsistencia: boolean = false;
  isLogged = false;

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  goToProfessionalForm() {
    console.log('redirecting to professional form');
    this.router.navigateByUrl('/professional-form');
  }

  toggleRegistro() {
    this.showRegistro = !this.showRegistro;
  }

  toggleAsistencia() {
    this.showAsistencia = !this.showAsistencia;
  }

  openRegistroDiarioProfesional() {
    this.dialogReg.open(RegistroDiarioProfesionalComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}

