import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValorGuardiasCargoService } from 'src/app/services/valorGuardiasCargo.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';

@Component({
  selector: 'app-valores-guardias-create',
  templateUrl: './valores-guardias-create.component.html',
  styleUrls: ['./valores-guardias-create.component.css']
})
export class ValoresGuardiasCreateComponent implements OnInit {

  form!: FormGroup;
  hospitales: Hospital[] = [];
  minDate!: Date;

  readonly decimal6_2 = Validators.pattern(/^\d{6}\.\d{2}$/);

  readonly labelsCampos: Record<string, string> = {
    decreto1178Lav: 'Decreto 1178 LAV',
    decreto1178Sdf: 'Decreto 1178 SDF',
    decreto1657Lav: 'Decreto 1657 LAV',
    decreto1657Sdf: 'Decreto 1657 SDF',
    resolucion2575Lav: 'Resolución 2575 LAV',
    resolucion2575Sdf: 'Resolución 2575 SDF',
    bono1580Lav: 'Bono Decreto 1580 LAV',
    bono1580Sdf: 'Bono Decreto 1580 SDF',
  };

  readonly conceptosConfig: Record<string, string[]> = {
    DECRETO_1178: ['decreto1178Lav', 'decreto1178Sdf'],
    DECRETO_1657: ['decreto1657Lav', 'decreto1657Sdf'],
    RESOLUCION_2575: ['resolucion2575Lav', 'resolucion2575Sdf'],
    BONO_1580: ['bono1580Lav', 'bono1580Sdf'],
  };

  constructor(
    private fb: FormBuilder,
    private valorGuardiasCargoService: ValorGuardiasCargoService,
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<ValoresGuardiasCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      nivelComplejidad: number;
      idsHospitales: number[];
      titulo: string;
      conceptos: string[];
    }
  ) {
    const hoy = new Date();
    this.minDate = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

    this.form = this.fb.group({
      tipoGuardia: ['', Validators.required],
      fechaInicio: [null, Validators.required],

      decreto1178Lav: [0],
      decreto1178Sdf: [0],
      decreto1657Lav: [0],
      decreto1657Sdf: [0],
      resolucion2575Lav: [0],
      resolucion2575Sdf: [0],
      bono1580Lav: [0],
      bono1580Sdf: [0],
    });
  }

  ngOnInit(): void {
    this.listHospitales();

    this.form.get('tipoGuardia')?.valueChanges.subscribe(() => {
      this.actualizarValidaciones();
    });
  }

  listHospitales(): void {
    this.hospitalService.list().subscribe({
      next: data => this.hospitales = data,
      error: err => console.error(err)
    });
  }

  /* ========= CAMPOS VISIBLES SEGÚN BOTONES ========= */

  esPasiva(): boolean {
    return this.form?.get('tipoGuardia')?.value === 'PASIVA';
  }

  getCamposVisibles(): string[] {
    const tipo = this.form?.get('tipoGuardia')?.value;

    if (!tipo || tipo === 'PASIVA') {
      return [];
    }

    return this.data.conceptos.flatMap(concepto => {
      if (tipo === 'CARGO' && concepto === 'RESOLUCION_2575') return [];
      if (tipo === 'EXTRA' && concepto.startsWith('DECRETO')) return [];
      return this.conceptosConfig[concepto];
    });
  }

  actualizarValidaciones(): void {
    Object.keys(this.form.controls).forEach(campo => {
      this.form.get(campo)?.clearValidators();
    });

    this.form.get('tipoGuardia')?.setValidators(Validators.required);
    this.form.get('fechaInicio')?.setValidators(Validators.required);

    this.getCamposVisibles().forEach(campo => {
      this.form!.get(campo)?.setValidators([
        Validators.required,
        Validators.max(999999.99),
        Validators.min(0)
      ]);
    });

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  /* ========= INPUT TIPO BANCO ========= */

  onMontoInput(event: Event, campo: string): void {
    const input = event.target as HTMLInputElement;

    // Solo dígitos
    let raw = input.value.replace(/\D/g, '');

    // límite: 8 dígitos (6 enteros + 2 decimales)
    if (raw.length > 8) {
      raw = raw.slice(0, 8);
    }

    if (!raw) {
      this.form.patchValue({ [campo]: 0 }, { emitEvent: false });
      input.value = '0,00';
      return;
    }

    // mover decimales
    const value = Number(raw) / 100;

    // guardamos number
    this.form.patchValue({ [campo]: value }, { emitEvent: false });

    // mostrar formato AR
    input.value = value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

/* ========= SAVE SIMPLE ========= */

  saveValorManual(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const nuevoValor: any = {
      tipoGuardia: v.tipoGuardia,
      nivelComplejidad: this.data.nivelComplejidad,
      fechaInicio: v.fechaInicio,
      idsHospitales: this.data.idsHospitales
    };

    // solo guarda los campos visibles (según botón + tipo guardia)
    this.getCamposVisibles().forEach(campo => {
      nuevoValor[campo] = v[campo]; // ya es number
    });

    this.valorGuardiasCargoService
      .cargarValoresManual([nuevoValor])
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: err => console.error('Error al guardar', err)
      });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
