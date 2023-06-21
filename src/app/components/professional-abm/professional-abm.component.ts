import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-professional-abm',
  templateUrl: './professional-abm.component.html',
  styleUrls: ['./professional-abm.component.css']
})
export class ProfessionalAbmComponent {
  selected = 'Medico';
  constructor(
    public dialogRef:MatDialogRef<ProfessionalAbmComponent>
  ){}

  ngOninit():void{}

  cancel(){
    this.dialogRef.close();
  }

}
