import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfsessionalFormComponent } from './components/profsessional-form/profsessional-form.component';
import { PopupComponent } from './components/popup/popup.component';
import { LeftNavbarComponent  } from './components/left-navbar/left-navbar.component';
import { RightNavbarComponent } from './components/right-navbar/right-navbar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { SearchProfessionalComponent } from './components/search-professional/search-professional.component';
import { ProfessionalTableComponent } from './components/professional-table/professional-table.component';
import { ProfessionalDataServiceService } from './services/professional-data-service.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfsessionalFormComponent,
    PopupComponent,
    LeftNavbarComponent,
    RightNavbarComponent,
    CalendarComponent,
    TimePickerComponent,
    SearchProfessionalComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ProfessionalTableComponent,
    NgxMatTimepickerModule,
    HttpClientModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    ProfessionalDataServiceService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
