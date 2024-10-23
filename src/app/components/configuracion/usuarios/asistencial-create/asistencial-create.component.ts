import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';

@Component({
  selector: 'app-asistencial-create',
  templateUrl: './asistencial-create.component.html',
  styleUrls: ['./asistencial-create.component.css']
})
export class AsistencialCreateComponent implements OnInit {

  asistencialForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  roles: Rol[] = [];
  step = 0;


  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private router: Router,
    private tipoGuardiaService: TipoGuardiaService,
    private rolService: RolService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,20}$/)]],
      domicilio: ['', Validators.required],
      esAsistencial: [true, Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      tiposGuardias: [[], [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]],
    });

    this.listTipoGuardia();
    this.listRoles();
  }

  ngOnInit(): void {
    
  }

  listTipoGuardia(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tiposGuardias = data;
    }, error => {
      console.log(error);
    });
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

      asistencialData.nombre = this.capitalizeWords(asistencialData.nombre);
      asistencialData.apellido = this.capitalizeWords(asistencialData.apellido);

      asistencialData.cuil = asistencialData.cuil.replace(/-/g, '');

      const nuevoUsuario = new NuevoUsuario(
        asistencialData.nombreUsuario,
        asistencialData.email,
        asistencialData.password,
        asistencialData.roles
      );
      // Verifica si existe un usuario con el nombreUsuario especificado
      this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
        (existingUsuario) => {
          if (!existingUsuario) {
            // Usuario no encontrado, creamos
            console.log("roles para el usuari que se creará", nuevoUsuario);
            this.createNewUserAndAsistencial(nuevoUsuario, asistencialData);
          } else {
            console.error('El nombre de usuario ya existe.');
          }
        },
        (error) => {
          console.log('Error al buscar el usuario existente', error);
        }
      );
    }
  }

  createNewUserAndAsistencial(nuevoUsuario: NuevoUsuario, asistencialData: any): void {
    //creamos el usuario
    this.authService.create(nuevoUsuario).subscribe(
      () => {
        // buscar el usuario recién creado
        this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
          (newUsuario) => {
            if (newUsuario && newUsuario.id !== undefined) {
              //creo el asistencial con el id de usuario creado
              this.createAsistencialDtoAndSave(asistencialData, newUsuario.id);
            }
          },
          (searchError) => {
            console.error('Error al buscar el usuario después de crearlo', searchError);
          }
        );
      },
      (createError) => {
        console.error('Error al crear el usuario', createError);
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
      asistencialData.tiposGuardias
    );

    console.log("asistencial dto que quiero guardar", asistencialDto);

    this.asistencialService.save(asistencialDto).subscribe(
      (result) => {
        this.toastr.success('Asistencial creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/asistencial'], { state: { asistencialCreado: result } }); // Redirigir a la lista de asistenciales y pasar el asistencial creado
      },
      (error) => {
        this.toastr.error('Ocurrió un error al crear el Asistencial', error, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    );
  }

  onTipoGuardiaSelectionChange(event: any): void {
    const selectedValues = this.asistencialForm.get('tiposGuardias')!.value;

    // Si se selecciona CONTRAFACTURA, deseleccionar las demás opciones
    if (selectedValues.includes(1)) {
      this.asistencialForm.patchValue({
        tiposGuardias: [1]
      });
    } else if (selectedValues.includes(5)) {
      // Si se selecciona PASIVA, deseleccionar las demás opciones
      this.asistencialForm.patchValue({
        tiposGuardias: [5]
      });
    } else {
      // Si se seleccionan las opciones 2, 3 o 4, permitir que se elijan juntas
      this.asistencialForm.patchValue({
        tiposGuardias: selectedValues.filter((value: number) => value !== 1 && value !== 5)
      });
    }
  }

  capitalizeWords(value: string): string {
    return value.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  onNombreInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.asistencialForm.get('nombre')?.setValue(formattedValue, { emitEvent: false });
  }
  
  onApellidoInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.asistencialForm.get('apellido')?.setValue(formattedValue, { emitEvent: false });
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

  nextStep(): void {
    if (this.step === 0 && !this.isPanel1Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en datos personales.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    if (this.step === 1 && !this.isPanel2Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en datos usuario.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    this.step = (this.step + 1) % 2;  // Cambia 3 por el número total de pasos en el wizard
  }

  prevStep(): void {
    this.step = (this.step - 1 + 2) % 2;  // Cambia 3 por el número total de pasos en el wizard
  }

  isPanel1Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 1 son válidos
    const panel1Controls = ['nombre', 'apellido', 'dni', 'domicilio', 'cuil', 'fechaNacimiento', 'sexo', 'telefono', 'tiposGuardias', 'email'];
    return panel1Controls.every(control => this.asistencialForm.get(control)?.valid);
  }

  isPanel2Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 2 son válidos
    const panel2Controls = ['nombreUsuario', 'password', 'roles'];
    return panel2Controls.every(control => this.asistencialForm.get(control)?.valid);
  }

  setStep(index: number) {
    this.step = index;
  }

  cerrarPanel() {
    this.step = -1;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal']);
  }
}