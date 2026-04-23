import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { Region } from 'src/app/models/Configuracion/Region';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { ServicioService } from 'src/app/services/Configuracion/servicio.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-caps-edit',
  templateUrl: './caps-edit.component.html',
  styleUrls: ['./caps-edit.component.css']
})
export class CapsEditComponent implements OnInit {
  capsForm: FormGroup;
  initialData: any;
  localidades: Localidad[] = [];
  regiones: Region[] = [];
  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];

  // 🔥 NUEVAS PROPIEDADES PARA MANEJO DE IMÁGENES
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  isUploading: boolean = false;
  isDragOver: boolean = false;
  uploadError: string | null = null;
  pendingFile: File | null = null;
  isDuplicateDialogOpen: boolean = false;
  isDuplicateImage: boolean = false;
  dragCounter: number = 0;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CapsEditComponent>,
    private capsService: CapsService,
    private localidadService: LocalidadService,
    private servicioService: ServicioService,
    private regionService: RegionService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Caps
  ) {
    this.capsForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.() ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      servicio: [ [], Validators.required ],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      url: [this.data ? this.data.url : ''],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]],
      cabecera: ['', Validators.required],
      tipoCaps: ['', Validators.required]
    });

    this.listLocalidad();
    this.listRegion();
    this.listHospital();
    this.listServicios();

    if (data) {
      this.capsForm.patchValue(data);
      // ...nuevo: si la data trae 'servicios' llenar el control 'servicio'
      if ((data as any).servicios && Array.isArray((data as any).servicios)) {
        this.capsForm.patchValue({ servicio: (data as any).servicios });
      }
    }
  }

  ngOnInit(): void {
    console.log('🔍 Inicializando componente con data:', this.data);
    console.log('🔍 Verificando URL en data:', this.data?.url);

    // 🔥 VERIFICAR SI HAY URL Y NO ES VACÍA
    if (this.data?.url && this.data.url.trim() !== '') {
      console.log('📸 CAPS tiene URL de imagen:', this.data.url);
      this.capsForm.patchValue({ url: this.data.url });

      this.fileUrl = `${environment.apiUrl}${this.data.url}`;
      console.log('🖼️ URL completa construida:', this.fileUrl);
    } else {
      console.log('❌ CAPS sin URL de imagen válida');
      
      // 🔥 SI NO HAY URL EN DATA, INTENTAR OBTENERLA DEL SERVIDOR
      if (this.data?.id) {
        console.log('🔄 Intentando obtener URL desde el servidor...');
        this.capsService.getById(this.data.id).subscribe(
          (capsCompleto) => {
            console.log('✅ CAPS completo desde servidor:', capsCompleto);
            if (capsCompleto.url && capsCompleto.url.trim() !== '') {
              console.log('📸 URL encontrada en servidor:', capsCompleto.url);
              this.capsForm.patchValue({ url: capsCompleto.url });
              this.fileUrl = `${environment.apiUrl}${capsCompleto.url}`;
              
              // 🔥 ACTUALIZAR EL DATA OBJETO
              this.data.url = capsCompleto.url;
            }
            // ...nuevo: si el detalle trae 'servicios', asignarlos al control 'servicio'
          if (capsCompleto.servicios && Array.isArray(capsCompleto.servicios)) {
            this.capsForm.patchValue({ servicio: capsCompleto.servicios });
          }
          },
          (error) => {
            console.error('❌ Error al obtener CAPS desde servidor:', error);
          }
        );
      }
    }
    
    this.initialData = this.capsForm.value;
    console.log('💾 Datos iniciales del formulario:', this.capsForm.value);
  }

  isModified(): boolean {
    if (!this.data) {
      // Para CAPS nuevos, considerar modificado si hay datos o archivo seleccionado válido
      return this.capsForm.dirty || (this.selectedFile !== null && !this.isDuplicateImage);
    }
    
    // Para CAPS existentes, comparar con datos iniciales
    const currentValue = this.capsForm.value;
    const hasFormChanges = JSON.stringify(currentValue) !== JSON.stringify(this.initialData);
    const hasImageChanges = this.selectedFile !== null && !this.isDuplicateImage;
    
    return hasFormChanges || hasImageChanges;
  }

  listLocalidad(): void {
    this.localidadService.list().subscribe(data => {
      this.localidades = data;
    }, error => {
      console.log(error);
    });
  }
  listServicios(): void {
  this.servicioService.list().subscribe(
    data => {
      this.servicios = data.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    },
    error => {
      console.log(error);
    }
  );
}

  listRegion(): void {
    this.regionService.list().subscribe(data => {
      this.regiones = data;
    }, error => {
      console.log(error);
    });
  }

  listHospital(): void {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });
  }

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.capsForm.get('nombre')?.setValue(uppercaseValue);
  }
  
onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.types.includes('Files') && !this.isDragOver) {
      this.isDragOver = true;
      this.uploadError = null;
      console.log('🎯 Drag enter - Activado');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.types.includes('Files')) {
      this.isDragOver = true;
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    } else {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    if (target && (!relatedTarget || !target.contains(relatedTarget))) {
      this.isDragOver = false;
      console.log('🚪 Drag leave - Desactivado');
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragOver = false;
    console.log('📂 Drop event triggered - Estado reseteado');
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      console.log('📁 Archivo detectado:', files[0].name);
      this.handleFileSelection(files[0]);
    } else {
      console.log('❌ No se detectaron archivos en el drop');
    }
  }

  resetDragState(): void {
    this.isDragOver = false;
    console.log('🔄 Estado de drag reseteado manualmente');
  }

  onMouseLeave(event: MouseEvent): void {
    if (!event.buttons) {
      this.resetDragState();
    }
  }

  handleFileSelection(file: File | null): void {
    if (!file) {
      this.uploadError = 'No se seleccionó ningún archivo';
      this.toastr.warning(this.uploadError);
      return;
    }

    // 🔥 VALIDAR SOLO JPG Y PNG
  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    this.uploadError = 'Solo se permiten imágenes JPG o PNG';
    this.toastr.error(this.uploadError);
    return;
  }

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'El archivo no puede ser mayor a 5MB';
      this.toastr.error(this.uploadError);
      return;
    }

    // 🔥 VERIFICAR SI ES EL MISMO ARCHIVO QUE YA ESTÁ SELECCIONADO
    if (this.selectedFile && this.isSameFile(this.selectedFile, file)) {
      this.toastr.info('Este archivo ya está seleccionado');
      return;
    }

    // 🔥 RESETEAR ESTADO DE DUPLICADO
    this.isDuplicateImage = false;
    this.uploadError = null;
    this.selectedFile = file;

    // 🔥 MOSTRAR PREVIEW LOCAL INMEDIATAMENTE
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileUrl = e.target.result;
    };
    reader.readAsDataURL(file);

    // 🔥 VERIFICAR DUPLICADO SI ES CAPS EXISTENTE
    if (this.data?.id) {
      this.checkImageDuplicateOnSelection();
    } else {
      this.toastr.info('Imagen seleccionada. Se subirá cuando se cree el CAPS.');
    }
  }

  private checkImageDuplicateOnSelection(): void {
    if (!this.selectedFile || !this.data?.id) return;

    console.log('🔍 Verificando si la imagen ya existe al seleccionar:', this.selectedFile.name);
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.capsService.checkImageDuplicate(this.data.id, formData).subscribe(
      (response: any) => {
        this.isUploading = false;
        console.log('🔍 Respuesta de verificación de duplicado:', response);
        
        if (response.isDuplicate) {
          this.handleDuplicateImageOnSelection(response);
        } else {
          this.isDuplicateImage = false;
          this.uploadError = null;
          this.toastr.success('Imagen válida. Se subirá al guardar los cambios.', 'Imagen nueva');
        }
      },
      (error) => {
        this.isUploading = false;
        console.error('❌ Error al verificar imagen:', error);
        
        this.isDuplicateImage = false;
        this.uploadError = null;
        this.toastr.warning('No se pudo verificar la imagen. Se intentará subir al guardar.', 'Verificación fallida');
      }
    );
  }

  private handleDuplicateImageOnSelection(response: any): void {
    console.log('⚠️ Imagen duplicada detectada en selección:', response);
    
    this.isDuplicateImage = true;
    this.uploadError = `Esta imagen ya existe: ${response.existingFile}`;

    this.selectedFile = null;
    this.fileUrl = `${environment.apiUrl}${response.url}`;
    this.capsForm.patchValue({ url: response.url });
    
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.toastr.error(
      `La imagen "${response.existingFile}" ya existe en este CAPS. Seleccione una imagen diferente.`,
      'Imagen duplicada',
      { 
        timeOut: 8000,
        closeButton: true,
        progressBar: true 
      }
    );
  }

  openFileSelector(): void {
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.uploadError = null;
    
    if (!this.data || !this.data.id) {
      this.fileUrl = null;
    }
    
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.toastr.info('Archivo removido');
  }

  getFileInfo(): string {
    if (!this.selectedFile) return '';
    
    const size = this.selectedFile.size;
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);
    return `${this.selectedFile.name} (${sizeInMB} MB)`;
  }

  getDropAreaClasses(): string {
    let classes = 'file-drop-area';
    
    if (this.isUploading) {
      classes += ' uploading';
    } else if (this.isDragOver) {
      classes += ' drag-over';
    } else if (this.selectedFile && !this.uploadError) {
      classes += ' has-file';
    } else if (this.uploadError) {
      classes += ' error';
    }
    
    return classes;
  }

  // Normaliza cambios de selección (si vienen solo ids en lugar de objetos)
onServicioChange(): void {
  const val = this.capsForm.get('servicio')?.value;
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'number') {
    const mapped = (val as number[]).map(id => this.servicios.find(s => s.id === id)).filter(Boolean);
    this.capsForm.patchValue({ servicio: mapped }, { emitEvent: false });
  }
  this.capsForm.get('servicio')?.updateValueAndValidity();
}

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  private isSameFile(file1: File, file2: File): boolean {
    return file1.name === file2.name && 
           file1.size === file2.size && 
           file1.lastModified === file2.lastModified;
  }

  deleteImage(): void {
    if (!this.data || !this.data.id) {
      this.toastr.error('No se puede eliminar la imagen');
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar la imagen? Esto también eliminará la carpeta si está vacía.')) {
      this.capsService.deleteImage(this.data.id).subscribe(
        (response: any) => {
          this.fileUrl = null;
          this.capsForm.patchValue({ url: null });
          this.capsForm.markAsDirty();
          
          this.toastr.success(response.mensaje || 'Imagen eliminada correctamente');
        },
        (error) => {
          console.error('Error al eliminar la imagen:', error);
          let errorMessage = 'Error al eliminar la imagen';
          if (error.error && error.error.mensaje) {
            errorMessage = error.error.mensaje;
          }
          this.toastr.error(errorMessage);
        }
      );
    }
  }

  private uploadImageAfterCreation(capsId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!this.selectedFile) {
      console.log('❌ No hay archivo seleccionado para subir');
      resolve(null);
      return;
    }

    console.log('🔄 Iniciando subida de imagen para CAPS ID:', capsId);
    console.log('📁 Archivo seleccionado:', this.selectedFile.name);
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.capsService.uploadImage(capsId, formData).subscribe(
      (response: any) => {
        console.log('✅ Imagen subida exitosamente después de crear CAPS:', response);
        console.log('📝 URL de la imagen:', response.url);
        
        this.isUploading = false;
        this.fileUrl = `${environment.apiUrl}${response.url}`;
        
        // 🔥 LIMPIAR INPUT FILE
        const fileInput = document.getElementById('archivo') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedFile = null;
        
        // 🔥 AGREGAR MENSAJE DE ÉXITO COMO EN HOSPITAL Y MINISTERIO
        this.toastr.success('CAPS e imagen guardados correctamente');
        
        resolve(response);
      },
      (error) => {
        console.error('❌ Error al subir imagen después de crear CAPS:', error);
        this.isUploading = false;
        this.selectedFile = null;
        reject(error);
      }
    );
  });
}

  private uploadImageAfterUpdate(capsId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!this.selectedFile) {
      resolve(null);
      return;
    }

    console.log('🔄 Iniciando subida real de imagen para CAPS actualizado ID:', capsId);
    console.log('📁 Archivo seleccionado:', this.selectedFile.name);
    
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.capsService.uploadImage(capsId, formData).subscribe(
      (response: any) => {
        console.log('✅ Imagen subida exitosamente después de actualizar CAPS:', response);
        console.log('📝 URL de la imagen:', response.url);
        
        this.fileUrl = `${environment.apiUrl}${response.url}`;
        
        // 🔥 LIMPIAR INPUT FILE
        const fileInput = document.getElementById('archivo') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedFile = null;
        
        // 🔥 AGREGAR MENSAJE DE ÉXITO
        this.toastr.success('CAPS e imagen actualizados correctamente');
        
        resolve(response);
      },
      (error) => {
        console.error('❌ Error al subir imagen después de actualizar CAPS:', error);
        this.selectedFile = null;
        reject(error);
      }
    );
  });
}

  saveCaps(): void {
    if (this.capsForm.valid) {
      const formValue = this.capsForm.value;

       // Extraer array de ids de servicios (soporta objetos o ids)
      const servicioIds: number[] = (formValue.servicio || []).map((s: any) => {
        if (s == null) return s;
        return typeof s === 'number' ? s : (s.id ?? s);
      }).filter((id: any) => id != null);

      // Payload plano (como en hospital-edit): enviar lista de servicios por ids y campos necesarios
      const payload: any = {
        nombre: (formValue.nombre || '').toUpperCase(),
        domicilio: formValue.domicilio,
        telefono: formValue.telefono || '',
        observacion: formValue.observacion || '',
        idRegion: formValue.region?.id ?? null,
        idLocalidad: formValue.localidad?.id ?? null,
        idCabecera: formValue.cabecera?.id ?? null,
        tipoCaps: formValue.tipoCaps,
        areaProgramatica: this.data ? this.data.areaProgramatica : 1,
        idServicios: servicioIds
        // NO incluir url aquí: la url se agrega luego tras subir la imagen
      };

      console.log('🚀 Payload a enviar (create/update) para CAPS con idServicios:', payload);
 
      if (this.data && this.data.id) {
        // 🔥 ACTUALIZACIÓN DE CAPS EXISTENTE (usar payload + url)
        const updatePayload = { ...payload, url: formValue.url || '' };
        this.capsService.update(this.data.id, updatePayload).subscribe(
           async (result) => {
             console.log('✅ CAPS actualizado:', result);
             
             // 🔥 SUBIR IMAGEN DESPUÉS DE ACTUALIZAR SI HAY UNA SELECCIONADA
             if (this.selectedFile) {
               console.log('📤 Subiendo imagen después de actualizar CAPS...');
               try {
                 this.isUploading = true;
                 const uploadResponse = await this.uploadImageAfterUpdate(this.data.id!);
                
                if (uploadResponse && uploadResponse.url) {
                  this.capsForm.patchValue({ url: uploadResponse.url });
                  this.fileUrl = `${environment.apiUrl}${uploadResponse.url}`;
                  result.url = uploadResponse.url;
                }
                
               } catch (uploadError) {
                 console.error('❌ Error al subir imagen:', uploadError);
                 this.toastr.warning('CAPS actualizado pero hubo un error al subir la imagen');
               } finally {
                 this.isUploading = false;
               }
             }
             
             this.selectedFile = null;
             this.initialData = { ...this.capsForm.value };
             
             this.dialogRef.close({ type: 'save', data: result });
           },
           error => {
             console.error('❌ Error al actualizar CAPS:', error);
             this.dialogRef.close({ type: 'error', data: error });
           }
         );
       } else {
  // 🔥 CREACIÓN DE NUEVO CAPS (usar payload plano)
  this.capsService.save(payload).subscribe(
     async (capsCreado) => {
       console.log('✅ CAPS creado exitosamente:', capsCreado);
      console.log('🔍 ID del CAPS creado:', capsCreado.id);
      console.log('🔍 ¿Hay archivo seleccionado?:', !!this.selectedFile);
      console.log('🔍 Nombre del archivo:', this.selectedFile?.name);
       
       this.data = capsCreado;
       
       if (this.selectedFile && capsCreado.id) {
         console.log('📤 Subiendo imagen después de crear CAPS...');
         try {
           const uploadResponse = await this.uploadImageAfterCreation(capsCreado.id);
           
           if (uploadResponse && uploadResponse.url) {
             console.log('🎯 Actualizando formulario con URL:', uploadResponse.url);
             this.capsForm.patchValue({ url: uploadResponse.url });
             this.fileUrl = `http://localhost:8080${uploadResponse.url}`;
             capsCreado.url = uploadResponse.url;
             console.log('✅ URL actualizada en capsCreado:', capsCreado.url);
           } else {
             console.log('⚠️ No se recibió URL en uploadResponse');
           }
           
         } catch (uploadError) {
           console.error('❌ Error al subir imagen:', uploadError);
           this.toastr.warning('CAPS creado pero hubo un error al subir la imagen');
         }
       } else {
         console.log('ℹ️ No hay imagen seleccionada para subir o no hay ID');
         this.toastr.success('CAPS creado correctamente');
       }
       
       console.log('🏁 Cerrando diálogo con datos:', capsCreado);
       this.dialogRef.close({ type: 'save', data: capsCreado });
     },
     error => {
       console.error('❌ Error al crear CAPS:', error);
       this.dialogRef.close({ type: 'error', data: error });
     }
   );
 }
    }
  }
  
  // Comparador para localidad (usado por el template)
compareLocalidad(a: any, b: any): boolean {
  if (!a || !b) return false;
  return a.id === b.id;
}

// Comparador para región (usado por el template)
compareRegion(a: any, b: any): boolean {
  if (!a || !b) return false;
  return a.id === b.id;
}

// Comparador para servicio (necesario para multiselect de servicios)
compareServicio(a: any, b: any): boolean {
  if (!a || !b) return false;
  return a.id === b.id;
}

// Retorna true si todos los servicios disponibles están seleccionados
areAllServiciosSelected(): boolean {
  if (!this.capsForm) return false;
  const selected: any[] = this.capsForm.get('servicio')?.value || [];
  if (!this.servicios || this.servicios.length === 0) return false;
  return this.servicios.every(s => selected.some((sel: any) => sel && sel.id === s.id));
}

// Alterna selección de todos los servicios
toggleAllServicios(ev: MouseEvent): void {
  ev.stopPropagation();
  if (!this.capsForm) return;
  if (this.areAllServiciosSelected()) {
    this.capsForm.patchValue({ servicio: [] });
  } else {
    this.capsForm.patchValue({ servicio: this.servicios ? this.servicios.slice() : [] });
  }
  this.capsForm.get('servicio')?.markAsTouched();
  this.capsForm.get('servicio')?.updateValueAndValidity();
}

compareHospital(p1: Hospital, p2: Hospital): boolean {
  return p1 && p2 ? p1.id === p2.id : p1 === p2;
}
/* compareHospital(hospitalId: number, hospital: Hospital): boolean {
  return hospital ? hospital.id === hospitalId : false;
} */

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
