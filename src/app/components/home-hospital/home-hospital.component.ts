import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { LoginUsuario } from 'src/app/models/login/login-usuario';
import { MatDialog } from '@angular/material/dialog';
import { CambiarPasswordComponent } from '../login/cambiar-password/cambiar-password.component';

@Component({
  selector: 'app-home-hospital',
  templateUrl: './home-hospital.component.html',
  styleUrls: ['./home-hospital.component.css']
})
export class HomeHospitalComponent implements OnInit {

  nombreUsuario?: string;
  password?: string;
  hide = true;
  selectedEfector: any;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private efectorService: EfectorService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
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
  }

onLogin(): void {
  const loginUsuario = new LoginUsuario(this.nombreUsuario!, this.password!);

  this.authService.login(loginUsuario).subscribe(
    data => {
      // Guardar token y datos SOLO como profesional
      this.tokenService.setProfessionalToken(data.jwt.token);
      this.tokenService.setProfessionalUserName(data.jwt.nombreUsuario);
      this.tokenService.setProfessionalAuthorities(data.jwt.authorities);

      const roles = this.tokenService.getProfessionalAuthorities();

      if (!roles.includes('ROLE_USER')) {
        this.toastr.error(
          'Solo usuarios con rol profesional pueden ingresar desde este login',
          'Acceso denegado',
          {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          }
        );
        this.tokenService.logOutProfessional();
        return;
      }

      if (data.primerLogueo === true) {
        this.openCambiarPasswordDialog();
        return;
      }

      this.tokenService.setCurrentProfessionalRole('ROLE_USER');
      this.router.navigate(['/home-profesional']);
    },
    () => {
      this.toastr.error(
        'Usuario o contraseña incorrectos',
        'Error',
        {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        }
      );
    }
  );
}

openCambiarPasswordDialog(): void {
  const dialogRef = this.dialog.open(CambiarPasswordComponent, {
    width: '400px',
    disableClose: true,
    data: {
      modo: 'PROFESIONAL',
      redirectTo: '/home-hospital'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.password = '';

    if (result === true) {
      this.toastr.success(
          'Contraseña modificada, ingresa con la nueva contraseña.',
          'Éxito',
        { timeOut: 3000, positionClass: 'toast-top-center' }
      );
    }
  });
}
}
