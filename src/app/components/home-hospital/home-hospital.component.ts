import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { LoginUsuario } from 'src/app/models/login/login-usuario';

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
    private toastr: ToastrService
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
      this.tokenService.setProfessionalToken(data.token);
      this.tokenService.setProfessionalUserName(data.nombreUsuario);
      this.tokenService.setProfessionalAuthorities(data.authorities);

      const roles = this.tokenService.getProfessionalAuthorities();

      if (roles.includes('ROLE_USER')) {
        // Si el login es correcto y el rol es profesional
        this.tokenService.setCurrentRole('ROLE_USER');
        this.router.navigate(['/home-profesional']);
      } else {
        // Si no es profesional, no lo dejamos pasar
        this.toastr.error(
          'Solo usuarios con rol profesional pueden ingresar desde este login',
          'Acceso denegado', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          }
        );
        this.tokenService.logOutProfessional();
      }
    },
    err => {
      this.toastr.error('Usuario o contraseña incorrectos', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
    }
  );
}
}
