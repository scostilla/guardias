import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { AgrupacionEnum, AgrupacionService } from 'src/app/services/Configuracion/agrupacion.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
@Component({
  selector: 'app-revista-edit',
  templateUrl: './revista-edit.component.html',
  styleUrls: ['./revista-edit.component.css']
})
export class RevistaEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  agrupaciones: AgrupacionEnum[] = [];
  tipoRevista: TipoRevista[] = [];
  categoria: Categoria[] = [];
  adicional: Adicional[] = [];
  cargaHoraria: CargaHoraria[] = [];
  errorMessage: string = '';
  categoria24HS?: Categoria;
  cargaHoraria24?: CargaHoraria;
  cargaHoraria30?: CargaHoraria;

  constructor(
    private fb: FormBuilder,
    private agrupacionService: AgrupacionService,
    private revistaService: RevistaService,
    private tipoRevistaService: TipoRevistaService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private dialogRef: MatDialogRef<RevistaEditComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: Revista 
  ) { 
    this.listProvincia();
  }

  private updatingForm = false;
  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      agrupacion: [this.data ? this.data.agrupacion : '', Validators.required],
      categoria: [this.data ? this.data.categoria : '', Validators.required],
      adicional: [this.data ? this.data.adicional : '', Validators.required],
      cargaHoraria: [this.data ? this.data.cargaHoraria : '', Validators.required],
      tipoRevista: [this.data ? this.data.tipoRevista : '', Validators.required]
    });

    console.log('Valor inicial de tipoRevista:', this.form?.get('tipoRevista')?.value);
  console.log('Estado del formulario:', this.form?.value);

    
    this.agrupacionService.getAgrupaciones().subscribe(data => {
      console.log('Agrupaciones recibidas:', data); // Verifica los datos en la consola
      this.agrupaciones = data;
    }, error => {
      console.log('Error al obtener agrupaciones:', error);
    });
    
    this.esEdicion = this.data != null;
  
    // Asignar los valores a las variables categoria24HS y cargaHoraria24
    this.categoria24HS = this.categoria.find(cat => cat.nombre === '24 HS');
    this.cargaHoraria24 = this.cargaHoraria.find(carga => carga.cantidad === 24);
    this.cargaHoraria30 = this.cargaHoraria.find(carga => carga.cantidad === 30);
  
    this.form.valueChanges.subscribe(val => {
      if (this.updatingForm) return;
      this.updatingForm = true;
      this.esIgual = val.id !== this.data?.id || val.agrupacion !== this.data?.agrupacion || 
                     val.categoria !== this.data?.categoria || val.adicional !== this.data?.adicional || 
                     val.cargaHoraria !== this.data?.cargaHoraria || val.tipoRevista !== this.data?.tipoRevista;
  
      const selectedCategoria = this.categoria.find(cat => cat.id === val.categoria?.id);
      const selectedCargaHoraria = this.cargaHoraria.find(carga => carga.id === val.cargaHoraria?.id);
  
      this.checkCategoriaYCargaHoraria(selectedCategoria, selectedCargaHoraria);
      console.log('Estado del formulario:', this.form?.value);
      this.updatingForm = false;
    });
  
    this.listCategorias(); 
    this.listAdicional();
    this.listCargaHoraria();

    this.loadAgrupaciones();
    
  }
  loadAgrupaciones(): void {
    this.agrupacionService.getAgrupaciones().subscribe(data => {
      console.log('Agrupaciones recibidas:', data); // Verifica los datos en la consola
      this.agrupaciones = data;
    }, error => {
      console.log('Error al obtener agrupaciones:', error);
    });
  }
  checkCategoriaYCargaHoraria(categoria: any, cargaHoraria: any): void {
    const categoria24HS = this.categoria.find(cat => cat.nombre === '24 HS');
    const cargaHoraria24 = this.cargaHoraria.find(carga => carga.cantidad === 24);
    const cargaHoraria30 = this.cargaHoraria.find(carga => carga.cantidad === 30);
  
    if ((categoria && categoria.id === categoria24HS?.id) || 
        (cargaHoraria && cargaHoraria.id === cargaHoraria24?.id) ||
        (cargaHoraria && cargaHoraria.id === cargaHoraria30?.id)) {
      
      this.form?.get('adicional')?.clearValidators();
      this.form?.get('adicional')?.setValue(null); // Vaciar el campo adicional
    } else {
      this.form?.get('adicional')?.setValidators(Validators.required);
    }
  
    // Siempre actualiza el estado y la validez después de cambiar los validadores
    this.form?.get('adicional')?.updateValueAndValidity();
  }

  listProvincia(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.tipoRevista = data;
    }, error => {
      console.log(error);
    });
  }

  listCategorias(): void {
    this.categoriaService.list().subscribe(data => {
      this.categoria = data;
      // Asignar los valores a las variables categoria24HS y cargaHoraria24 aquí
      this.categoria24HS = this.categoria.find(cat => cat.nombre === '24 HS');
      this.checkCategoriaYCargaHoraria(this.form?.get('categoria')?.value, this.form?.get('cargaHoraria')?.value);
    }, error => {
      console.log(error);
    });
  }

  listAdicional(): void {
    this.adicionalService.list().subscribe(data => {
      this.adicional = data;
    }, error => {
      console.log(error);
    });
  }

  listCargaHoraria(): void {
    this.cargaHorariaService.list().subscribe(data =>{
      this.cargaHoraria = data;
      // Asignar los valores a las variables categoria24HS y cargaHoraria24 aquí
      this.cargaHoraria24 = this.cargaHoraria.find(carga => carga.cantidad === 24);
      this.cargaHoraria30 = this.cargaHoraria.find(carga => carga.cantidad === 30);
      this.checkCategoriaYCargaHoraria(this.form?.get('categoria')?.value, this.form?.get('cargaHoraria')?.value);
    }, error =>{
      console.log(error);
    });
  }
    
  saveRevista(): void {
    if (this.form?.valid) {

      const id = this.form.get('id')?.value;
      const idTipoRevista = this.form.get('tipoRevista')?.value?.id || null;
      const idCategoria = this.form.get('categoria')?.value?.id || null;
      const idAdicional = this.form.get('adicional')?.value?.id || null;
      const idCargaHoraria = this.form.get('cargaHoraria')?.value?.id || null;
      const agrupacion = this.form.get('agrupacion')?.value;
  
      console.log('ID Tipo Revista:', idTipoRevista);
      console.log('ID Categoria:', idCategoria);
      console.log('ID Adicional:', idAdicional);
      console.log('ID Carga Horaria:', idCargaHoraria);
      console.log('Agrupación:', agrupacion);
  
      if (idTipoRevista === null || idCategoria === null || idCargaHoraria === null) {
        this.toastr.error('Faltan datos requeridos.');
        return;
      }
  
      const revistaDto = new RevistaDto(idTipoRevista, idCategoria, idAdicional, idCargaHoraria, agrupacion);
  
      if (this.esEdicion) {
        // En caso de edición
        //const revista: Revista = {
        const revista: RevistaDto = {
          //id: id,
          idTipoRevista: this.form.get('tipoRevista')?.value,
          //tipoRevista: this.form.get('tipoRevista')?.value,
          idCategoria: this.form.get('categoria')?.value,
          //categoria: this.form.get('categoria')?.value,
          idAdicional: this.form.get('adicional')?.value,
          //adicional: this.form.get('adicional')?.value,
          idCargaHoraria: this.form.get('cargaHoraria')?.value,
          //cargaHoraria: this.form.get('cargaHoraria')?.value,
          agrupacion: this.form.get('agrupacion')?.value
        };
  
        console.log('Revista a actualizar:', revista);
  
        this.revistaService.update(id, revista).subscribe({
          next: (data) => this.dialogRef.close(data),
          error: (err) => this.handleValidationError(err)
        });
      } else {
        // En caso de creación
        this.revistaService.save(revistaDto).subscribe({
          next: (data) => this.dialogRef.close(data),
          error: (err) => this.handleValidationError(err)
        });
      }
    } else {
      this.toastr.error('Formulario no válido');
    }
  }
  
  handleValidationError(err: any): void {
    if (err.status === 400 && err.error && err.error.mensaje) {
      this.errorMessage = err.error.mensaje; // Mostrar mensaje de error en el formulario
      this.toastr.error(err.error.mensaje); // Mostrar notificación con Toastr
    } else {
      this.errorMessage = 'Ocurrió un error inesperado.';
      this.toastr.error('Ocurrió un error inesperado.');
    }
  }


  compareCategoria(p1: Categoria, p2: Categoria): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareAdicional(p1: Adicional, p2: Adicional): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareCargaHoraria(p1: CargaHoraria, p2: CargaHoraria): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
  compareTipoRevista(p1: TipoRevista, p2: TipoRevista): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}