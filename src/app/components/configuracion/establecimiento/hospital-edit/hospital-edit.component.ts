import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HospitalDto } from 'src/app/dto/Configuracion/HospitalDto';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { Region } from 'src/app/models/Configuracion/Region';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hospital-edit',
  templateUrl: './hospital-edit.component.html',
  styleUrls: ['./hospital-edit.component.css']
})
export class HospitalEditComponent implements OnInit {
  hospitalForm: FormGroup;
  initialData: any;
  localidades: Localidad[] = [];
  regiones: Region[] = []; 
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
    public dialogRef: MatDialogRef<HospitalEditComponent>,
    private hospitalService: HospitalService,
    private localidadService: LocalidadService, 
    private regionService: RegionService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Hospital
  ) {
    this.hospitalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.() ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      url: [this.data ? this.data.url : ''],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]],
      nivelComplejidad: ['', Validators.required],
      esCabecera: ['', Validators.required],
      admitePasiva: ['', Validators.required]
    });

    this.listLocalidad();
    this.listRegion();

    if (data) {
      this.hospitalForm.patchValue(data);
    }
  }

  ngOnInit(): void {

      console.log('🔍 Inicializando componente con data:', this.data);
  console.log('🔍 Verificando URL en data:', this.data?.url);
  console.log('🔍 Tipo de URL:', typeof this.data?.url);
  console.log('🔍 URL es null/undefined?:', this.data?.url == null);
  console.log('🔍 URL es string vacío?:', this.data?.url === '');

  // 🔥 VERIFICAR SI HAY URL Y NO ES VACÍA
  if (this.data?.url && this.data.url.trim() !== '') {
    console.log('📸 Hospital tiene URL de imagen:', this.data.url);
    this.hospitalForm.patchValue({ url: this.data.url });
    this.fileUrl = `${environment.apiUrl}${this.data.url}`;
    console.log('🖼️ URL completa construida:', this.fileUrl);
  } else {
    console.log('❌ Hospital sin URL de imagen válida');
    console.log('- URL original:', this.data?.url);
    console.log('- Es undefined:', this.data?.url === undefined);
    console.log('- Es null:', this.data?.url === null);
    console.log('- Es string vacío:', this.data?.url === '');
    
    // 🔥 SI NO HAY URL EN DATA, INTENTAR OBTENERLA DEL SERVIDOR
    if (this.data?.id) {
      console.log('🔄 Intentando obtener URL desde el servidor...');
      this.hospitalService.getById(this.data.id).subscribe(
        (hospitalCompleto) => {
          console.log('✅ Hospital completo desde servidor:', hospitalCompleto);
          if (hospitalCompleto.url && hospitalCompleto.url.trim() !== '') {
            console.log('📸 URL encontrada en servidor:', hospitalCompleto.url);
            this.hospitalForm.patchValue({ url: hospitalCompleto.url });
            this.fileUrl = `${environment.apiUrl}${hospitalCompleto.url}`;
            
            // 🔥 ACTUALIZAR EL DATA OBJETO
            this.data.url = hospitalCompleto.url;
          }
        },
        (error) => {
          console.error('❌ Error al obtener hospital desde servidor:', error);
        }
      );
    }
  }
  
  this.initialData = this.hospitalForm.value;
  console.log('💾 Datos iniciales del formulario:', this.hospitalForm.value);


    console.log('🔍 Inicializando componente con data:', this.data);

   if (this.data?.url) {
    console.log('📸 Hospital tiene URL de imagen:', this.data.url);
    this.hospitalForm.patchValue({ url: this.data.url });
    this.fileUrl = `${environment.apiUrl}${this.data.url}`;
  } else {
    console.log('❌ Hospital sin URL de imagen');
  }
  
  this.initialData = this.hospitalForm.value;
  console.log('💾 Datos iniciales del formulario:', this.hospitalForm.value);
}

 isModified(): boolean {
  if (!this.data) {
    // Para hospitales nuevos, considerar modificado si hay datos o archivo seleccionado
    return this.hospitalForm.dirty || this.selectedFile !== null;
  }
  
  // Para hospitales existentes, comparar con datos iniciales
  const currentValue = this.hospitalForm.value;
  const hasFormChanges = JSON.stringify(currentValue) !== JSON.stringify(this.initialData);
  const hasImageChanges = this.selectedFile !== null; // 🔥 DETECTAR SI HAY ARCHIVO SELECCIONADO
  return hasFormChanges || hasImageChanges;
}

listLocalidad(): void {
  this.localidadService.list().subscribe(
    data => {
      this.localidades = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
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

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.hospitalForm.get('nombre')?.setValue(uppercaseValue);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  onDragEnter(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  
  // Solo activar si hay archivos y no está ya activo
  if (event.dataTransfer?.types.includes('Files') && !this.isDragOver) {
    this.isDragOver = true;
    this.uploadError = null;
    console.log('🎯 Drag enter - Activado');
  }
}

  onDragOver(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  
  // Mantener el estado activo
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
  
  // 🔥 VERIFICAR SI REALMENTE SALIÓ DEL ÁREA
  const target = event.currentTarget as HTMLElement;
  const relatedTarget = event.relatedTarget as HTMLElement;
  
  // Si el relatedTarget no está dentro del currentTarget, entonces salió del área
  if (target && (!relatedTarget || !target.contains(relatedTarget))) {
    this.isDragOver = false;
    console.log('🚪 Drag leave - Desactivado');
  }
}

  onDrop(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  
  // 🔥 RESETEAR ESTADO INMEDIATAMENTE
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

// 🔥 MÉTODO PARA MANEJAR MOUSE LEAVE DEL ÁREA COMPLETA
onMouseLeave(event: MouseEvent): void {
  // Solo resetear si no estamos arrastrando algo
  if (!event.buttons) {
    this.resetDragState();
  }
}

  // 🔥 MÉTODO UNIFICADO PARA MANEJAR SELECCIÓN DE ARCHIVO
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

    // 🔥 VERIFICAR DUPLICADO SI ES HOSPITAL EXISTENTE
    if (this.data?.id) {
      this.checkImageDuplicateOnSelection();
    } else {
      this.toastr.info('Imagen seleccionada. Se subirá cuando se cree el hospital.');
    }
  }

  private checkImageDuplicateOnSelection(): void {
  if (!this.selectedFile || !this.data?.id) return;

  console.log('🔍 Verificando si la imagen ya existe al seleccionar:', this.selectedFile.name);
  
  // Mostrar indicador de verificación
  this.isUploading = true;
  
  const formData = new FormData();
  formData.append('image', this.selectedFile);

  // 🔥 USAR EL NUEVO ENDPOINT QUE SOLO VERIFICA
  this.hospitalService.checkImageDuplicate(this.data.id, formData).subscribe(
    (response: any) => {
      this.isUploading = false;
      console.log('🔍 Respuesta de verificación de duplicado:', response);
      
      if (response.isDuplicate) {
        // 🔥 IMAGEN DUPLICADA DETECTADA
        this.handleDuplicateImageOnSelection(response);
      } else {
        // 🔥 IMAGEN NUEVA - PERMITIR CONTINUAR
        this.isDuplicateImage = false;
        this.uploadError = null;
        this.toastr.success('Imagen válida. Se subirá al guardar los cambios.', 'Imagen nueva');
      }
    },
    (error) => {
      this.isUploading = false;
      console.error('❌ Error al verificar imagen:', error);
      
      // En caso de error, permitir continuar pero mostrar advertencia
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

    // 🔥 LIMPIAR SELECCIÓN Y MANTENER IMAGEN EXISTENTE
    this.selectedFile = null;
    this.fileUrl = `${environment.apiUrl}${response.url}`;
    this.hospitalForm.patchValue({ url: response.url });
    
    // 🔥 LIMPIAR INPUT FILE
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadImageWithDuplicateCheck(): void {
    if (!this.selectedFile) {
      this.toastr.warning('No se seleccionó ningún archivo');
      return;
    }

    if (!this.data || !this.data.id) {
      this.toastr.error('Debe guardar el hospital antes de subir la imagen');
      return;
    }

    console.log('🔄 Iniciando subida con verificación de duplicados:', this.data.nombre, 'ID:', this.data.id);
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.hospitalService.uploadImage(this.data.id, formData).subscribe(
      (response: any) => {
        this.isUploading = false;
        
        // 🔥 MANEJAR RESPUESTA DE DUPLICADO
        if (response.isDuplicate) {
          console.log('⚠️ Imagen duplicada detectada');
          
          // Mantener la imagen existente
          this.fileUrl = `${environment.apiUrl}${response.url}`;
          this.hospitalForm.patchValue({ url: response.url });
          
          // Limpiar selección
          this.selectedFile = null;
          const fileInput = document.getElementById('archivo') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          
          return;
        }

        // 🔥 MANEJAR CONFLICTO DE NOMBRE (409)
        if (response.isDuplicateName) {
          this.handleDuplicateNameConflict(response);
          return;
        }

        // 🔥 SUBIDA EXITOSA
        this.handleSuccessfulUpload(response);
      },
      (error) => {
        this.isUploading = false;
        
        // 🔥 MANEJAR ERROR 409 (CONFLICTO)
        if (error.status === 409 && error.error.isDuplicateName) {
          this.handleDuplicateNameConflict(error.error);
          return;
        }

        // 🔥 MANEJAR OTROS ERRORES
        console.error('❌ Error al subir la imagen:', error);
        
        let errorMessage = 'Error al subir la imagen';
        if (error.error && error.error.mensaje) {
          errorMessage = error.error.mensaje;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toastr.error(errorMessage);
        this.selectedFile = null;
      }
    );
  }

  private handleDuplicateNameConflict(response: any): void {
    this.pendingFile = this.selectedFile;
    this.isDuplicateDialogOpen = true;
    
    const message = `${response.mensaje}\n\nArchivo existente: ${response.existingFile}\nArchivo nuevo: ${response.originalName}`;
    
    if (confirm(message)) {
      // Usuario eligió reemplazar
      this.forceUploadImage();
    } else {
      // Usuario eligió cancelar
      this.toastr.info('Subida cancelada por el usuario');
      this.selectedFile = null;
      this.pendingFile = null;
      this.isDuplicateDialogOpen = false;
      
      const fileInput = document.getElementById('archivo') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  private forceUploadImage(): void {
    // Implementar endpoint especial para forzar reemplazo
    if (!this.pendingFile || !this.data?.id) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.pendingFile);
    formData.append('forceReplace', 'true'); // Flag para forzar reemplazo

    this.hospitalService.uploadImage(this.data.id, formData).subscribe(
      (response: any) => {
        this.handleSuccessfulUpload(response);
        this.pendingFile = null;
        this.isDuplicateDialogOpen = false;
      },
      (error) => {
        this.isUploading = false;
        console.error('❌ Error al forzar subida:', error);
        this.toastr.error('Error al reemplazar la imagen');
        this.pendingFile = null;
        this.isDuplicateDialogOpen = false;
      }
    );
  }

  private handleSuccessfulUpload(response: any): void {
    console.log('✅ Respuesta completa del servidor:', response);
    
    this.fileUrl = `${environment.apiUrl}${response.url}`;
    this.hospitalForm.patchValue({ url: response.url });
    this.hospitalForm.markAsDirty();
    
    this.isUploading = false;
    
    const successMessage = response.isDuplicate ? 
      `Imagen ya existente utilizada: ${response.filename}` :
      `${response.mensaje}. Guardada en: ${response.folderName}`;
    
    this.toastr.success(successMessage, 'Imagen procesada', { timeOut: 5000 });
    
    // Limpiar selección
    this.selectedFile = null;
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  

  // 🔥 MÉTODO PARA ABRIR SELECTOR DE ARCHIVOS
  openFileSelector(): void {
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // 🔥 MÉTODO PARA REMOVER ARCHIVO SELECCIONADO
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.uploadError = null;
    
    // Si es un hospital nuevo, también limpiar el preview
    if (!this.data || !this.data.id) {
      this.fileUrl = null;
    }
    
    // Limpiar el input file
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.toastr.info('Archivo removido');
  }

  // 🔥 MÉTODO PARA OBTENER INFORMACIÓN DEL ARCHIVO
  getFileInfo(): string {
    if (!this.selectedFile) return '';
    
    const size = this.selectedFile.size;
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);
    return `${this.selectedFile.name} (${sizeInMB} MB)`;
  }

  // 🔥 MÉTODO PARA DETERMINAR CLASES CSS DEL DROP AREA
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


uploadImage(): void {
    this.uploadImageWithDuplicateCheck();
  }



  private uploadImageAfterCreation(hospitalId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!this.selectedFile) {
      resolve(null);
      return;
    }

    console.log('🔄 Iniciando subida de imagen para hospital ID:', hospitalId);
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.hospitalService.uploadImage(hospitalId, formData).subscribe(
      (response: any) => {
        console.log('✅ Imagen subida exitosamente después de crear hospital:', response);
        console.log('📝 URL de la imagen:', response.url);
        
        this.isUploading = false;
        
        // 🔥 ACTUALIZAR LA URL LOCAL DE LA IMAGEN
        this.fileUrl = `${environment.apiUrl}${response.url}`;
        
        // Limpiar el input file
        const fileInput = document.getElementById('archivo') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedFile = null;
        
        // 🔥 RETORNAR LA RESPUESTA COMPLETA
        resolve(response);
      },
      (error) => {
        console.error('❌ Error al subir imagen después de crear hospital:', error);
        this.isUploading = false;
        this.selectedFile = null;
        reject(error);
      }
    );
  });
}

  saveHospital(): void {
  if (this.hospitalForm.valid) {
    const formValue = this.hospitalForm.value;

    const hospitalDto = new HospitalDto(
      formValue.nombre.toUpperCase(),
      formValue.domicilio,
      formValue.region.id,
      formValue.localidad.id,
      formValue.telefono || '',
      formValue.observacion || '',
      '', // Para nuevos hospitales
      formValue.esCabecera,
      formValue.admitePasiva,
      formValue.nivelComplejidad
    );

    console.log('🚀 HospitalDto a enviar:', hospitalDto);

    if (this.data && this.data.id) {
      // 🔥 ACTUALIZACIÓN DE HOSPITAL EXISTENTE
      hospitalDto.url = formValue.url || '';
      
      this.hospitalService.update(this.data.id, hospitalDto).subscribe(
        async (result) => {
          console.log('✅ Hospital actualizado:', result);
          
          // 🔥 SUBIR IMAGEN DESPUÉS DE ACTUALIZAR SI HAY UNA SELECCIONADA
          if (this.selectedFile) {
            console.log('📤 Subiendo imagen después de actualizar hospital...');
            try {
              this.isUploading = true;
              const uploadResponse = await this.uploadImageAfterUpdate(this.data.id!);
              
              if (uploadResponse && uploadResponse.url) {
                this.hospitalForm.patchValue({ url: uploadResponse.url });
                this.fileUrl = `${environment.apiUrl}${uploadResponse.url}`;
                result.url = uploadResponse.url;
              }
              
            } catch (uploadError) {
              console.error('❌ Error al subir imagen:', uploadError);
              this.toastr.warning('Hospital actualizado pero hubo un error al subir la imagen');
            } finally {
              this.isUploading = false;
            }
          } 
          
          // 🔥 LIMPIAR selectedFile DESPUÉS DE GUARDAR EXITOSAMENTE
          this.selectedFile = null;
          
          // 🔥 ACTUALIZAR LOS DATOS INICIALES PARA FUTURAS COMPARACIONES
          this.initialData = { ...this.hospitalForm.value };
          
          this.dialogRef.close({ type: 'save', data: result });
        },
        error => {
          console.error('❌ Error al actualizar hospital:', error);
          this.toastr.error('Error al actualizar el hospital');
        }
      );
    } else {
      // 🔥 CREACIÓN DE NUEVO HOSPITAL (sin cambios)
      this.hospitalService.save(hospitalDto).subscribe(
        async (hospitalCreado) => {
          console.log('✅ Hospital creado exitosamente:', hospitalCreado);
          
          this.data = hospitalCreado;
          
          if (this.selectedFile && hospitalCreado.id) {
            console.log('📤 Subiendo imagen después de crear hospital...');
            try {
              const uploadResponse = await this.uploadImageAfterCreation(hospitalCreado.id);
              
              if (uploadResponse && uploadResponse.url) {
                this.hospitalForm.patchValue({ url: uploadResponse.url });
                this.fileUrl = `${environment.apiUrl}${uploadResponse.url}`;
                hospitalCreado.url = uploadResponse.url;
              }
              
            } catch (uploadError) {
              console.error('❌ Error al subir imagen:', uploadError);
              this.toastr.warning('Hospital creado pero hubo un error al subir la imagen');
            }
          } else {
            this.toastr.success('Hospital creado correctamente');
          }
          
          this.dialogRef.close({ type: 'save', data: hospitalCreado });
        },
        error => {
          console.error('❌ Error al crear hospital:', error);
          this.toastr.error('Error al crear el hospital');
        }
      );
    }
  }
}

private uploadImageAfterUpdate(hospitalId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!this.selectedFile) {
      resolve(null);
      return;
    }

    console.log('🔄 Iniciando subida real de imagen para hospital actualizado ID:', hospitalId);
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.hospitalService.uploadImage(hospitalId, formData).subscribe(
      (response: any) => {
        console.log('✅ Imagen subida exitosamente después de actualizar hospital:', response);
        console.log('📝 URL de la imagen:', response.url);
        
        // 🔥 ACTUALIZAR LA URL LOCAL DE LA IMAGEN
        this.fileUrl = `${environment.apiUrl}${response.url}`;
        
        // Limpiar el input file
        const fileInput = document.getElementById('archivo') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedFile = null;
        
        resolve(response);
      },
      (error) => {
        console.error('❌ Error al subir imagen después de actualizar hospital:', error);
        this.selectedFile = null;
        reject(error);
      }
    );
  });
}
      
  deleteImage(): void {
  if (!this.data || !this.data.id) {
    this.toastr.error('No se puede eliminar la imagen');
    return;
  }

  if (confirm('¿Está seguro de que desea eliminar la imagen? Esto también eliminará la carpeta si está vacía.')) {
    this.hospitalService.deleteImage(this.data.id).subscribe(
      (response: any) => {
        this.fileUrl = null;
        this.hospitalForm.patchValue({ url: null });
        this.hospitalForm.markAsDirty();
        
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

  compareLocalidad(p1: Localidad, p2: Localidad): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareRegion(p1: Region, p2: Region): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
