import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogServiceService } from '../../services/DialogService/dialog-service.service';

@Component({
  selector: 'app-search-professional',
  templateUrl: './search-professional.component.html',
  styleUrls: ['./search-professional.component.css'],
})
export class SearchProfessionalComponent {
  constructor(private dialogRef: MatDialogRef<SearchProfessionalComponent>, private dialogService: DialogServiceService) {}

  ngOnInit() {
    this.dialogService.setDialogRef(this.dialogRef);
  }

  close() {
    this.dialogRef.close();
  }
}
