import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { HabilitacionesGeneralesService } from 'src/app/services/Configuracion/habilitacionesGenerales.service';
import { HabilitacionesGenerales } from 'src/app/models/Configuracion/HabilitacionesGenerales';


//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {

  efectores: Efector[] = [];

  //Autenticación
  isLogged = false;
  roles: string[] =[];
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  usuarioPersona: number | null = null;

  selectedListEfectores: number | null = null;
  selectedEfector: EfectorSummaryDto | null = null;
  dropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private hospitalService: HospitalService,
    private habilitacionesGeneralesService: HabilitacionesGeneralesService,
    private asistencialService: AsistencialService,
    private efectorService: EfectorService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
  
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();

      this.UserRoles();
  
      console.log('Usuario logeado, token encontrado');
  
      const userId = this.tokenService.getUserIdFromToken();
      console.log('ID del usuario logeado:', userId);
  
      // Selección de Efector según el rol
      if (this.isDph || this.isSuper) {
        // Carga los efectores para DPH o Super
        this.loadEfectoresForDphOrSuper();
      } else if (this.isAdministrativo) {
        // Carga los efectores para Administrativos
        this.loadEfectorForAdministrativo();
      /*} else if (this.isAutoridad) {
        // Carga los efectores para Autoridades
        this.loadEfectoresForAutoridades(idPersona);*/ //habilitar cuando tenga id en PersonBasicPanelDto
      } else {
        console.warn('El usuario no tiene un rol válido para proceder');
      }

    } else {
      this.isLogged = false;
      console.log('No hay token, el usuario no está logeado');
      this.selectedEfector = null;
      this.selectedListEfectores = null; 
    }
  }

  //Roles a usar
  UserRoles(): void {
    this.isAdministrativo = this.roles.includes('ROLE_ADMIN');
    this.isUsuario = this.roles.includes('ROLE_USER');
    this.isDph = this.roles.includes('ROLE_DPH');
    this.isSuper = this.roles.includes('ROLE_SUPERUSER');
    this.isAutoridad = this.roles.includes('ROLE_AUTORIDAD');
  }

  // Carga el efector para el rol 'Dph y Super'
  loadEfectoresForDphOrSuper(): void {
    // Primero, intentamos recuperar el id previamente seleccionado desde el servicio
    const previouslySelectedId = this.efectorService.getCurrentEfectorId();
    if (previouslySelectedId) {
      this.selectedListEfectores = previouslySelectedId;
      console.log('Efector previamente seleccionado:', this.selectedListEfectores);
    } else {
      this.selectedListEfectores = null; // Si no hay id guardado, inicializamos como null
    }
  
    // Luego, obtenemos la lista de efectores
    this.hospitalService.list().subscribe(
      (efectores: Efector[]) => {
        console.log('Lista de efectores obtenida para DPH o Super:', efectores);
        this.efectores = efectores;
  
        // Si no hay un id guardado y la lista no está vacía, aseguramos que el valor de selectedListEfectores sea null
        if (!previouslySelectedId) {
          this.selectedListEfectores = null;
        }
  
        // Si la lista de efectores tiene datos y el id es válido, lo podemos guardar en el servicio
        if (this.efectores.length > 0 && this.selectedListEfectores !== null) {
          this.efectorService.setCurrentEfectorId(this.selectedListEfectores);
          console.log('ID del efector seleccionado para DPH o Super:', this.selectedListEfectores);
        } else {
          // Si no hay efectores o si selectedListEfectores es null, limpiamos el valor
          console.warn('No hay efectores disponibles o el id es indefinido');
          this.selectedListEfectores = null;
        }
      },
      error => {
        console.error('Error al obtener la lista de efectores:', error);
        this.selectedListEfectores = null;  // En caso de error, aseguramos que se borre el id
      }
    );
  }

  // Carga los efectores para un rol específico utilizando habilitaciones generales para un asistencial
loadEfectoresForAutoridades(idPersona: number): void {
  // Primero, intentamos recuperar el id previamente seleccionado desde el servicio
  const previouslySelectedId = this.efectorService.getCurrentEfectorId();
  if (previouslySelectedId) {
    this.selectedListEfectores = previouslySelectedId;
    console.log('Efector previamente seleccionado:', this.selectedListEfectores);
  } else {
    this.selectedListEfectores = null; // Si no hay id guardado, inicializamos como null
  }

  // Luego, obtenemos las habilitaciones generales para la persona (idPersona)
  this.habilitacionesGeneralesService.getPermisoByPersona(idPersona).subscribe(
    (habilitaciones: HabilitacionesGenerales) => {
      console.log('Habilitaciones obtenidas para la persona:', habilitaciones);
      
      // Extraemos la lista de efectores del objeto HabilitacionesGenerales
      this.efectores = habilitaciones.efectores; // Lista de efectores asociada a la persona

      // Si no hay un id guardado y la lista no está vacía, aseguramos que el valor de selectedListEfectores sea null
      if (!previouslySelectedId) {
        this.selectedListEfectores = null;
      }

      // Si la lista de efectores tiene datos y el id es válido, lo podemos guardar en el servicio
      if (this.efectores.length > 0 && this.selectedListEfectores !== null) {
        this.efectorService.setCurrentEfectorId(this.selectedListEfectores);
        console.log('ID del efector seleccionado para DPH o Super:', this.selectedListEfectores);
      } else {
        // Si no hay efectores o si selectedListEfectores es null, limpiamos el valor
        console.warn('No hay efectores disponibles o el id es indefinido');
        this.selectedListEfectores = null;
      }
    },
    error => {
      console.error('Error al obtener las habilitaciones para la persona:', error);
      this.selectedListEfectores = null;  // En caso de error, aseguramos que se borre el id
    }
  );
}
  
// Carga el efector para el rol 'Administrativo'
loadEfectorForAdministrativo(): void {
  this.authService.detailPersonBasicPanel().subscribe(
    (response: PersonBasicPanelDto) => {
      console.log('Respuesta de detailPersonBasicPanel:', response);
      if (response.efectores && response.efectores.length > 0) {
        this.selectedEfector = response.efectores[0];  // Solo tomamos el primer efector
        this.efectorService.setCurrentEfectorId(this.selectedEfector.id);
        console.log('Efector administrativo seleccionado:', this.selectedEfector);
        /*this.fetchAsistenciales(this.selectedEfector.id);*/
      } else {
        console.warn('No hay efectores disponibles para Administrativo');
        this.selectedEfector = null;
      }
    },
    error => {
      console.error('Error al obtener detalles del usuario para Administrativo:', error);
    }
  );
}

// Método para cuando se cambia el efector (DPH o Super)
  onEfectorChange(event: Event): void {
    const selectedListEfectores = this.selectedListEfectores;  // Usamos solo el ID del efector
    if (selectedListEfectores) {
      this.efectorService.setCurrentEfectorId(selectedListEfectores);  // Guardamos el ID en el BehaviorSubject
      console.log('Efector seleccionado para DPH o Super:', selectedListEfectores);
    }
  }

  /*fetchAsistenciales(efectorId: number) {
    this.asistencialService.listByEfectorAndTipoGuardia(efectorId).subscribe(
      (asistenciales) => {
        console.log('Asistenciales filtrados para efector ID:', efectorId, asistenciales);
      },
      (error) => {
        console.error('Error al obtener asistenciales:', error);
      }
    );
  }*/
  
  goToProfessionalForm() {
    this.router.navigateByUrl('/professional-form');
  }

  onLogOut(): void {
    this.tokenService.logOut(); // Limpiar el sessionStorage
    this.efectorService.setCurrentEfectorId(null); // Reiniciar el ID del efector
    window.location.reload(); // Recargar la página
  }
}
