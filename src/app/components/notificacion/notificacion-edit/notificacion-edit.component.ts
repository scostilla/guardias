import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EfectorSummaryDto } from 'src/app/dto/Configuracion/efector/EfectorSummaryDto';
import { NotificacionDto } from 'src/app/dto/NotificacionDto';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-notificacion-edit',
  templateUrl: './notificacion-edit.component.html',
  styleUrls: ['./notificacion-edit.component.css']
})
export class NotificacionEditComponent implements OnInit {
  form?: FormGroup;
  esEdicion?: boolean;
  hasChanges: boolean = false;
  private originalSnapshot?: {
    tipo: string;
    categoria: string;
    fechaNotificacion: string | null;
    detalle: string;
    hospitalIds: number[];
    url: string;
    tipoGuardia: string; // <-- agregado
  };
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  hospitales: (EfectorSummaryDto & { regionId?: number })[] = [];
  regiones: any[] = [];

  notificacionDto: NotificacionDto | undefined;
  isDragOver: boolean = false;
  isUploading: boolean = false;
  uploadError: string | null = null;
  private originalIds: number[] = [];
  private listasCargadas = { regiones: false, hospitales: false };
  private readonly API_BASE = environment.apiUrl; // para construir URL absoluta
  sanitizedPdfUrl?: SafeResourceUrl;

  private regionHospitalCache: Map<number, EfectorSummaryDto[]> = new Map();
  private previousRegionIds: number[] = []; // <- NUEVO: para detectar regiones removidas
  // private readonly SELECT_ALL_SENTINEL = '__ALL__'; // <- antes privado causaba el error 2341
  readonly SELECT_ALL_SENTINEL = '__ALL__'; // ahora accesible desde el template

  private regionHospitalMap: Map<number, number[]> = new Map(); // mapa región -> ids hospitales

  // Fecha original traída desde backend (usada para validaciones de edición)
  private originalFecha?: Date | null;

  // Fecha mínima que usará el datepicker (se ajusta en ngOnInit)
  minFecha: Date = this.startOfDay(new Date());

  today: Date = new Date(); // límite mínimo para fecha
  noPastDate: ValidatorFn = (control: AbstractControl) => {
    const v = control.value;
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    const hoy = new Date();
    d.setHours(0,0,0,0);
    hoy.setHours(0,0,0,0);
    return d < hoy ? { pastDate: true } : null;
  };

  context: string = 'NOTIFICACION';
  contextLabel: string = 'Notificación';

  // Opciones para "Referencia" en DIGESTO
  referenciaOptions: string[] = [
    'LEY',
    'DECRETO',
    'RESOLUCION',
    'CIRCULAR',
    'MEMORANDUM',
    'OTROS'
  ];

  constructor(
    private fb: FormBuilder,
    private notificacionService: NotificacionService,
    private dialogRef: MatDialogRef<NotificacionEditComponent>,
    private hospitalService: HospitalService,
    private regionService: RegionService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  // Normaliza una fecha al inicio del día (00:00:00)
  private startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  
  // Parsea valores de fecha: soporta 'YYYY-MM-DD', Date y otras cadenas ISO.
  private parseDateLocal(value: any): Date | null {
    if (!value) return null;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, day] = value.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(day)) {
        return this.startOfDay(new Date(y, m - 1, day));
      }
      return null;
    }
    if (value instanceof Date) return this.startOfDay(value);
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : this.startOfDay(d);
  }

  // Validador: obliga fecha >= hoy + days (days = 0 => hoy, days = 1 => mañana)
  private minDateFromToday(days: number): ValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value;
      if (!v) return null;
      const d = v instanceof Date ? this.startOfDay(v) : this.parseDateLocal(v);
      if (!d) return { invalidDate: true };
      const hoy = this.startOfDay(new Date());
      const min = new Date(hoy);
      min.setDate(min.getDate() + days);
      return d < min ? { minDate: { requiredFrom: min.toISOString().split('T')[0] } } : null;
    };
  }

  ngOnInit(): void {
    // data puede ser { notificacion, context } o el objeto legacy
    const payload = this.data && this.data.notificacion !== undefined ? this.data.notificacion : this.data;
    const ctx = this.data && this.data.context ? String(this.data.context).trim().toUpperCase() : null;
    if (ctx) {
      this.context = ctx;
      this.contextLabel = ctx === 'DIGESTO' ? 'Digesto' : 'Notificación';
    }

    // IDs originales (efectores: solo hospitales ahora) => usar payload
    const idsBackend = (payload?.idEfectores && payload.idEfectores.length > 0)
      ? payload.idEfectores
      : (payload?.efectores ? payload.efectores.map((e: any) => e.id) : []);

    this.originalIds = [...idsBackend];

    // Inicializar formulario usando payload (no this.data)
    this.form = this.fb.group({
      id: [payload ? payload.id : null],
      tipo: [payload ? payload.tipo : '', Validators.required],
      // Tipo Guardia: inicial vacío (se obliga solo si es DIGESTO)
      tipoGuardia: [ payload ? (payload.tipoGuardia || '') : '' ],
      categoria: [payload ? payload.categoria : '', Validators.required],
      fechaNotificacion: [payload ? payload.fechaNotificacion : '', Validators.required],
      detalle: [payload ? payload.detalle : '', Validators.required],
      url: [payload ? payload.url : ''],
      regionIds: [[]],
      hospitalIds: [[], Validators.required]
    }, { validator: this.requireEfector });

    // Forzar siempre el tipo (edición: payload.tipo, creación: context) y deshabilitar el control
    const tipoValor = (payload && payload.tipo) ? payload.tipo : (this.context || 'NOTIFICACION');
    this.form.patchValue({ tipo: tipoValor });
    this.form.get('tipo')?.disable();

    // Si es DIGESTO, exigir selección de tipoGuardia
    if (this.context === 'DIGESTO') {
      this.form.get('tipoGuardia')?.setValidators([Validators.required]);
      this.form.get('tipoGuardia')?.updateValueAndValidity({ emitEvent: false });
    }
    
    // Determinar modo edición correctamente
    this.esEdicion = !!payload && !!payload.id;

    // Si es DIGESTO: conservar fecha original en edición, usar hoy en creación.
    // En ambos casos deshabilitamos el control para que no sea editable.
    if (this.context === 'DIGESTO') {
      const fc = this.form.get('fechaNotificacion');
      if (this.esEdicion) {
        // Si el payload trae fecha la usamos tal cual (si viene como 'YYYY-MM-DD' la parseamos sin shift UTC)
        if (payload && payload.fechaNotificacion) {
          if (typeof payload.fechaNotificacion === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(payload.fechaNotificacion)) {
            const [y, m, day] = payload.fechaNotificacion.split('-').map(Number);
            fc?.setValue(new Date(y, m - 1, day));
          } else {
            fc?.setValue(new Date(payload.fechaNotificacion));
          }
        }
      } else {
        // Creación: fijar a hoy
        fc?.setValue(new Date());
      }
      fc?.disable();
    } else {
      // No DIGESTO:
      const hoy = this.startOfDay(new Date());
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);
      // Definir minFecha según si es edición (mañana) o creación (hoy)
      if (this.esEdicion) {
        this.minFecha = manana;
        // Al editar notificaciones, la nueva fecha debe ser al menos mañana
        this.form.get('fechaNotificacion')?.setValidators([this.minDateFromToday(1), Validators.required]);
      } else {
        this.minFecha = hoy;
        // Creación: mínimo hoy
        this.form.get('fechaNotificacion')?.setValidators([this.minDateFromToday(0), Validators.required]);
      }
      this.form.get('fechaNotificacion')?.updateValueAndValidity({ emitEvent: false });
    }
    
    // Si estamos CREANDO, fijar el tipo según el contexto y deshabilitar el control
    if (!this.esEdicion && this.context) {
      this.form.patchValue({ tipo: this.context });
      this.form.get('tipo')?.disable();
    }

    // El bloque que deshabilitaba siempre NOTIFICACION se eliminó para permitir edición cuando corresponda

    if (!this.esEdicion) {
      const fc = this.form?.get('fechaNotificacion');
      fc?.addValidators(this.noPastDate);
      fc?.updateValueAndValidity({ emitEvent: false });
    }

    if (this.esEdicion && payload?.url) {
      this.fileUrl = this.buildFullUrl(payload.url);
      this.updateSanitized();
    }

    this.form!.valueChanges.subscribe(() => this.recomputeHasChanges());

    // Cambiado: cargar siempre las listas al abrir (creación y edición)
    // así los selects muestran opciones inmediatamente (sin esperar openedChange)
    this.loadData();
  }

  // Si ambas listas están cargadas, construir el mapa de región->hospitales.
  // preserveSelection: true evita re-marcado masivo (usar en edición), false para creación.
  private maybeBuildRegionMap(): void {
    if (!this.listasCargadas.regiones || !this.listasCargadas.hospitales) return;
    const selHosps = this.form?.get('hospitalIds')?.value || this.filtrarOriginalesHospital();
    // Siempre preservamos la selección inicial al construir el mapa automáticamente,
    // para evitar que la carga inicial (creación) autoselecione todos los hospitales.
    this.buildRegionMapAndMark(selHosps, true);
  }

  // Carga perezosa de regiones/hospitales (se llaman desde template openedChange)
  loadRegionsIfNeeded(): void {
    if (this.listasCargadas.regiones) return;
    // usar el endpoint resumido que devuelve id/nombre (listSummary)
    this.regionService.listSummary().subscribe({
      next: data => {
        this.regiones = data;
        this.listasCargadas.regiones = true;
        this.maybeBuildRegionMap();
      },
      error: err => console.error('Error regiones', err)
    });
  }
  loadHospitalsIfNeeded(): void {
    if (this.listasCargadas.hospitales) return;
    this.hospitalService.listSelection().subscribe({
      next: data => {
        this.hospitales = data;
        this.listasCargadas.hospitales = true;
        this.intentarAsignarSeleccionInicial();
        this.maybeBuildRegionMap();
      },
      error: err => console.error('Error hospitales', err)
    });
  }
  onRegionsOpen(opened: boolean): void { if (opened) this.loadRegionsIfNeeded(); }
  onHospitalsOpen(opened: boolean): void { if (opened) this.loadHospitalsIfNeeded(); }

  // Ajustado: sólo hospitales
  private filtrarOriginalesHospital(): number[] {
    return this.hospitales.filter(h => this.originalIds.includes(h.id)).map(h => h.id);
  }

  requireEfector(group: FormGroup) {
    const hosps = group.controls['hospitalIds']?.value as any[] || [];
    return (hosps.length === 0) ? { requireEfector: true } : null;
  }

  private normalizeFecha(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = v instanceof Date ? v : new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().substring(0, 10);
  }

  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  private buildOriginalSnapshot(): void {
    if (!this.form) return;
    // usar getRawValue() para incluir controles deshabilitados (tipo puede estar disabled)
    // Usar getRawValue() para incluir 'tipo' aun cuando esté deshabilitado
    const v = this.form.getRawValue();
    const hospIds = ((v.hospitalIds as any[]) || [])
      .filter(x => x !== this.SELECT_ALL_SENTINEL)
      .map(Number)
      .sort((x, y) => x - y);
    this.originalSnapshot = {
      tipo: v.tipo || '',
      categoria: v.categoria || '',
      fechaNotificacion: this.normalizeFecha(v.fechaNotificacion),
      detalle: v.detalle || '',
      hospitalIds: hospIds,
      url: v.url || '',
      tipoGuardia: v.tipoGuardia || '' // <-- capturar valor inicial
    };
    // Debug
    // console.log('[SNAPSHOT] Original =>', this.originalSnapshot);
  }

  private recomputeHasChanges(): void {
    if (!this.form) return;
    if (!this.originalSnapshot) {
      // Hasta construir snapshot no habilitamos cambios para evitar falsos positivos
      this.hasChanges = false;
      return;
    }
    // usar getRawValue() para leer 'tipo' incluso si está deshabilitado
    const v = this.form.getRawValue();
    const currentHosp = ((this.form.get('hospitalIds')?.value as any[]) || [])
       .filter(x => x !== this.SELECT_ALL_SENTINEL)
       .map(Number)
       .sort((a, b) => a - b);
    const curr = {
      tipo: v.tipo || '',
      categoria: v.categoria || '',
      fechaNotificacion: this.normalizeFecha(v.fechaNotificacion),
      detalle: v.detalle || '',
      hospitalIds: currentHosp,
      url: v.url || '',
      tipoGuardia: v.tipoGuardia || '' // <-- incluir en estado actual
    };

    this.hasChanges =
      curr.tipo !== this.originalSnapshot.tipo ||
      curr.categoria !== this.originalSnapshot.categoria ||
      curr.detalle !== this.originalSnapshot.detalle ||
      curr.url !== this.originalSnapshot.url ||
      curr.fechaNotificacion !== this.originalSnapshot.fechaNotificacion ||
      curr.tipoGuardia !== this.originalSnapshot.tipoGuardia || // <-- comparar tipoGuardia
      !this.arraysEqual(curr.hospitalIds, this.originalSnapshot.hospitalIds);

    // Debug
    // console.log('[CHANGES] current=', curr, 'original=', this.originalSnapshot, 'hasChanges=', this.hasChanges);
  }

  private intentarAsignarSeleccionInicial(): void {
    if (!this.form) return;
    if (this.listasCargadas.hospitales) {
      const selHosps = this.filtrarOriginalesHospital();
      this.form.patchValue({ hospitalIds: selHosps }, { emitEvent: false });
      // Construir snapshot después de asignar selección inicial (ya estable base)
      this.buildOriginalSnapshot();
      this.recomputeHasChanges();
      if (this.esEdicion && this.listasCargadas.regiones) {
        // preserveSelection = true evita re-marcado masivo al inicializar edición
        this.buildRegionMapAndMark(selHosps, true);
      }
    }
  }

  loadData(): void {
    // Regiones
    this.regionService.listSummary().subscribe({
      next: data => {
        this.regiones = data;
        this.listasCargadas.regiones = true;
        this.maybeBuildRegionMap();
      },
      error: err => console.error('Error regiones', err)
    });

    // Hospitales
    this.hospitalService.listSelection().subscribe({
      next: data => {
        this.hospitales = data;
        this.listasCargadas.hospitales = true;
        this.intentarAsignarSeleccionInicial();
        this.maybeBuildRegionMap();
      },
      error: err => console.error('Error hospitales', err)
    });
  }

  // Nuevo handler para la opción "Seleccionar/Quitar todas" en regiones
  onToggleAllRegions(ev: MouseEvent): void {
    ev.stopPropagation();
    if (!this.form) return;
    const allIds = this.regiones.map(r => r.id);
    const currentRaw: any[] = this.form.get('regionIds')?.value || [];
    const currentValid: number[] = currentRaw.filter(v => Number.isInteger(v));
    const selectingAll = !this.areAllRegionsSelected();

    // Guardamos snapshot previo para calcular removidos correctamente
    const prev = [...currentValid];
    if (selectingAll) {
      this.form.patchValue({ regionIds: allIds }, { emitEvent: false });
    } else {
      this.form.patchValue({ regionIds: [] }, { emitEvent: false });
    }
    // Forzamos cambio manual reutilizando la lógica existente
    this.previousRegionIds = prev;
    this.onRegionChange();
    this.recomputeHasChanges();
  }

  // Nuevo handler para hospitales
  onToggleAllHospitals(ev: MouseEvent): void {
    ev.stopPropagation();
    if (!this.form) return;
    const allIds = this.hospitales.map(h => h.id);
    const selectingAll = !this.areAllHospitalsSelected();
    if (selectingAll) {
      this.form.patchValue({ hospitalIds: allIds }, { emitEvent: true });
    } else {
      this.form.patchValue({ hospitalIds: [] }, { emitEvent: true });
    }
    // forzar limpieza de sentinel si quedó temporalmente agregado
    this.onHospitalSelectionChange();
    this.recomputeHasChanges();
  }

  onHospitalSelectionChange(): void {
    if (!this.form) return;
    const raw: any[] = this.form.get('hospitalIds')?.value || [];
    const cleaned = raw.filter(v => v !== this.SELECT_ALL_SENTINEL);
    if (cleaned.length !== raw.length) {
      this.form.patchValue({ hospitalIds: cleaned }, { emitEvent: false });
      this.recomputeHasChanges();
    }
    // NUEVO: actualizar regiones según selección actual
    this.updateRegionsBasedOnHospitals();
    this.recomputeHasChanges();
  }

  // Sin cambios hasta aquí
  onRegionChange(): void {
    if (!this.form) return;
    const rawRegionIds: any[] = this.form.get('regionIds')?.value || [];

    // Filtrar sentinel y no numéricos
    const regionIds: number[] = rawRegionIds
      .filter(r => r !== this.SELECT_ALL_SENTINEL)
      .filter(r => Number.isInteger(r));

    const prev: number[] = this.previousRegionIds.filter(r => Number.isInteger(r));
    // (NO actualizamos previousRegionIds aquí, se hará al final)

    console.log('[REGION CHANGE] Regiones actuales (válidas):', regionIds, ' | Previas:', prev);
    if (rawRegionIds.some(r => r !== undefined && !Number.isInteger(r))) {
      console.warn('[REGION CHANGE] Se ignoraron ids no numéricos en regionIds:', rawRegionIds);
    }

    const addedRegions = regionIds.filter(r => !prev.includes(r));
    const removedRegions = prev.filter(r => !regionIds.includes(r));

    // REMOCIÓN (incluye quitar todas)
    if (removedRegions.length > 0 || (regionIds.length === 0 && prev.length > 0)) {
      const currentSelected: number[] = this.form.get('hospitalIds')?.value || [];
      const toRemoveFromMain = this.hospitales
        .filter(h => h.regionId && removedRegions.includes(h.regionId))
        .map(h => h.id);
      const toRemoveFromCache = removedRegions.flatMap(rid =>
        (this.regionHospitalCache.get(rid) || []).map(h => h.id)
      );
      const toRemoveSet = new Set([...toRemoveFromMain, ...toRemoveFromCache]);
      const filtered = currentSelected.filter(id => !toRemoveSet.has(id));

      console.log('[REGION CHANGE][REMOVER] Regiones quitadas:', removedRegions);
      console.log('[REGION CHANGE][REMOVER] Hospitales a desmarcar:', Array.from(toRemoveSet));
      this.form.patchValue({ hospitalIds: filtered }, { emitEvent: true });
    }

    // Sin nuevas regiones
    if (addedRegions.length === 0) {
      console.log(regionIds.length === 0
        ? '[REGION CHANGE] Sin regiones seleccionadas.'
        : '[REGION CHANGE] No hay regiones nuevas que agregar.');
      this.previousRegionIds = [...regionIds]; // actualizar al final antes de salir
      return;
    }

    console.log('[REGION CHANGE] Regiones NUEVAS a procesar (válidas):', addedRegions);

    const yaClasificados = this.hospitales.filter(
      h => h.regionId && addedRegions.includes(h.regionId)
    );
    const idsYaClasificados = yaClasificados.map(h => h.id);

    const regionesSinCache = addedRegions.filter(rid =>
      !this.regionHospitalCache.has(rid) &&
      !yaClasificados.some(h => h.regionId === rid)
    );
    const regionesSinCacheValid = regionesSinCache.filter(r => Number.isInteger(r));

    // Todas en caché
    if (regionesSinCacheValid.length === 0) {
      const cacheIds = addedRegions.flatMap(rid =>
        (this.regionHospitalCache.get(rid) || []).map(h => h.id)
      );
      addedRegions.forEach(rid => {
        const lista = this.regionHospitalCache.get(rid) || [];
        lista.forEach(h => {
          const existente = this.hospitales.find(ex => ex.id === h.id);
          if (existente && !existente.regionId) existente.regionId = rid;
          else if (!existente) this.hospitales.push({ ...h, regionId: rid });
        });
      });
      const totalAgregar = Array.from(new Set([...idsYaClasificados, ...cacheIds]));
      console.log('[REGION CHANGE] Todas ya en cache/lista. Re-agregando:', totalAgregar);
      this.autoseleccionarHospitales(totalAgregar);
      this.previousRegionIds = [...regionIds]; // actualizar antes de salir
      return;
    }

    console.log('[REGION CHANGE] Llamando backend para regiones faltantes:', regionesSinCacheValid);

    const calls = regionesSinCacheValid.map(rid =>
      this.hospitalService.listByRegion(rid).pipe(
        catchError(err => {
          if (err.status === 404) {
            console.warn(`[REGION CHANGE] Región ${rid} sin hospitales activos (404).`);
            this.regionHospitalCache.set(rid, []);
            return of([]);
          }
          if (err.status === 400) {
            console.warn(`[REGION CHANGE] Región ${rid} inválida (400). Se ignora.`);
            return of([]);
          }
          console.error(`[REGION CHANGE] Error región ${rid}:`, err);
          this.toastr.warning(`No se pudieron cargar hospitales de la región ${rid}`, 'Aviso');
          return of([]);
        })
      )
    );

    forkJoin(calls).subscribe(resArr => {
      resArr.forEach((lista, idx) => {
        const regionId = regionesSinCacheValid[idx];
        if (!this.regionHospitalCache.has(regionId)) {
          this.regionHospitalCache.set(regionId, lista);
        }
        lista.forEach(h => {
          const existente = this.hospitales.find(ex => ex.id === h.id);
          if (existente) {
            if (!existente.regionId) existente.regionId = regionId;
          } else {
            this.hospitales.push({ ...h, regionId });
          }
        });
      });
      const nuevosIds = resArr.flat().map(h => h.id);
      const totalAgregar = Array.from(new Set([...idsYaClasificados, ...nuevosIds]));
      console.log('[REGION CHANGE][AGREGAR] Hospitales añadidos tras llamadas:', totalAgregar);
      this.autoseleccionarHospitales(totalAgregar);
      this.previousRegionIds = [...regionIds]; // actualizar después de completar
    });
  }

  private autoseleccionarHospitales(ids: number[]): void {
    const current: number[] = this.form?.get('hospitalIds')?.value || [];
    const combined = Array.from(new Set([...current, ...ids]));
    console.log('[REGION CHANGE] Selección final (add) =>', combined);
    this.form?.patchValue({ hospitalIds: combined }, { emitEvent: true });
  }

  private updateSanitized(): void {
    this.sanitizedPdfUrl = this.fileUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl)
      : undefined;
  }

  onFileSelected(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (!file) { 
      this.selectedFile = null; 
      this.uploadError = 'No se seleccionó ningún archivo';
      return; 
    }
    if (file.type !== 'application/pdf') {
      this.toastr.warning('Solo se permiten archivos PDF', 'Archivo no válido');
      event.target.value = '';
      this.selectedFile = null;
      this.uploadError = 'Formato no válido';
      return;
    }
    // Máximo 10MB
    if (file.size > 10 * 1024 * 1024) {
      this.toastr.warning('El archivo supera los 10MB', 'Archivo muy grande');
      event.target.value = '';
      this.selectedFile = null;
      this.uploadError = 'Archivo muy grande';
      return;
    }
    this.selectedFile = file;
    this.fileUrl = null; // al seleccionar nuevo PDF se oculta preview anterior
    this.sanitizedPdfUrl = undefined;
    this.uploadError = null;
  }

  // Drag & Drop (similar a hospital-edit)
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.types.includes('Files')) {
      this.isDragOver = true;
      this.uploadError = null;
    }
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.isDragOver = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as HTMLElement;
    if (target && (!related || !target.contains(related))) {
      this.isDragOver = false;
    }
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fakeEvent = { target: { files } } as any;
      this.onFileSelected(fakeEvent);
    }
  }
  onMouseLeave(_: MouseEvent): void {
    this.isDragOver = false;
  }

  // Helpers
  getDropAreaClasses(): string {
    let classes = 'file-drop-area';
    if (this.isUploading) classes += ' uploading';
    else if (this.isDragOver) classes += ' drag-over';
    else if (this.selectedFile && !this.uploadError) classes += ' has-file';
    else if (this.uploadError) classes += ' error';
    return classes;
  }
  openFileSelector(): void {
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.uploadError = null;
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    if (this.esEdicion && this.data?.url) {
      // restaurar preview original si existe y se está editando
      this.fileUrl = this.buildFullUrl(this.data.url);
      this.updateSanitized();
    }
  }
  getFileInfo(): string {
    if (!this.selectedFile) return '';
    const sizeInMB = (this.selectedFile.size / (1024 * 1024)).toFixed(2);
    return `${this.selectedFile.name} (${sizeInMB} MB)`;
  }

  uploadFile(): void {
    // ...existing code (sin uso en flujo real)...
  }

  private formatDateToYMD(value: any): string | null {
    if (!value) return null;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  }

  saveNotificacion(): void {
    if (!this.form?.valid) return;
    if (!this.esEdicion && this.form.get('fechaNotificacion')?.hasError('pastDate')) {
      this.toastr.error('La fecha no puede ser anterior a hoy', 'Error');
      return;
    }

    // Requerir PDF en la creación (no en edición)
    if (!this.esEdicion && !this.selectedFile) {
      this.toastr.warning('Debe seleccionar un PDF antes de crear la notificación', 'Falta PDF');
      return;
    }
    
    // ID del registro (puede venir vacío para creación)
    const id = this.form.get('id')?.value;

    // Leer valores incluso si algún control está deshabilitado (tipo/fecha puede estar disabled)
    const raw = this.form.getRawValue(); // incluye controles deshabilitados
    const tipo = raw.tipo;
    const categoria = raw.categoria;
    const fechaNotificacionRaw = raw.fechaNotificacion; // usar raw para incluir fecha deshabilitada
    const detalle = raw.detalle;
    const url = raw.url;
    const tipoGuardia = raw.tipoGuardia; // valor del select (ACTIVA | PASIVA)

    // Filtrar sentinel antes de usar hospitalIds
    const rawHospitalIds: any[] = this.form.get('hospitalIds')?.value || [];
    const hospitalIds = rawHospitalIds
      .filter(v => v !== this.SELECT_ALL_SENTINEL)
      .map(Number);

    const idEfectores = Array.from(new Set(hospitalIds)).map(n => Number(n));
    if (idEfectores.length === 0) {
      this.toastr.warning('Debe seleccionar al menos un hospital', 'Faltan datos');
      return;
    }

    const fechaNotificacion = this.formatDateToYMD(fechaNotificacionRaw);
    if (!fechaNotificacion) {
      this.toastr.error('Fecha de notificación inválida', 'Error');
      return;
    }
    const fechaBaja: string | null = null;

    // Incluir tipoGuardia sólo para DIGESTO
    const notificacionDto: NotificacionDto = {
       tipo,
       categoria,
       detalle,
       url: url || '',
       fechaNotificacion: fechaNotificacion as any,
       fechaBaja: fechaBaja as any,
       activo: true,
       idEfectores,
      // Enviar tipoGuardia solo para DIGESTO; si no seleccionado el formulario ya bloquea por Validators.required
      tipoGuardia: (this.context === 'DIGESTO') ? tipoGuardia : undefined as any
     } as any;

    console.log('[SAVE] esEdicion:', this.esEdicion, 'idEfectores (solo hospitales):', idEfectores);

    if (this.esEdicion) {
      this.notificacionService.update(id, notificacionDto).subscribe({
        next: () => this.notificacionService.detail(id).subscribe(det => this.dialogRef.close(det)),
        error: (e) => {
          console.error('[SAVE][UPDATE] Error:', e);
          this.toastr.error('Error al actualizar la notificación');
        }
      });
      return;
    }

    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.toastr.error('El archivo no es un PDF válido', 'Error');
        return;
      }
      if (this.selectedFile.size === 0) {
        this.toastr.error('El PDF está vacío', 'Error');
        return;
      }

      this.isUploading = true;
      const efectorReferencia = idEfectores[0];
      this.notificacionService.uploadPdf(efectorReferencia, this.selectedFile, notificacionDto).subscribe({
        next: (resp) => {
          this.isUploading = false;
          if (resp?.url) this.form?.patchValue({ url: resp.url });
          const createdId = resp?.notificacionId;
            if (createdId) {
              this.notificacionService.detail(createdId).subscribe({
                next: (n) => this.dialogRef.close(n),
                error: (e) => {
                  console.error('[SAVE][UPLOAD PDF] Error detail:', e);
                  this.toastr.info('PDF subido, pero no se pudo obtener el detalle.', 'Info');
                  this.dialogRef.close(resp);
                }
              });
            } else {
              this.toastr.success('Notificación creada', 'Éxito');
              this.dialogRef.close(resp);
            }
        },
        error: (err) => {
          this.isUploading = false;
          console.error('[SAVE][UPLOAD PDF] Error:', err);
          const msg = err?.error?.mensaje || 'Error al subir el PDF';
          this.toastr.error(msg, 'Error');
        }
      });
      return;
    }

    this.notificacionService.save(notificacionDto).subscribe({
      next: (resp) => {
        this.dialogRef.close(resp);
      },
      error: (e) => {
        console.error('[SAVE][CREATE] Error:', e);
        this.toastr.error('Error al crear la notificación', 'Error');
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  private buildFullUrl(url: string): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') ? `${this.API_BASE}${url}` : `${this.API_BASE}/${url}`;
  }

  displayFileNameFromUrl(url?: string): string {
    if (!url) return '';
    const file = (url.split('/').pop() || url);
    const dot = file.lastIndexOf('.');
    const ext = dot >= 0 ? file.substring(dot) : '';
    let base = dot >= 0 ? file.substring(0, dot) : file;
    base = base.replace(/_\d+$/, '').replace(/_/g, ' ').trim();
    return base + ext;
  }

  verPdfActual(): void {
    if (!this.fileUrl) {
      this.toastr.info('No hay PDF cargado');
      return;
    }
    window.open(this.fileUrl, '_blank');
  }

  // Reemplazar helpers de "select all" por verificadores simples (se usan en template)
  areAllRegionsSelected(): boolean {
    const sel: any[] = this.form?.get('regionIds')?.value || [];
    const valid = sel.filter(r => Number.isInteger(r));
    return this.regiones.length > 0 && valid.length === this.regiones.length;
  }
  areAllHospitalsSelected(): boolean {
    const sel: any[] = this.form?.get('hospitalIds')?.value || [];
    return this.hospitales.length > 0 && sel.length === this.hospitales.length;
  }

  private buildRegionMapAndMark(selectedHospitalIds: number[], preserveSelection: boolean = false): void {
    if (!this.regiones?.length) return;

    // Filtrar regiones válidas (tienen id) y determinar cuáles requieren petición al backend
    const regionesValidas = this.regiones.filter(r => Number.isInteger((r as any).id)) as any[];
    const regionesParaPedir = regionesValidas.filter(r => {
      const rid = Number(r.id);
      const enCache = this.regionHospitalCache.has(rid);
      const yaEnLista = this.hospitales.some(h => h.regionId === rid);
      return !enCache && !yaEnLista;
    });

    // Si no hay regiones a pedir, reconstruir el mapa a partir de cache + hospitales existentes
    if (regionesParaPedir.length === 0) {
      this.regionHospitalMap.clear();
      regionesValidas.forEach(r => {
        const rid = Number(r.id);
        const hospitalIdsFromCache = (this.regionHospitalCache.get(rid) || []).map((h: any) => h.id);
        const hospitalIdsFromList = this.hospitales.filter(h => h.regionId === rid).map(h => h.id);
        const ids = Array.from(new Set([...hospitalIdsFromCache, ...hospitalIdsFromList]));
        this.regionHospitalMap.set(rid, ids);
      });
      this.updateRegionsBasedOnHospitals(selectedHospitalIds);
      this.recomputeHasChanges();
      return;
    }

    // Crear llamadas solo para las regiones faltantes
    const calls = regionesParaPedir.map(r =>
      this.hospitalService.listByRegion(r.id).pipe(
        catchError(err => {
          // Si backend devuelve 404 (sin hospitales) lo tratamos como lista vacía y guardamos en cache
          if (err?.status === 404) {
            this.regionHospitalCache.set(Number(r.id), []);
            console.warn(`[REGION CHANGE] Región ${r.id} sin hospitales activos (404).`);
            return of([]);
          }
          // Para otros errores registramos una advertencia y devolvemos lista vacía para seguir el flujo
          console.warn(`[REGION CHANGE] Error obteniendo hospitales de región ${r.id}:`, err);
          this.toastr.warning(`No se pudieron cargar hospitales de la región ${r.id}`, 'Aviso');
          return of([]);
        })
      )
    );

    forkJoin(calls).subscribe(resultsArr => {
      // Guardar en cache los resultados recibidos (coinciden en orden con regionesParaPedir)
      resultsArr.forEach((lista, idx) => {
        const regionId = Number(regionesParaPedir[idx].id);
        if (!this.regionHospitalCache.has(regionId)) {
          this.regionHospitalCache.set(regionId, lista || []);
        }
        // Inyectar regionId en hospitales nuevos y añadirlos si no existen
        (lista || []).forEach((h: any) => {
          const existente = this.hospitales.find(ex => ex.id === h.id);
          if (existente) {
            if (!existente.regionId) existente.regionId = regionId;
          } else {
            this.hospitales.push({ ...h, regionId });
          }
        });
      });

      // Ahora construir el mapa con todas las regiones (cache + hospitales ya presentes)
      this.regionHospitalMap.clear();
      regionesValidas.forEach(r => {
        const rid = Number(r.id);
        const hospitalIdsFromCache = (this.regionHospitalCache.get(rid) || []).map((h: any) => h.id);
        const hospitalIdsFromList = this.hospitales.filter(h => h.regionId === rid).map(h => h.id);
        const ids = Array.from(new Set([...hospitalIdsFromCache, ...hospitalIdsFromList]));
        this.regionHospitalMap.set(rid, ids);
      });

      // Auto-seleccionar hospitales según los nuevos datos y actualizar estados
      if (!preserveSelection) {
        const nuevosIds = resultsArr.flat().map((h: any) => h.id);
        const idsYaClasificados = this.hospitales.filter(h => h.regionId && regionesValidas.some(rv => rv.id === h.regionId)).map(h => h.id);
        const totalAgregar = Array.from(new Set([...idsYaClasificados, ...nuevosIds]));
        this.autoseleccionarHospitales(totalAgregar);
      } // else: mantener la selección previa (por ejemplo al abrir edición)

      this.updateRegionsBasedOnHospitals(selectedHospitalIds);
      // Mantener previousRegionIds en el estado actual del formulario (evita marcar/remarcar masivamente)
      const currentRegionIds = (this.form?.get('regionIds')?.value || [])
        .filter((r: any) => Number.isInteger(r))
        .map((r: any) => Number(r));
      this.previousRegionIds = [...currentRegionIds];
      this.recomputeHasChanges();
    });
  }

  private updateRegionsBasedOnHospitals(hospitalIdsParam?: number[]): void {
    if (!this.form) return;
    if (this.regionHospitalMap.size === 0) return; // aún no construido
    const selected: number[] = (hospitalIdsParam || this.form.get('hospitalIds')?.value || []).map(Number);
    const selSet = new Set(selected);
    const fullRegions: number[] = [];
    this.regionHospitalMap.forEach((hIds, rId) => {
      if (hIds.length > 0 && hIds.every(id => selSet.has(id))) {
        fullRegions.push(rId);
      }
    });
    // Regiones sólo se muestran si están completas; si ninguna, queda vacío
    const current: number[] = (this.form.get('regionIds')?.value || []).filter((r: any) => Number.isInteger(r));
    const changed = current.length !== fullRegions.length || current.some(r => !fullRegions.includes(r));
    if (changed) {
      this.form.patchValue({ regionIds: fullRegions }, { emitEvent: false });
      this.previousRegionIds = [...fullRegions];
      this.recomputeHasChanges();
    }
  }
}