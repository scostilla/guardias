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

  revistaForm: FormGroup;
  initialData: any;
  agrupaciones: AgrupacionEnum[] = [];
  tipoRevista: TipoRevista[] = [];
  categorias: Categoria[] = [];
  adicionales: Adicional[] = [];
  cargaHoraria: CargaHoraria[] = [];
  categoria24HS?: Categoria;
  cargaHoraria24?: CargaHoraria;
  cargaHoraria30?: CargaHoraria;
  esEdicion?: boolean;

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

    this.esEdicion = this.data != null;

    this.revistaForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: [''],  
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required]
    });

    this.loadAgrupaciones();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();

    if (data) {
          console.log("Datos recibidos para edición:", data);
      this.revistaForm.patchValue(data);
      
      // Llama a las funciones de cambio para asegurarte de que la visibilidad se ajuste
      this.onCategoriaChange(data.categoria);
      this.onCargaHorariaChange(data.cargaHoraria);
    }
  }
  
  ngOnInit(): void {
    this.initialData = this.revistaForm.value;

    // Observa los cambios en el campo de categoría
    this.revistaForm.get('categoria')?.valueChanges.subscribe(categoria => {
      this.onCategoriaChange(categoria);
    });

    // Observa los cambios en el campo de carga horaria
    this.revistaForm.get('cargaHoraria')?.valueChanges.subscribe(cargaHoraria => {
      this.onCargaHorariaChange(cargaHoraria);
    });
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.revistaForm.value);
  }

  loadAgrupaciones(): void {
    this.agrupacionService.getAgrupaciones().subscribe(data => {
        this.agrupaciones = data; // Ahora es un array de AgrupacionEnum
        console.log('Agrupaciones:', this.agrupaciones);
    }, error => {
        console.log('Error al obtener agrupaciones:', error);
    });
}

  listCategorias(): void {
    this.categoriaService.list().subscribe(data => {
      this.categorias = data;
      this.categoria24HS = this.categorias.find(cat => cat.nombre === '24 HS');
    }, error => {
      console.log('Error al cargar las categorias', error);
    });
  }

  listAdicionales(): void {
    this.adicionalService.list().subscribe(data => {
      this.adicionales = data;
    }, error => {
      console.log('Error al cargar los adicionales', error);
    });
  }

  listCargaHoraria(): void {
    this.cargaHorariaService.list().subscribe(data => {
      this.cargaHoraria = data;
      this.cargaHoraria24 = this.cargaHoraria.find(ch => ch.cantidad === 24);
      this.cargaHoraria30 = this.cargaHoraria.find(ch => ch.cantidad === 30);
    }, error => {
      console.log('Error al cargar las cargas horarias', error);
    });
  }

  listTipoRevista(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.tipoRevista = data;
    }, error => {
      console.log(error);
    });
  }

  isAdicionalVisible: boolean = true;

  onCategoriaChange(categoria: Categoria): void {
    const cargaHoraria = this.revistaForm.get('cargaHoraria')?.value;

    
  
     // Validación para categoría "24 HS" con carga horaria 30
    if (categoria?.nombre === '24 HS' && cargaHoraria?.cantidad === 30) {
      this.toastr.error('La categoría 24 HS no permite una carga horaria de 30.');
    } 
    // Validación para categoría "24 HS" con carga horaria distinta a 24
    if (categoria?.nombre === '24 HS' && cargaHoraria?.cantidad !== 24) {
      this.toastr.error('La carga horaria debe ser 24 para la categoría 24 HS.');
    }  
  
    // Actualización de la visibilidad del campo adicional
    const shouldHideAdicional = (cargaHoraria?.cantidad === 24 || cargaHoraria?.cantidad === 30) || categoria?.nombre === '24 HS';
    this.isAdicionalVisible = !shouldHideAdicional;
  
    if (shouldHideAdicional) {
      this.revistaForm.get('adicional')?.setValue(null); // Limpia el valor de adicional
      this.revistaForm.get('adicional')?.clearValidators(); // Remueve las validaciones
    } else if (cargaHoraria?.cantidad !== 30 && categoria?.nombre !== '24 HS' && cargaHoraria?.cantidad !== 24) {
      // Solo si la carga horaria no es 30 y la categoría no es "24 HS", el adicional es requerido
      this.revistaForm.get('adicional')?.setValidators(Validators.required);
    } 
    
    this.revistaForm.get('adicional')?.updateValueAndValidity(); // Actualiza el estado de validación
  }
  
  
  onCargaHorariaChange(cargaHoraria: CargaHoraria): void {
     const categoria = this.revistaForm.get('categoria')?.value;

  
     // Validación para categoría "24 HS" con carga horaria 30
    if (categoria?.nombre === '24 HS' && cargaHoraria?.cantidad === 30) {
      this.toastr.error('La categoría 24 HS no permite una carga horaria de 30.');
    } 
    // Validación para categorías que no son "24 HS" con carga horaria 24
    if (categoria?.nombre !== '24 HS' && cargaHoraria?.cantidad === 24) {
      this.toastr.error('La categoría debe ser 24 HS para la carga horaria de 24.');
    }    
  
    // Actualizar visibilidad del campo adicional
    const shouldHideAdicional = cargaHoraria?.cantidad === 24 || cargaHoraria?.cantidad === 30;
    this.isAdicionalVisible = !shouldHideAdicional;
  
    if (shouldHideAdicional) {
      this.revistaForm.get('adicional')?.setValue(null); // Limpia el valor de adicional
      this.revistaForm.get('adicional')?.clearValidators(); // Remueve las validaciones
    } else {
      this.revistaForm.get('adicional')?.setValidators(Validators.required); // Aplica las validaciones si es visible
    }
    
    this.revistaForm.get('adicional')?.updateValueAndValidity(); // Actualiza el estado de validación
  }

  isRevistaFormValid(): boolean {
    return this.revistaForm.valid;
  }

  saveRevista(): void {
    const categoria = this.revistaForm.get('categoria')?.value;
    const cargaHoraria = this.revistaForm.get('cargaHoraria')?.value;
  
    // Validar si la categoría es "24 HS" y la carga horaria no es 24
    if (categoria?.nombre === '24 HS' && cargaHoraria?.cantidad !== 24) {
      this.toastr.error('La categoría "24 HS" requiere una carga horaria de 24.');
      return; // No continuar con la creación o actualización
    }
    if (cargaHoraria?.cantidad === 24 && categoria?.nombre !== '24 HS') {
      this.toastr.error('La carga horaria de 24 solo es válida para la categoría "24 HS".');
      return; // No continuar con la creación o actualización
    }

    if (cargaHoraria?.cantidad === 30 && categoria?.nombre === '24 HS') {
      this.toastr.error('La categoría "24 HS" no permite una carga horaria de 30.');
      return; // No continuar con la creación o actualización
    }
  
    if (this.revistaForm.valid) {
      const revistaData = this.revistaForm.value;
  
      const revistaDto = new RevistaDto(
        revistaData.tipoRevista.id,
        revistaData.categoria.id,
        revistaData.adicional? revistaData.adicional.id : null, // Asegúrate de que esto esté correcto
        revistaData.cargaHoraria.id,
        revistaData.agrupacion 
      );
  console.log("Datos a guardar:", revistaDto);
      if (this.data && this.data.id) {
        this.revistaService.update(this.data.id, revistaDto).subscribe(
          (result) => {
            this.dialogRef.close({ type: 'save', data: result });
           
          },
          (error) => {
            this.toastr.error('Error al actualizar la revista.');
          }
        );
      } else {
        this.revistaService.save(revistaDto).subscribe(
          (result) => {
            this.dialogRef.close({ type: 'save', data: result });
            this.toastr.success('Revista creada con éxito.');
          },
          (error) => {
            console.error('Error en la creación de la revista', error);
            this.toastr.error('Error al crear la revista: ' + error.message);
          }
        );
      }
    } else {
      this.toastr.error('El formulario contiene errores.');
    }
  }
  cancelar(): void {
    this.dialogRef.close();
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


}