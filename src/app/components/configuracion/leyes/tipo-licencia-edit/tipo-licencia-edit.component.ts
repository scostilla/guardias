import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoLicenciaDto } from 'src/app/dto/Configuracion/TipoLicenciaDto';
import { TipoLey } from 'src/app/models/Configuracion/TipoLey';
import { TipoLicencia } from 'src/app/models/Configuracion/TipoLicencia';
import { TipoLeyService } from 'src/app/services/Configuracion/tipoLey.service';
import { TipoLicenciaService } from 'src/app/services/Configuracion/tipoLicencia.service';

@Component({
    selector: 'app-tipo-licencia-edit',
    templateUrl: './tipo-licencia-edit.component.html',
    styleUrls: ['./tipo-licencia-edit.component.css']
})
export class TipoLicenciaEditComponent implements OnInit {
    tipoLicenciaForm: FormGroup;
    initialData: any;
    tipoLeyes: TipoLey[] = [];

    constructor(
        private fb : FormBuilder,
        public dialogRef: MatDialogRef<TipoLicenciaEditComponent>,
        private tipoLicenciaService: TipoLicenciaService,
        private tipoLeyService: TipoLeyService,

        @Inject(MAT_DIALOG_DATA) public data: TipoLicencia
    ){
        this.tipoLicenciaForm = this.fb.group({
            id: [this.data ? this.data.id : null],
            nombre: ['', Validators.required, ],
            tipoLey: ['', Validators.required],
            
        });

        this.listTipoLey();

        if(data){
            this.tipoLicenciaForm.patchValue(data);
        }
    }

    

    ngOnInit(): void {
        this.initialData = this.tipoLicenciaForm.value; 
    }

    isModified(): boolean {
        return JSON.stringify(this.initialData) !== JSON.stringify(this.tipoLicenciaForm.value);
    }

    listTipoLey(): void {
        this.tipoLeyService.list().subscribe(data => {
            console.log('Lista de Tipo Ley:', data);
            this.tipoLeyes = data;
        }, error => {
            console.log(error);
        });
    }
    saveTipoLicencia(): void {
        if (this.tipoLicenciaForm.valid) {
            const formValue = this.tipoLicenciaForm.value;

            const tipoLicenciaDto = new TipoLicenciaDto(
           
                formValue.nombre,
                formValue.tipoLey.id ,
                formValue.activo
            );
    
            console.log('tipoLicenciaDto:', tipoLicenciaDto);
    if (this.data && this.data.id) {
        this.tipoLicenciaService.update(this.data.id, tipoLicenciaDto).subscribe(
            result => {
            this.dialogRef.close({ type: 'save', data: result });
        }, 
        error => {
            this.dialogRef.close({ type: 'error', data: error });
        });
    }else {
        this.tipoLicenciaService.save(tipoLicenciaDto).subscribe(
            result => {
                this.dialogRef.close({ type: 'save', data: result });
            },
            error => {
                this.dialogRef.close({ type: 'error', data: error });
            }
        );
    }
}
}

    ngOnDestroy(): void {
        
    }
compareTipoLey(p1: TipoLey, p2: TipoLey): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
   
}
cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
}

}