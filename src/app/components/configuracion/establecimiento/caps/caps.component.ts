import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Caps } from 'src/app/models/Caps';
import { CapsService } from 'src/app/services/caps.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CapsDetailComponent } from '../caps-detail/caps-detail.component';
import { CapsEditComponent } from '../caps-edit/caps-edit.component';




@Component({
  selector: 'app-caps',
  templateUrl: './caps.component.html',
  styleUrls: ['./caps.component.css']
})

export class CapsComponent {



}
