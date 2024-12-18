import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoridadDto } from 'src/app/dto/Configuracion/AutoridadDto';
import { Autoridad } from 'src/app/models/Configuracion/Autoridad';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { AsistencialSelectorComponent } from '../asistencial-selector/asistencial-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';


@Component({
  selector: 'app-autoridad-edit',
  templateUrl: './autoridad-edit.component.html',
  styleUrls: ['./autoridad-edit.component.css']
})
export class AutoridadEditComponent implements OnInit {

  autoridadForm: FormGroup;
  initialData: any;
  inputValue: string = '';
  autoridades: Autoridad[] = []; 

  //Autenticación
  isLogged = false;
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  userId: number | null = null;
  usuarioPersona: number | null = null;
  currentRole: string | null = null;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AutoridadEditComponent>,
    private autoridadService: AutoridadService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Autoridad
  ){
    this.autoridadForm = this.fb.group({
      confirmado: [null, Validators.required],
      idPersona: ['', Validators.required],
    });

    this.loadAutoridades();

    if (data) {
      this.inputValue = `${data.persona!.apellido} ${data.persona!.nombre}`; // Guarda el nombre completo
      this.autoridadForm.patchValue({
          idPersona: data.persona!.id,
      });
  }

  this.setConfirmadoValidation();

}

  ngOnInit(): void {

    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();
  
    // BehaviorSubject para obtener el rol seleccionado
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();  // Llamar a la función que determina los roles
     
      // Si currentRole es false (null o vacío), redirige al login
      if (!this.currentRole) {
        this.router.navigateByUrl('');
      }
    });  
    
      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
      console.log('ID del usuario logeado:',this.userId);
  
    } else {
      this.isLogged = false;
      console.log('El usuario no está logueado.');
      this.router.navigateByUrl('');
    }

    this.initialData = this.autoridadForm.value;
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

  // Establecer la validación del campo 'confirmado' de acuerdo al rol
  setConfirmadoValidation(): void {
    if (this.isSuper) {
      this.autoridadForm.get('confirmado')?.setValidators([Validators.required]);
    } else {
      this.autoridadForm.get('confirmado')?.clearValidators();
    }
    this.autoridadForm.get('confirmado')?.updateValueAndValidity();
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.autoridadForm.value);
  }

  loadAutoridades(): void {
    this.autoridadService.list().subscribe(data => {
      this.autoridades = data; // Guarda la lista de autoridades
    }, error => {
      console.log(error);
    });
  }

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.autoridadForm.patchValue({ idPersona: result.id });
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }

  saveAutoridad(): void {
    if (this.autoridadForm.valid) {
      const autoridadData = this.autoridadForm.value;
  
      if (!this.data || !this.data.id) {
        // Verificar si la persona ya está asignada como autoridad activa
        this.autoridadService.asignadoAutoridad(autoridadData.idPersona).subscribe(
          (isAssigned: boolean) => {
            if (isAssigned) {
              this.toastr.warning('Ya existe una asignación activa para esta persona.', 'Advertencia', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              return;
            }
  
            // Verificar si la persona posee un legajo activo con guardia de cargo y/o agrupación
            this.autoridadService.validateForCreation(autoridadData.idPersona).subscribe(
              (canCreate: boolean) => {
                if (!canCreate) {
                  this.toastr.warning('Debes dar de baja el legajo activo con guardia de cargo y/o agrupación para poder asignarlo como autoridad.', 'Advertencia', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });
                  return;
                }
  
                // Si pasa todas las validaciones, continuar con la creación o actualización
                const autoridadDto = new AutoridadDto(
                  true,
                  autoridadData.confirmado ?? null,
                  autoridadData.idPersona,
                );
  
                console.log('Datos a enviar:', autoridadDto);
  
                if (this.data && this.data.id) {
                  this.autoridadService.update(this.data.id, autoridadDto).subscribe(
                    result => {
                      this.dialogRef.close({ type: 'save', data: result });
                    },
                    error => {
                      this.dialogRef.close({ type: 'error', data: error });
                    }
                  );
                } else {
                  this.autoridadService.save(autoridadDto).subscribe(
                    result => {
                      this.dialogRef.close({ type: 'save', data: result });
                    },
                    error => {
                      this.dialogRef.close({ type: 'error', data: error });
                    }
                  );
                }
              },
              error => {
                // Manejo de errores en validateForCreation
                this.toastr.error('Error al verificar el legajo para creación de autoridad.', 'Error', {
                  timeOut: 6000,
                  positionClass: 'toast-top-center',
                  progressBar: true
                });
              }
            );
          },
          error => {
            // Manejo de errores en asignadoAutoridad
            this.toastr.error('Error al verificar la asignación de autoridad.', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        );
      } else {
        // Si la entidad existe, continuar con la actualización o creación
        const autoridadDto = new AutoridadDto(
          true,
          autoridadData.confirmado ?? null,
          autoridadData.idPersona,
        );
  
        console.log('Datos a enviar:', autoridadDto);
  
        if (this.data && this.data.id) {
          this.autoridadService.update(this.data.id, autoridadDto).subscribe(
            result => {
              this.dialogRef.close({ type: 'save', data: result });
            },
            error => {
              this.dialogRef.close({ type: 'error', data: error });
            }
          );
        } else {
          this.autoridadService.save(autoridadDto).subscribe(
            result => {
              this.dialogRef.close({ type: 'save', data: result });
            },
            error => {
              this.dialogRef.close({ type: 'error', data: error });
            }
          );
        }
      }
    }
  }
  
  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
