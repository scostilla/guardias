import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FacturaService } from 'src/app/services/factura.service';
import { FacturaDetailDto } from 'src/app/dto/FacturaDetailDto';
import { FacturaEditComponent } from '../factura-edit/factura-edit.component';
import { FacturaDetailComponent } from '../factura-detail/factura-detail.component';

@Component({
  selector: 'app-factura-list-ftermino',
  templateUrl: './factura-list-ftermino.component.html',
  styleUrls: ['./factura-list-ftermino.component.css']
})
export class FacturaListFterminoComponent implements OnInit {

  facturas: FacturaDetailDto[] = [];
  displayedColumns: string[] = ['numeroFactura', 'fechaEmision', 'monto', 'acciones'];
  nombreTitular: string = '';
  apellidoTitular: string = '';

  constructor(
    private facturaService: FacturaService,
    private dialogRef: MatDialogRef<FacturaListFterminoComponent>,
    private dialog: MatDialog,
    private toastr: ToastrService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('🔹 Datos recibidos en el diálogo:', this.data);

    if (this.data.asistencial) {
      this.nombreTitular = this.data.asistencial.nombre || '';
      this.apellidoTitular = this.data.asistencial.apellido || '';
    }

    this.loadFacturas();

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

  onClose(): void {
    this.dialogRef.close();
  }
}
