import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FacturaService } from 'src/app/services/factura.service';
import { FacturaDetailDto } from 'src/app/dto/FacturaDetailDto';
import { FacturaEditComponent } from '../factura-edit/factura-edit.component';
import { FacturaDetailComponent } from '../factura-detail/factura-detail.component';
import { DdjjService } from 'src/app/services/ddjj.service';

@Component({
  selector: 'app-factura-list',
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.css']
})
export class FacturaListComponent implements OnInit {

  facturas: FacturaDetailDto[] = [];
  displayedColumns: string[] = ['numeroFactura', 'fechaEmision', 'monto', 'acciones'];
  nombreTitular: string = '';
  apellidoTitular: string = '';
  ddjjYaExiste: boolean | null = null;

  constructor(
    private facturaService: FacturaService,
    private dialogRef: MatDialogRef<FacturaListComponent>,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private ddjjService: DdjjService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('🔹 Datos recibidos en el diálogo:', this.data);

    if (this.data.asistencial) {
      this.nombreTitular = this.data.asistencial.nombre || '';
      this.apellidoTitular = this.data.asistencial.apellido || '';
    }

    this.loadFacturas();
    this.verificarExistenciaDdjj(); 

    this.facturaService.refresh$.subscribe(() => {
      this.loadFacturas();
    });
  }

  private loadFacturas(): void {
    this.facturaService.getByFiltros(
      this.data.asistencial.id,
      this.data.idEfector,
      this.data.anio,
      this.data.mes,
      this.data.quincena
    ).subscribe({
      next: (res) => {
        this.facturas = res;
        console.log('💰 Facturas obtenidas:', this.facturas);
      },
      error: (err) => console.error('Error al obtener facturas', err)
    });
  }
  
  openDetail(factura: FacturaDetailDto) {
    this.facturaService.detail(factura.id!).subscribe({
      next: (detalle) => {
        this.dialog.open(FacturaDetailComponent, {
          width: '600px',
          data: detalle
        });
      },
      error: (err) => console.error('Error al obtener detalle', err)
    });
  }

  openEdit(factura: FacturaDetailDto) {
    this.facturaService.detail(factura.id!).subscribe({
      next: (detalle) => {
        const dialogRefEdit = this.dialog.open(FacturaEditComponent, {
          width: '600px',
          data: detalle
        });

        dialogRefEdit.afterClosed().subscribe(updated => {
          if (updated) {
          }
        });
      },
      error: (err) => console.error('Error al cargar factura para edición', err)
    });
  }

  openDelete(factura: FacturaDetailDto) {
    if (confirm(`¿Seguro que desea eliminar la factura de ${factura.nombreTitular} ${factura.apellidoTitular}?`)) {
      this.facturaService.logicDelete(factura.id!).subscribe({
        next: () => {
          this.facturas = this.facturas.filter(f => f.id !== factura.id);
        },
        error: (err) => console.error('Error al eliminar factura', err)
      });
    }
  }

  convertirMesANombre(numeroMes: number): string {
    const meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[numeroMes];
  }

  verificarExistenciaDdjj(): void {
    const nombreMes = this.data.mes;
    const anio = this.data.anio;
    const efectorId = this.data.idEfector;
    const quincena = this.data.quincena;

    if (!efectorId) {
      console.error('El ID del efector no puede ser null');
      return;
    }

    this.ddjjService.existsDdjjCf(anio, nombreMes, efectorId, quincena).subscribe({
      next: (existe: boolean) => {
        this.ddjjYaExiste = existe;

        if (existe) {
          console.log('Ya existe una DDJJ para estos filtros.');
        } else {
          console.log('No existe DDJJ previa, se puede eliminar facturas.');
        }
      },
      error: (err) => {
        console.error('Error verificando existencia de DDJJ:', err);
        this.ddjjYaExiste = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
