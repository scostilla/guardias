import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistencialListForRmensualDto } from 'src/app/dto/guardias/AsistencialListForRmensualDto';

@Component({
  selector: 'app-rmensual-extra-detail',
  templateUrl: './rmensual-extra-detail.component.html',
  styleUrls: ['./rmensual-extra-detail.component.css']
})
export class RmensualExtraDetailComponent implements OnInit {
  asistencial!: AsistencialListForRmensualDto;

  constructor(
    public dialogRef: MatDialogRef<RmensualExtraDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asistencial = data.asistencial;
  }

  ngOnInit(): void {
  }

  formatCuil(cuil: string): string {
    if (!cuil) return '';
    // Asegurarse de que sea solo números
    const clean = cuil.replace(/\D/g, '');
    if (clean.length !== 11) return cuil; // formato incorrecto, devolver tal cual
    return `${clean.substring(0, 2)}-${clean.substring(2, 10)}-${clean.substring(10)}`;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
