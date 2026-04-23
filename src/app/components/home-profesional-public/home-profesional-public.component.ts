import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { RegistroPendienteService } from 'src/app/services/registroPendiente.service';


@Component({
  selector: 'app-home-profesional-public',
  templateUrl: './home-profesional-public.component.html',
  styleUrls: ['./home-profesional-public.component.css']
})
export class HomeProfesionalPublicComponent implements OnInit, OnDestroy {

  showRegistro: boolean = false;
  showAsistencia: boolean = false;
  userId: number | null = null;
  idPersona: number | null = null;
  nombre: string | null = null;
  apellido: string | null = null;
  nombresEfectores: EfectorSummaryDto[] = [];
  ultimoRegistro: RegistroActividad | null = null;
  efectorId: number | null = null;
  efectorNombre: string | null = null;
  cuil: string | null = null;
  tieneCfActivo: boolean = false;
  misGuardiasPendientesCount = 0;


  private popStateSubscription: any; 

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private efectorService: EfectorService,
    private tokenService: TokenService,
    private authService: AuthService,
    private hospitalService: HospitalService,
    private registroPendienteService: RegistroPendienteService,
    private location: Location,
    private cronoService: CronogramaTentativoService,
    private asistencialService: AsistencialService
    
  ) {}

ngOnInit(): void {
  this.authService.detailPersonBasicPanel().subscribe(
    (response: PersonBasicPanelDto) => {
      console.log('Respuesta completa del panel profesional:', response);

      this.idPersona = response.id;
      this.nombre = response.nombre;
      this.apellido = response.apellido;

      console.log('ID de persona:', this.idPersona);

      // ⬇️ AHORA SÍ, cuando ya tenemos idPersona
      this.actualizarMisGuardiasPendientes();

      if (this.idPersona) {
        this.asistencialService.getPersonCuil(this.idPersona).subscribe({
          next: (cuil) => {
            this.cuil = cuil;
            console.log('CUIL obtenido desde backend:', this.cuil);
          },
          error: (err) => {
            console.warn('No se pudo obtener CUIL desde backend:', err);
          }
        });

        this.asistencialService.tieneCf(this.idPersona).subscribe({
          next: (resp) => {
            this.tieneCfActivo = resp;
          },
          error: (err) => {
            console.error('Error al verificar CF:', err);
            this.tieneCfActivo = false;
          }
        });
      }

      console.log('Nombre:', this.nombre);
      console.log('Apellido:', this.apellido);
      console.log('CUIL:', this.cuil);
    },
    (error) => {
      console.error('Error al cargar datos del panel', error);
    }
  );

  // Esto puede quedar fuera
  this.efectorId = this.efectorService.getCurrentEfectorId();
  this.loadEfectorName();

  this.popStateSubscription = this.location.subscribe(() => {
    this.onLogOut();
  });
}

  loadEfectorName(): void {
    if (this.efectorId) {
      this.hospitalService.getById(this.efectorId).subscribe(
        (efector: Efector) => {
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

  private actualizarMisGuardiasPendientes(): void {
    if (this.idPersona) {
      this.cronoService
        .countPendientesByAsistencial(this.idPersona)
        .subscribe({
          next: count => this.misGuardiasPendientesCount = count,
          error: () => this.misGuardiasPendientesCount = 0
        });
    } else {
      this.misGuardiasPendientesCount = 0;
    }
  }

  goToProfessionalForm() {
    console.log('Redirecting to professional form');
    this.router.navigateByUrl('/professional-fhttp://localhost:4200/loginorm');
  }

  toggleRegistro() {
    this.showRegistro = !this.showRegistro;
  }

  toggleAsistencia() {
    this.showAsistencia = !this.showAsistencia;
  }

  openRegistro() {
    // Navegar pasando state con efector y asistencial
    const asistencial = {
      id: this.idPersona,
      nombre: this.nombre,
      apellido: this.apellido,
      cuil: this.cuil
    };
    this.router.navigate(['/guardias-pendientes-profesionales'], {
      state: {
        asistencial
      }
    });
  }

  openMiAsistencia() {
    // Navegar pasando state con efector y asistencial
    const asistencial = {
      id: this.idPersona,
      nombre: this.nombre,
      apellido: this.apellido,
      cuil: this.cuil
    };
    this.router.navigate(['/registro-actividades-profesionales-public'], {
      state: {
        asistencial
      }
    });
  }

  ngOnDestroy(): void {
      if (this.popStateSubscription) {
        this.popStateSubscription.unsubscribe?.();
      }
    }

  /*onLogOutProfesional(): void {
  this.tokenService.logOut();
  this.router.navigate(['/login']); // vuelve al login
}*/
              
  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
