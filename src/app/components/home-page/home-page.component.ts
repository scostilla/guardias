import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { EfectorMinisterioDto } from 'src/app/dto/Configuracion/efector/EfectorMinisterioDto';
import { EfectorCapsDto } from 'src/app/dto/Configuracion/efector/EfectorCapsDto';
import { HabilitacionesGeneralesService } from 'src/app/services/Configuracion/habilitacionesGenerales.service';
import { HabilitacionesGenerales } from 'src/app/models/Configuracion/HabilitacionesGenerales';
import { EfectorSelectorComponent } from './efector-selector/efector-selector.component';
import { combineLatest } from 'rxjs';

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
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  idPersona: number | null = null;
  currentRole: string | null = null;

  selectedListEfectores: number | null = null;
  selectedEfector: EfectorSummaryDto | null = null;
  selectedEfectorDialog: string | null = null;

  currentEfectorType: 'hospital' | 'ministerio' | 'caps' | null = null;
  showHospitalFeatures: boolean = false;
  showMinisterioFeatures: boolean = false;
  showCapsFeatures: boolean = false;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private hospitalService: HospitalService,
    private capsService: CapsService,
    private ministerioService: MinisterioService,
    private habilitacionesGeneralesService: HabilitacionesGeneralesService,
    private efectorService: EfectorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Suscribirse a ambos: rol actual y datos de la persona
    combineLatest([
      this.tokenService.currentRole$,
      this.authService.detailPersonBasicPanel()
    ]).subscribe(([role, personDto]) => {
      this.currentRole = role;
      this.idPersona = personDto.id;
      this.UserRoles();

      // Cargar efectores según rol ya definido
      if (this.isDph || this.isSuper) {
        this.loadEfectoresForDphOrSuper();
      } else if (this.isAdministrativo) {
        this.loadEfectorForAdministrativo();
      } else if (this.isAutoridad) {
        this.loadEfectoresForAutoridades(this.idPersona!);
      } else {
        console.warn('El usuario no tiene un rol válido para proceder');
      }
    });
  }

  // Roles a usar
  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      // Si no hay rol seleccionado, todos como false
      this.isAdministrativo = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

// Obtener nombre del efector y enviar tipo a html
private getEfectorInfoById(efectorId: number): void {
  this.selectedEfectorDialog = null;
  this.currentEfectorType = null;

  this.hospitalService.detailNombreAll(efectorId).subscribe((hospital: EfectorHospitalDto | null) => {
    if (hospital) {
      this.selectedEfectorDialog = hospital.nombre;
      this.currentEfectorType = 'hospital';
      this.updateComponentVisibility();
    } else {
      this.ministerioService.detailNombreAll(efectorId).subscribe((ministerio: EfectorMinisterioDto | null) => {
        if (ministerio) {
          this.selectedEfectorDialog = ministerio.nombre;
          this.currentEfectorType = 'ministerio';
          this.updateComponentVisibility();
        } else {
          this.capsService.detailNombreAll(efectorId).subscribe((cap: EfectorCapsDto | null) => {
            if (cap) {
              this.selectedEfectorDialog = cap.nombre;
              this.currentEfectorType = 'caps';
            } else {
              console.warn(`No se encontró el efector con ID: ${efectorId}`);
              this.selectedEfectorDialog = null;
              this.currentEfectorType = null;
            }
            this.updateComponentVisibility();
          });
        }
      });
    }
  });
}

// Actualiza la visibilidad de componentes según el tipo
private updateComponentVisibility(): void {
  this.showHospitalFeatures = this.currentEfectorType === 'hospital';
  this.showMinisterioFeatures = this.currentEfectorType === 'ministerio';
  this.showCapsFeatures = this.currentEfectorType === 'caps';
  
}

// Carga el efector para el rol 'Dph y Super'
openEfectorDialog(): void {
  const dialogRef = this.dialog.open(EfectorSelectorComponent, {
    width: '450px',
    data: { selectedEfectorId: this.selectedListEfectores }
  });

  dialogRef.afterClosed().subscribe((selectedEfectorId: number | undefined) => {
    if (selectedEfectorId) {
      this.selectedListEfectores = selectedEfectorId;
      this.efectorService.setCurrentEfectorId(selectedEfectorId);
      this.getEfectorInfoById(selectedEfectorId); // Usamos el método unificado
    }
  });
}

// Al cargar el componente
loadEfectoresForDphOrSuper(): void {
  const currentId = this.efectorService.getCurrentEfectorId();
  this.selectedListEfectores = currentId;

  if (currentId) {
    this.getEfectorInfoById(currentId); // Usamos el método unificado
  } else {
    this.selectedEfectorDialog = null;
    this.currentEfectorType = null;
    this.updateComponentVisibility();
  }
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
      if (response.efectores && response.efectores.length > 0) {
        this.selectedEfector = response.efectores[0];  // Solo tomamos el primer efector
        this.efectorService.setCurrentEfectorId(this.selectedEfector.id);
      } else {
        console.warn('No hay efectores disponibles para el Administrativo');
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
    const selectedListEfectores = this.selectedListEfectores;  // Uso solo el ID del efector
    if (selectedListEfectores) {
      this.efectorService.setCurrentEfectorId(selectedListEfectores);  // Guardamos el ID en el BehaviorSubject
      console.log('Efector seleccionado para DPH o Super:', selectedListEfectores);
    }
  }

  onLogOut(): void {
    this.tokenService.logOut(); // Limpiar el sessionStorage
    this.efectorService.setCurrentEfectorId(null); // Reiniciar el ID del efector
    window.location.reload(); // Recargar la página
  }
}
