import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { ToastrService } from 'ngx-toastr';

import { error } from 'console';
import { PersonDto } from 'src/app/dto/Configuracion/PersonDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';


@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})

export class PersonEditComponent implements OnInit {
  asistencialForm: FormGroup;
  initialData: any;
  asistencialId!: number;
  roles: Rol[] = [];
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private rolService: RolService,
    private authService: AuthService,
    private router: Router
  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      esAsistencial: ['', Validators.required],
      cuil: ['', [Validators.required, Validators.pattern('^([0-9]{2}-[0-9]{8}-[0-9]{1})$')]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]]
    });

    this.listRoles();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.asistencialId = +params['id'];
        this.loadAsistencialData(this.asistencialId);
      }
    });

    this.initialData = this.asistencialForm.value;
  }

  loadAsistencialData(id: number): void {
    this.asistencialService.getByIds([id]).subscribe(data => {
      if (data && data.length > 0) {
        const asistencialData = data[0];
        
        // Adaptar el formato de los datos para el formulario
        const adaptedData = {
          ...asistencialData,
          roles: asistencialData.usuario && asistencialData.usuario.roles ? asistencialData.usuario.roles.map((rolId: string) => parseInt(rolId, 10)) : [] // Convertir roles de string a ID numérico si es necesario
        };
        
        this.asistencialForm.patchValue(adaptedData);
    
        // Guardar los datos iniciales para comparación posterior
        this.initialData = this.asistencialForm.value;
      }
    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error al cargar los datos.', 'Error');
    });
  }

  formatCuil(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Elimina todos los caracteres que no son dígitos
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)/, '$1-$2'); // Añade un guion después de los primeros 2 dígitos
    }
    if (value.length > 10) {
      value = value.replace(/^(\d{2})-(\d{8})(\d+)/, '$1-$2-$3'); // Añade otro guion después de los siguientes 8 dígitos
    }
    event.target.value = value;
    this.asistencialForm.get('cuil')?.setValue(value, { emitEvent: false });
  }

  listRoles(): void {
    this.rolService.list().subscribe(data => {
      this.roles = data;
    }, error => {
      console.log(error);
    });
  }

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;
  
      const nuevoUsuario = new NuevoUsuario(
        asistencialData.nombreUsuario,
        asistencialData.email,
        asistencialData.password,
        asistencialData.roles
      );
  
      console.log('Verificando existencia del usuario:', nuevoUsuario.nombreUsuario);
  
      // Verifica si existe un usuario con el nombreUsuario especificado
      this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
        (existingUsuario) => {
          if (existingUsuario && existingUsuario.id != undefined) {
            console.error('El nombre de usuario ya existe.');
            this.toastr.warning('El nombre de usuario ya existe. Por favor, elige otro.', 'Advertencia');
          } else {
            console.log('Usuario no encontrado, procediendo a crear uno nuevo.');
            // Usuario no encontrado, a crearlo
            this.createNewUserAndAsistencial(nuevoUsuario, asistencialData);
          }
        },
        (error) => {
          if (error.status === 404) {
            console.log('Usuario no encontrado, procediendo a crear uno nuevo.');
            // Usuario no encontrado, a crearlo
            this.createNewUserAndAsistencial(nuevoUsuario, asistencialData);
          } else {
            console.error('Error al buscar el usuario existente', error);
            this.toastr.error('Error al buscar el usuario existente.', 'Error');
          }
        }
      );
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos.', 'Advertencia');
    }
  }
  
  createNewUserAndAsistencial(nuevoUsuario: NuevoUsuario, asistencialData: any): void {
    console.log("Nuevo usuario:", nuevoUsuario.nombreUsuario, nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.roles);
    
    this.authService.create(nuevoUsuario).subscribe(
      () => {
        console.log('Usuario creado exitosamente:', nuevoUsuario.nombreUsuario);
  
        // Una vez creado, buscar el usuario recién creado
        this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
          (newUsuario) => {
            if (newUsuario && newUsuario.id !== undefined) {
              console.log('Usuario encontrado después de la creación:', newUsuario);
              this.createAsistencialDtoAndSave(asistencialData, newUsuario.id);
            } else {
              console.error('Error: No se pudo encontrar el nuevo usuario después de crearlo.');
              this.toastr.error('Error al encontrar el nuevo usuario después de la creación.', 'Error');
            }
          },
          (searchError) => {
            console.error('Error al buscar el usuario después de crearlo', searchError);
            this.toastr.error('Error al buscar el usuario después de crearlo.', 'Error');
          }
        );
      },
      (createError) => {
        console.error('Error al crear el usuario', createError);
        this.toastr.error('Error al crear el usuario.', 'Error');
      }
    );
  }
  
  createAsistencialDtoAndSave(asistencialData: any, usuarioId: number): void {
    const asistencialDto = new AsistencialDto(
      asistencialData.nombre,
      asistencialData.apellido,
      asistencialData.dni,
      asistencialData.cuil,
      asistencialData.fechaNacimiento,
      asistencialData.sexo,
      asistencialData.telefono,
      asistencialData.email,
      asistencialData.domicilio,
      asistencialData.esAsistencial,
      asistencialData.activo,
      usuarioId,
    );
  
    console.log('Guardando asistencial:', asistencialDto);
    this.saveOrUpdateAsistencial(asistencialDto);
  }
  
  saveOrUpdateAsistencial(asistencialDto: AsistencialDto): void {
    if (this.asistencialId) { // Asumiendo que `asistencialId` es el identificador del asistencial en edición
      this.asistencialService.update(this.asistencialId, asistencialDto).subscribe(
        result => {
          this.toastr.success('Asistencial actualizado con éxito', 'Éxito');
          this.router.navigate(['/person']); // Redirigir a la lista de personas
        },
        error => {
          console.error('Error al actualizar el asistencial', error);
          this.toastr.error('Error al actualizar el asistencial.', 'Error');
        }
      );
    } else {
      this.asistencialService.save(asistencialDto).subscribe(
        result => {
          this.toastr.success('Asistencial creado con éxito', 'Éxito');
          this.router.navigate(['/person']); // Redirigir a la lista de personas
        },
        error => {
          console.error('Error al guardar el asistencial', error);
          this.toastr.error('Error al guardar el asistencial.', 'Error');
        }
      );
    }
  }
  
  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
});

    this.router.navigate(['/personal']);
  }
  
  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.asistencialForm.value);
  }
}
