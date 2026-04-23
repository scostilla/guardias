import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Region } from 'src/app/models/Configuracion/Region';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-ministerio-edit',
  templateUrl: './ministerio-edit.component.html',
  styleUrls: ['./ministerio-edit.component.css']
})
export class MinisterioEditComponent implements OnInit {
  ministerioForm: FormGroup;
  initialData: any;
  localidades: Localidad[] = [];
  regiones: Region[] = []; 
  servicios: Servicio[] = [];
  
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
    public dialogRef: MatDialogRef<MinisterioEditComponent>,
    private ministerioService: MinisterioService,
    private localidadService: LocalidadService,
    private servicioService: ServicioService,
    private regionService: RegionService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Ministerio
  ) {
    this.ministerioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.() ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      servicio: [[ ], Validators.required],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      url: [this.data ? this.data.url : ''],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]]
    });

    this.listLocalidad();
    this.listRegion();
    this.listServicio();

    if (data) {
      this.ministerioForm.patchValue(data);

      if ((data as any).servicios && Array.isArray((data as any).servicios)){
        this.ministerioForm.patchValue({ servicio: (data as any).servicios });
      }
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
      console.log('📸 Ministerio tiene URL de imagen:', this.data.url);
      this.ministerioForm.patchValue({ url: this.data.url });
      this.fileUrl = `${environment.apiUrl}${this.data.url}`; 
      console.log('🖼️ URL completa construida:', this.fileUrl);
    } else {
      console.log('❌ Ministerio sin URL de imagen válida');
      console.log('- URL original:', this.data?.url);
    console.log('- Es undefined:', this.data?.url === undefined);
    console.log('- Es null:', this.data?.url === null);
    console.log('- Es string vacío:', this.data?.url === '');
      
      // 🔥 SI NO HAY URL EN DATA, INTENTAR OBTENERLA DEL SERVIDOR
      if (this.data?.id) {
        console.log('🔄 Intentando obtener URL desde el servidor...');
        this.ministerioService.getById(this.data.id).subscribe(
          (ministerioCompleto) => {
            console.log('✅ Ministerio completo desde servidor:', ministerioCompleto);
            if (ministerioCompleto.url && ministerioCompleto.url.trim() !== '') {
              console.log('📸 URL encontrada en servidor:', ministerioCompleto.url);
              this.ministerioForm.patchValue({ url: ministerioCompleto.url });
              this.fileUrl = `${environment.apiUrl}${ministerioCompleto.url}`;
              
              // 🔥 ACTUALIZAR EL DATA OBJETO
              this.data.url = ministerioCompleto.url;
            }
            if (ministerioCompleto.servicios && Array.isArray(ministerioCompleto.servicios)){
              this.ministerioForm.patchValue({ servicio: ministerioCompleto.servicios });
            }
          },
          (error) => {
            console.error('❌ Error al obtener ministerio desde servidor:', error);
          }
        );
      }
    }
    
    this.initialData = this.ministerioForm.value;
    console.log('💾 Datos iniciales del formulario:', this.ministerioForm.value);
  
    console.log('🔍 Inicializando componente con data:', this.data);

   if (this.data?.url) {
    console.log('📸 Ministerio tiene URL de imagen:', this.data.url);
    this.ministerioForm.patchValue({ url: this.data.url });
    this.fileUrl = `http://localhost:8080${this.data.url}`;
  } else {
    console.log('❌ Ministerio sin URL de imagen');
  }

  this.initialData = this.ministerioForm.value;
  console.log('💾 Datos iniciales del formulario:', this.ministerioForm.value);
}

  isModified(): boolean {
    if (!this.data) {
      // Para ministerios nuevos, considerar modificado si hay datos o archivo seleccionado
      return this.ministerioForm.dirty || this.selectedFile !== null;
    }
    
    // Para ministerios existentes, comparar con datos iniciales
    const currentValue = this.ministerioForm.value;
    const hasFormChanges = JSON.stringify(currentValue) !== JSON.stringify(this.initialData);
    const hasImageChanges = this.selectedFile !== null;
    return hasFormChanges || hasImageChanges;
  }

  listLocalidad(): void {
    this.localidadService.list().subscribe(data => {
      this.localidades = data;
    }, error => {
      console.log(error);
    });
  }

  listServicio(): void {
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

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.ministerioForm.get('nombre')?.setValue(uppercaseValue);
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

    // 🔥 VERIFICAR DUPLICADO SI ES MINISTERIO EXISTENTE
    if (this.data?.id) {
      this.checkImageDuplicateOnSelection();
    } else {
      this.toastr.info('Imagen seleccionada. Se subirá cuando se cree el ministerio.');
    }
  }

  private checkImageDuplicateOnSelection(): void {
    if (!this.selectedFile || !this.data?.id) return;

    console.log('🔍 Verificando si la imagen ya existe al seleccionar:', this.selectedFile.name);
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.ministerioService.checkImageDuplicate(this.data.id, formData).subscribe(
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
    this.ministerioForm.patchValue({ url: response.url });
    
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.toastr.error(
      `La imagen "${response.existingFile}" ya existe en este ministerio. Seleccione una imagen diferente.`,
      'Imagen duplicada',
      { 
        timeOut: 8000,
        closeButton: true,
        progressBar: true 
      }
    );
  }

  uploadImageWithDuplicateCheck(): void {
    if (!this.selectedFile) {
      this.toastr.warning('No se seleccionó ningún archivo');
      return;
    }

    if (!this.data || !this.data.id) {
      this.toastr.error('Debe guardar el ministerio antes de subir la imagen');
      return;
    }

    console.log('🔄 Iniciando subida con verificación de duplicados:', this.data.nombre, 'ID:', this.data.id);
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.ministerioService.uploadImage(this.data.id, formData).subscribe(
      (response: any) => {
        this.isUploading = false;
        
        // 🔥 MANEJAR RESPUESTA DE DUPLICADO
        if (response.isDuplicate) {
          console.log('⚠️ Imagen duplicada detectada');
          
          // Mantener la imagen existente
          this.fileUrl = `http://localhost:8080${response.url}`;
          this.ministerioForm.patchValue({ url: response.url });
          
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

    this.ministerioService.uploadImage(this.data.id, formData).subscribe(
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
    
    this.fileUrl = `http://localhost:8080${response.url}`;
    this.ministerioForm.patchValue({ url: response.url });
    this.ministerioForm.markAsDirty();
    
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
      this.ministerioService.deleteImage(this.data.id).subscribe(
        (response: any) => {
          this.fileUrl = null;
          this.ministerioForm.patchValue({ url: null });
          this.ministerioForm.markAsDirty();
          
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

private uploadImageAfterCreation(ministerioId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(null);
        return;
      }

      console.log('🔄 Iniciando subida de imagen para ministerio ID:', ministerioId);
      this.isUploading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.ministerioService.uploadImage(ministerioId, formData).subscribe(
        (response: any) => {
          console.log('✅ Imagen subida exitosamente después de crear ministerio:', response);
          console.log('📝 URL de la imagen:', response.url);
          
          this.isUploading = false;
          this.fileUrl = `${environment.apiUrl}${response.url}`;
          
          const fileInput = document.getElementById('archivo') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.selectedFile = null;
          
          resolve(response);
        },
        (error) => {
          console.error('❌ Error al subir imagen después de crear ministerio:', error);
          this.isUploading = false;
          this.selectedFile = null;
          reject(error);
        }
      );
    });
  }

  private uploadImageAfterUpdate(ministerioId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(null);
        return;
      }

      console.log('🔄 Iniciando subida real de imagen para ministerio actualizado ID:', ministerioId);
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.ministerioService.uploadImage(ministerioId, formData).subscribe(
        (response: any) => {
          console.log('✅ Imagen subida exitosamente después de actualizar ministerio:', response);
          console.log('📝 URL de la imagen:', response.url);
          
          this.fileUrl = `${environment.apiUrl}${response.url}`;
          
          const fileInput = document.getElementById('archivo') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.selectedFile = null;
          
          resolve(response);
        },
        (error) => {
          console.error('❌ Error al subir imagen después de actualizar ministerio:', error);
          this.selectedFile = null;
          reject(error);
        }
      );
    });
  }

  saveMinisterio(): void {
    if (this.ministerioForm.valid) {
      const formValue = this.ministerioForm.value;
      
      const regionId = formValue.region ? formValue.region.id : null;
      const localidadId = formValue.localidad ? formValue.localidad.id : null;
      const cabeceraId = formValue.cabecera ? formValue.cabecera.id : null;
      const servicioIds: number[] = (formValue.servicio || []).map((s: any) => {
        if (s == null) return s;
        return typeof s === 'number' ? s : (s.id ?? s);
      }).filter((id: any) => id != null);

      const payload: any = {
        nombre:(formValue.nombre || '').toUpperCase(),
        domicilio: formValue.domicilio,
        idRegion: regionId,
        idLocalidad: localidadId,
        telefono: formValue.telefono,
        observacion: formValue.observacion,
        idCabecera: cabeceraId,
        idServicios: servicioIds
        // NO incluir url aquí: la url se agrega luego tras subir la imagen
      };

      console.log('🚀 MinisterioDto a enviar:', payload);

      if (this.data && this.data.id) {
        // 🔥 ACTUALIZACIÓN DE MINISTERIO EXISTENTE
        const updatePayload = { ...payload, url: formValue.url || '' };

        this.ministerioService.update(this.data.id, updatePayload).subscribe(
          async (result) => {
            console.log('✅ Ministerio actualizado:', result);
            
            // 🔥 SUBIR IMAGEN DESPUÉS DE ACTUALIZAR SI HAY UNA SELECCIONADA
            if (this.selectedFile) {
              console.log('📤 Subiendo imagen después de actualizar ministerio...');
              try {
                this.isUploading = true;
                const uploadResponse = await this.uploadImageAfterUpdate(this.data.id!);
                
                if (uploadResponse && uploadResponse.url) {
                  this.ministerioForm.patchValue({ url: uploadResponse.url });
                  this.fileUrl = `${environment.apiUrl}${uploadResponse.url}`;
                  result.url = uploadResponse.url;
                }
                
              } catch (uploadError) {
                console.error('❌ Error al subir imagen:', uploadError);
                this.toastr.warning('Ministerio actualizado pero hubo un error al subir la imagen');
              } finally {
                this.isUploading = false;
              }
            }
            
            this.selectedFile = null;
            this.initialData = { ...this.ministerioForm.value };
            
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('❌ Error al actualizar ministerio:', error);
            this.toastr.error('Error al actualizar el ministerio');
          }
        );
      } else {
        // 🔥 CREACIÓN DE NUEVO MINISTERIO
        this.ministerioService.save(payload).subscribe(
          async (ministerioCreado: any) => {
            
            this.data = ministerioCreado;
            
            if (this.selectedFile && ministerioCreado.id) {
              console.log('📤 Subiendo imagen después de crear ministerio...');
              try {
                const uploadResponse = await this.uploadImageAfterCreation(ministerioCreado.id);
                
                if (uploadResponse && uploadResponse.url) {
                  this.ministerioForm.patchValue({ url: uploadResponse.url });
                  this.fileUrl = `${environment.apiUrl}${uploadResponse.url}`;
                  ministerioCreado.url = uploadResponse.url;
                }
                
              } catch (uploadError) {
                console.error('❌ Error al subir imagen:', uploadError);
                this.toastr.warning('Ministerio creado pero hubo un error al subir la imagen');
              }
            } else {
              this.toastr.success('Ministerio creado correctamente');
            }
            
            this.dialogRef.close({ type: 'save', data: ministerioCreado });
          },
          error => {
            console.error('❌ Error al crear ministerio:', error);
            this.toastr.error('Error al crear el ministerio');
          }
        );
      }
    }
  }
      
  compareLocalidad(a: any, b: any): boolean {
  if (!a || !b) return false;
  return a.id === b.id;
}

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
  if (!this.ministerioForm) return false;
  const selected: any[] = this.ministerioForm.get('servicio')?.value || [];
  if (!this.servicios || this.servicios.length === 0) return false;
  return this.servicios.every(s => selected.some((sel: any) => sel && sel.id === s.id));
}

// Alterna selección de todos los servicios
toggleAllServicios(ev: MouseEvent): void {
  ev.stopPropagation();
  if (!this.ministerioForm) return;
  if (this.areAllServiciosSelected()) {
    this.ministerioForm.patchValue({ servicio: [] });
  } else {
    this.ministerioForm.patchValue({ servicio: this.servicios ? this.servicios.slice() : [] });
  }
  this.ministerioForm.get('servicio')?.markAsTouched();
  this.ministerioForm.get('servicio')?.updateValueAndValidity();
}

// Normaliza cambios de selección (si vienen solo ids en lugar de objetos)
onServicioChange(): void {
  const val = this.ministerioForm.get('servicio')?.value;
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'number') {
    const mapped = (val as number[]).map(id => this.servicios.find(s => s.id === id)).filter(Boolean);
    this.ministerioForm.patchValue({ servicio: mapped }, { emitEvent: false });
  }
  this.ministerioForm.get('servicio')?.updateValueAndValidity();
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
