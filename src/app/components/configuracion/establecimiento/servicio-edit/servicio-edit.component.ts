import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { ServicioDto } from 'src/app/dto/ServicioDto';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-servicio-edit',
  templateUrl: './servicio-edit.component.html',
  styleUrls: ['./servicio-edit.component.css']
})
export class ServicioEditComponent implements OnInit {
  servicioForm: FormGroup;
  esEdicion?: boolean;
  initialData: any;

  ministerios: Ministerio[] = [];
  hospitales: Hospital[] = [];
  caps: CapsDto[] = [];

  private initialEfectorIds: number[] = [];

  // +++ Seleccionar/Deseleccionar todos
  selectAllValue = -1;
  allMinisteriosSelected = false;
  allHospitalesSelected = false;
  allHospitalParaCapsSelected = false;
  allCapsSelected = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServicioEditComponent>,
    private toastr: ToastrService,
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
    private ministerioService: MinisterioService,
    @Inject(MAT_DIALOG_DATA) public data: Servicio
  ) {
    // ✅ evita "Blocked aria-hidden..." cuando el foco queda en el botón que abrió el dialog
    this.blurActiveElementIfInAppRoot();

    const servicioData = data ? data : ({ descripcion: '', nivel: null, critico: null } as unknown as Servicio);

    // ids iniciales (si viene servicio con efectores asociados)
    this.initialEfectorIds =
      ((servicioData as any)?.efectores ?? [])
        .map((e: any) => e?.id)
        .filter((id: any) => typeof id === 'number') ?? [];

    this.servicioForm = this.fb.group({
      descripcion: [servicioData.descripcion ?? '', Validators.required],
      nivel: [servicioData.nivel ?? null, Validators.required],
      critico: [servicioData.critico ?? null, Validators.required],

      idMinisterios: [[] as number[]],
      idHospitales: [[] as number[]],
      hospitalParaCaps: [[] as number[]],

      // ✅ arranca deshabilitado (reactive forms)
      idCaps: [{ value: [] as number[], disabled: true }],

      idEfectores: [[] as number[]],
    });

    this.esEdicion = !!data;
  }

  private blurActiveElementIfInAppRoot(): void {
    const active = document.activeElement as HTMLElement | null;
    if (!active) return;

    const appRoot = document.querySelector('app-root');
    if (appRoot && appRoot.contains(active)) {
      active.blur();
    }
  }

  ngOnInit(): void {
    forkJoin({
      ministerios: this.ministerioService.list().pipe(catchError(() => of([] as Ministerio[]))),
      hospitales: this.hospitalService.list().pipe(catchError(() => of([] as Hospital[]))),
    }).subscribe(({ ministerios, hospitales }) => {
      this.ministerios = ministerios ?? [];
      this.hospitales = hospitales ?? [];

      // hidratar selecciones iniciales (edición)
      this.hydrateInitialSelections();
    });

    this.initialData = {
      ...this.servicioForm.value,
      idMinisterios: [...(this.servicioForm.value.idMinisterios ?? [])].sort((a: number, b: number) => a - b),
      idHospitales: [...(this.servicioForm.value.idHospitales ?? [])].sort((a: number, b: number) => a - b),
      hospitalParaCaps: [...(this.servicioForm.value.hospitalParaCaps ?? [])].sort((a: number, b: number) => a - b),
      idCaps: [...(this.servicioForm.value.idCaps ?? [])].sort((a: number, b: number) => a - b),
    };
  }

  private hydrateInitialSelections(): void {
    if (!this.initialEfectorIds?.length) return;

    const ministerioIds = this.ministerios.map(m => m.id).filter((id): id is number => typeof id === 'number');
    const hospitalIds = this.hospitales.map(h => h.id).filter((id): id is number => typeof id === 'number');

    const selectedMinisterios = this.initialEfectorIds.filter(id => ministerioIds.includes(id));
    const selectedHospitales = this.initialEfectorIds.filter(id => hospitalIds.includes(id));

    // Por defecto: usar los hospitales seleccionados también para listar CAPS
    this.servicioForm.patchValue({
      idMinisterios: selectedMinisterios,
      idHospitales: selectedHospitales,
      hospitalParaCaps: selectedHospitales,
    });

    // cargar caps de esos hospitales y luego seleccionar los caps que coincidan con initialEfectorIds
    this.loadCapsForHospitals(selectedHospitales, /*preserveSelection*/ true);
  }

  onHospitalParaCapsChange(ids: number[]): void {
    this.loadCapsForHospitals(ids ?? [], /*preserveSelection*/ true);
  }

  private loadCapsForHospitals(hospitalIds: number[], preserveSelection: boolean): void {
    const ids = (hospitalIds ?? []).filter((x) => typeof x === 'number' && !isNaN(x));

    if (ids.length === 0) {
      this.caps = [];
      this.servicioForm.patchValue({ idCaps: [] }, { emitEvent: false });
      this.updateCapsControlState();
      return;
    }

    forkJoin(
      ids.map((id) =>
        this.hospitalService.listActiveCapsByHospitalId(id).pipe(catchError(() => of([] as CapsDto[])))
      )
    ).subscribe((lists) => {
      const merged = (lists ?? []).flat();
      const uniqueById = new Map<number, CapsDto>();
      merged.forEach((c: any) => {
        if (typeof c?.id === 'number' && !uniqueById.has(c.id)) uniqueById.set(c.id, c);
      });
      this.caps = Array.from(uniqueById.values());

      if (preserveSelection) {
        const current: number[] = this.servicioForm.get('idCaps')?.value ?? [];
        const availableIds = new Set(this.caps.map(c => c.id).filter((id): id is number => typeof id === 'number'));

        // si es edición: también considerar ids iniciales que sean caps (cuando estén disponibles)
        const initialCaps = this.initialEfectorIds.filter(id => availableIds.has(id));

        const next = Array.from(new Set([...current, ...initialCaps]))
          .filter(id => availableIds.has(id));

        this.servicioForm.patchValue({ idCaps: next }, { emitEvent: false });
      }

      // ✅ habilitar/deshabilitar según estado real
      this.updateCapsControlState();
    });
  }

  isModified(): boolean {
    if (!this.data) return this.servicioForm.dirty;

    const v = this.servicioForm.value;
    const currentValue = {
      ...v,
      idMinisterios: [...(v.idMinisterios ?? [])].sort((a: number, b: number) => a - b),
      idHospitales: [...(v.idHospitales ?? [])].sort((a: number, b: number) => a - b),
      hospitalParaCaps: [...(v.hospitalParaCaps ?? [])].sort((a: number, b: number) => a - b),
      idCaps: [...(v.idCaps ?? [])].sort((a: number, b: number) => a - b),
    };

    return JSON.stringify(currentValue) !== JSON.stringify(this.initialData);
  }

  OnDescripcionInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercasedValue = input.value.toUpperCase();
    this.servicioForm.get('descripcion')?.setValue(uppercasedValue);
  }

  saveServicio(): void {
    if (this.servicioForm.valid) {
      const formValue = this.servicioForm.value;

      // ✅ unificar efectores seleccionados (ministerios + hospitales + caps)
      const mergedIds = Array.from(
        new Set<number>([
          ...(formValue.idMinisterios ?? []).map((x: any) => Number(x)),
          ...(formValue.idHospitales ?? []).map((x: any) => Number(x)),
          ...(formValue.idCaps ?? []).map((x: any) => Number(x)),
        ].filter((n) => typeof n === 'number' && !isNaN(n)))
      );

      const servicioDto: ServicioDto = {
        descripcion: formValue.descripcion,
        nivel: Number(formValue.nivel),
        critico: Boolean(formValue.critico),
        activo: true,
        idRegistrosActividades: [],
        idEfectores: mergedIds,
      };

      if (this.data && this.data.id) {
        this.servicioService.update(this.data.id, servicioDto).subscribe(
          result => this.dialogRef.close({ type: 'save', data: result }),
          error => this.dialogRef.close({ type: 'error', data: error })
        );
      } else {
        this.servicioService.save(servicioDto).subscribe(
          result => this.dialogRef.close({ type: 'save', data: result }),
          error => this.dialogRef.close({ type: 'error', data: error })
        );
      }
    }
  }

  cancelar(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close();
  }

  // +++ Helpers
  private cleanSelectAll(values: any[]): number[] {
    return (values ?? [])
      .map((x: any) => Number(x))
      .filter((n: number) => !isNaN(n) && n !== this.selectAllValue);
  }

  private recalcAllSelectedFlags(): void {
    const ministeriosSel = this.cleanSelectAll(this.servicioForm.get('idMinisterios')?.value ?? []);
    const hospitalesSel = this.cleanSelectAll(this.servicioForm.get('idHospitales')?.value ?? []);
    const hospCapsSel = this.cleanSelectAll(this.servicioForm.get('hospitalParaCaps')?.value ?? []);
    const capsSel = this.cleanSelectAll(this.servicioForm.get('idCaps')?.value ?? []);

    const ministeriosAll = this.ministerios.map(m => m.id).filter((id): id is number => typeof id === 'number');
    const hospitalesAll = this.hospitales.map(h => h.id).filter((id): id is number => typeof id === 'number');
    const capsAll = this.caps.map(c => c.id).filter((id): id is number => typeof id === 'number');

    this.allMinisteriosSelected = ministeriosAll.length > 0 && ministeriosSel.length === ministeriosAll.length;
    this.allHospitalesSelected = hospitalesAll.length > 0 && hospitalesSel.length === hospitalesAll.length;
    this.allHospitalParaCapsSelected = hospitalesAll.length > 0 && hospCapsSel.length === hospitalesAll.length;
    this.allCapsSelected = capsAll.length > 0 && capsSel.length === capsAll.length;
  }

  // +++ Ministerios
  onMinisteriosSelectionChange(values: number[]): void {
    const arr = (values ?? []) as any[];
    if (arr.includes(this.selectAllValue)) {
      this.toggleSelectAllMinisterios();
      return;
    }
    const clean = this.cleanSelectAll(arr);
    this.servicioForm.get('idMinisterios')?.setValue(clean, { emitEvent: false });
    this.recalcAllSelectedFlags();
  }

  private toggleSelectAllMinisterios(): void {
    const allIds = this.ministerios.map(m => m.id).filter((id): id is number => typeof id === 'number');
    const next = this.allMinisteriosSelected ? [] : allIds;
    this.servicioForm.get('idMinisterios')?.setValue(next, { emitEvent: false });
    this.recalcAllSelectedFlags();
  }

  // +++ Hospitales
  onHospitalesSelectionChange(values: number[]): void {
    const arr = (values ?? []) as any[];
    if (arr.includes(this.selectAllValue)) {
      this.toggleSelectAllHospitales();
      return;
    }
    const clean = this.cleanSelectAll(arr);
    this.servicioForm.get('idHospitales')?.setValue(clean, { emitEvent: false });
    this.recalcAllSelectedFlags();
  }

  private toggleSelectAllHospitales(): void {
    const allIds = this.hospitales.map(h => h.id).filter((id): id is number => typeof id === 'number');
    const next = this.allHospitalesSelected ? [] : allIds;
    this.servicioForm.get('idHospitales')?.setValue(next, { emitEvent: false });
    this.recalcAllSelectedFlags();
  }

  // +++ Hospital para listar CAPS
  onHospitalParaCapsSelectionChange(values: number[]): void {
    const arr = (values ?? []) as any[];
    if (arr.includes(this.selectAllValue)) {
      this.toggleSelectAllHospitalParaCaps();
      return;
    }
    const clean = this.cleanSelectAll(arr);
    this.servicioForm.get('hospitalParaCaps')?.setValue(clean, { emitEvent: false });
    this.recalcAllSelectedFlags();
    this.onHospitalParaCapsChange(clean);
  }

  private toggleSelectAllHospitalParaCaps(): void {
    const allIds = this.hospitales.map(h => h.id).filter((id): id is number => typeof id === 'number');
    const next = this.allHospitalParaCapsSelected ? [] : allIds;
    this.servicioForm.get('hospitalParaCaps')?.setValue(next, { emitEvent: false });
    this.recalcAllSelectedFlags();
    this.onHospitalParaCapsChange(next);
  }

  // +++ CAPS
  onCapsSelectionChange(values: number[]): void {
    const arr = (values ?? []) as any[];
    if (arr.includes(this.selectAllValue)) {
      this.toggleSelectAllCaps();
      return;
    }
    const clean = this.cleanSelectAll(arr);
    this.servicioForm.get('idCaps')?.setValue(clean, { emitEvent: false });
    this.recalcAllSelectedFlags();
  }

  private toggleSelectAllCaps(): void {
    const allIds = this.caps.map(c => c.id).filter((id): id is number => typeof id === 'number');
    const next = this.allCapsSelected ? [] : allIds;
    this.servicioForm.get('idCaps')?.setValue(next, { emitEvent: false });
    this.recalcAllSelectedFlags();
  }

  // ✅ ya no se necesita para disabled en template (se puede dejar si lo usás para otra cosa)
  get isCapsDisabled(): boolean {
    const selectedHospitales: number[] = this.servicioForm.get('hospitalParaCaps')?.value ?? [];
    return !Array.isArray(selectedHospitales) || selectedHospitales.length === 0 || !this.caps?.length;
  }

  // +++ NUEVO: habilita/deshabilita el control de CAPS desde Reactive Forms
  private updateCapsControlState(): void {
    const selectedHospitales: number[] = this.servicioForm.get('hospitalParaCaps')?.value ?? [];
    const hasHosp = Array.isArray(selectedHospitales) && selectedHospitales.length > 0;
    const hasCaps = Array.isArray(this.caps) && this.caps.length > 0;

    const capsCtrl = this.servicioForm.get('idCaps');
    if (!capsCtrl) return;

    if (hasHosp && hasCaps) {
      capsCtrl.enable({ emitEvent: false });
    } else {
      capsCtrl.disable({ emitEvent: false });
      capsCtrl.setValue([], { emitEvent: false });
      this.allCapsSelected = false;
    }

    this.recalcAllSelectedFlags();
  }
}
