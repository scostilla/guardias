import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { RegistroPendienteService } from 'src/app/services/registroPendiente.service';


@Component({
  selector: 'app-home-profesional',
  templateUrl: './home-profesional.component.html',
  styleUrls: ['./home-profesional.component.css']
})
export class HomeProfesionalComponent implements OnInit {

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

  constructor(
    private router: Router,
    public dialogReg: MatDialog,
    private efectorService: EfectorService,
    private tokenService: TokenService,
    private authService: AuthService,
    private hospitalService: HospitalService,
    private registroPendienteService: RegistroPendienteService,
    private asistencialService: AsistencialService
    
  ) {}

  ngOnInit(): void {
    this.authService.detailPersonBasicPanelProfessional().subscribe(
      (response: PersonBasicPanelDto) => {
        console.log('Respuesta completa del panel profesional:', response);

        this.idPersona = response.id;
        this.nombre = response.nombre;
        this.apellido = response.apellido;
        // solicitar CUIL desde el servicio del backend si tenemos idPersona
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
        }

        console.log('ID de persona:', this.idPersona);
        console.log('Nombre:', this.nombre);
        console.log('Apellido:', this.apellido);
        console.log('CUIL:', this.cuil);

        if (this.idPersona) {
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
      },
      (error) => {
        console.error('Error al cargar datos del panel', error);
      }
    );

    // Obtener efector desde el servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();
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

  goToProfessionalForm() {
    console.log('Redirecting to professional form');
    this.router.navigateByUrl('/professional-form');
  }

  toggleRegistro() {
    this.showRegistro = !this.showRegistro;
  }

  toggleAsistencia() {
    this.showAsistencia = !this.showAsistencia;
  }

  openRegistroDiarioProfesional() {
    const mes = new Date().getMonth() + 1; // Mes actual
    const anio = new Date().getFullYear(); // Año actual
  
    this.registroPendienteService.tieneRegistroPendiente(this.efectorId!, mes, anio, this.idPersona!)
    .subscribe(
      (registro) => {
        console.log('Registro pendiente:', registro);
        console.log('Mes:', mes, 'Año:', anio, 'ID Asistencial:', this.idPersona);
        
        if (registro) { // Verifico si hay un registro
          // Navegar a egreso con el ID del registro
          this.router.navigate([`/registro-actividades-egreso-profesional`]);
        } else {
          // Si no hay registros pendientes, navegar a ingreso
          this.router.navigate(['/registro-actividades-ingreso-profesional']);
        }
      },
      (error) => {
        console.error('Error al verificar registros pendientes:', error);
        this.router.navigate(['/registro-actividades-ingreso']);
      }
    );
  }

  openMiAsistencia() {
    // Navegar pasando state con efector y asistencial
    const asistencial = {
      id: this.idPersona,
      nombre: this.nombre,
      apellido: this.apellido,
      cuil: this.cuil
    };
    this.router.navigate(['/registro-actividades-profesionales'], {
      state: {
        idEfector: this.efectorId,
        asistencial
      }
    });
  }

  onLogOutProfesional(): void {
  this.tokenService.logOutProfessional();
  this.router.navigate(['/home-hospital']); // vuelve al hospital logueado
}
              
  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
