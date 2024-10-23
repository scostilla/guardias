import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/NoAsistencialDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Rol } from 'src/app/models/Configuracion/Rol';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { RolService } from 'src/app/services/Configuracion/rol.service';
import { AuthService } from 'src/app/services/login/auth.service';

@Component({
  selector: 'app-no-asistencial-create',
  templateUrl: './no-asistencial-create.component.html',
  styleUrls: ['./no-asistencial-create.component.css']
})
export class NoAsistencialCreateComponent implements OnInit {

  noAsistencialForm: FormGroup;
  roles: Rol[] = [];
  step = 0;


  constructor(
    private fb: FormBuilder,
    private noAsistencialService: NoAsistencialService,
    private router: Router,
    private rolService: RolService,
    private authService: AuthService,
    private toastr: ToastrService,

  ){
    this.noAsistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      esAsistencial: [false, Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]],
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]],
    });

    this.listRoles();
  }

  ngOnInit(): void {
    
  }

  listRoles(): void {
    this.rolService.list().subscribe(data => {
      this.roles = data;
    }, error => {
      console.log(error);
    });
  }

  saveNoAsistencial(): void {
    if (this.noAsistencialForm.valid) {
      const noAsistencialData = this.noAsistencialForm.value;

      noAsistencialData.nombre = this.capitalizeWords(noAsistencialData.nombre);
      noAsistencialData.apellido = this.capitalizeWords(noAsistencialData.apellido);

      noAsistencialData.cuil = noAsistencialData.cuil.replace(/-/g, '');

      const nuevoUsuario = new NuevoUsuario(
        noAsistencialData.nombreUsuario,
        noAsistencialData.email,
        noAsistencialData.password,
        noAsistencialData.roles
      );
      // Verifica si existe un usuario con el nombreUsuario especificado
      this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
        (existingUsuario) => {
          if (!existingUsuario) {
            // Usuario no encontrado, creamos
            this.createNewUserAndNoAsistencial(nuevoUsuario, noAsistencialData);
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

  createNewUserAndNoAsistencial(nuevoUsuario: NuevoUsuario, noAsistencialData: any): void {
    //creamos el usuario
    this.authService.create(nuevoUsuario).subscribe(
      () => {
        // buscar el usuario recién creado
        this.authService.detail(nuevoUsuario.nombreUsuario).subscribe(
          (newUsuario) => {
            if (newUsuario && newUsuario.id !== undefined) {
              //creo el no asistencial con el id de usuario creado
              this.createNoAsistencialDtoAndSave(noAsistencialData, newUsuario.id);
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

  createNoAsistencialDtoAndSave(noAsistencialData: any, usuarioId: number): void {

    noAsistencialData.cuil = noAsistencialData.cuil.replace(/-/g, '');

    const noAsistencialDto = new NoAsistencialDto(
      noAsistencialData.nombre,
      noAsistencialData.apellido,
      noAsistencialData.dni,
      noAsistencialData.cuil,
      noAsistencialData.fechaNacimiento,
      noAsistencialData.sexo,
      noAsistencialData.telefono,
      noAsistencialData.email,
      noAsistencialData.domicilio,
      noAsistencialData.esAsistencial,
      noAsistencialData.activo,
      usuarioId
    );

    console.log("noAsistencial dto que quiero guardar", noAsistencialDto);

    this.noAsistencialService.save(noAsistencialDto).subscribe(
      (result) => {
        this.toastr.success('NoAsistencial creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/personal-no-asistencial'], { state: { noAsistencialCreado: result } }); // Redirigir a la lista de no asistenciales y pasar el noAsistencial creado
      },
      (error) => {
        this.toastr.error('Ocurrió un error al crear el noAsistencial', error, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    );
  }

  capitalizeWords(value: string): string {
    return value.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  onNombreInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.noAsistencialForm.get('nombre')?.setValue(formattedValue, { emitEvent: false });
  }
  
  onApellidoInput(event: any): void {
    const formattedValue = this.capitalizeWords(event.target.value);
    this.noAsistencialForm.get('apellido')?.setValue(formattedValue, { emitEvent: false });
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
    this.noAsistencialForm.get('cuil')?.setValue(value, { emitEvent: false });
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

    this.step = (this.step + 1) % 2; 
  }

  prevStep(): void {
    this.step = (this.step - 1 + 2) % 2;
  }

  isPanel1Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 1 son válidos
    const panel1Controls = ['nombre', 'apellido', 'dni', 'domicilio', 'cuil', 'fechaNacimiento', 'sexo', 'telefono', 'email'];
    return panel1Controls.every(control => this.noAsistencialForm.get(control)?.valid);
  }

  isPanel2Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 2 son válidos
    const panel2Controls = ['nombreUsuario', 'password', 'roles'];
    return panel2Controls.every(control => this.noAsistencialForm.get(control)?.valid);
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
    this.router.navigate(['/personal-no-asistencial']);
  }
}