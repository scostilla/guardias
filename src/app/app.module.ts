import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';

//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { PopupComponent } from './components/popup/popup.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { SearchProfessionalComponent } from './components/search-professional/search-professional.component';
import { ProfessionalTableComponent } from './components/professional-table/professional-table.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ProfessionalAbmComponent } from './components/professional-abm/professional-abm.component';
import { ProfessionalDataServiceService } from './services/ProfessionalDataService/professional-data-service.service';
import { NovedadesFormComponent } from './components/novedades-form/novedades-form.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { GuardiasViewComponent } from './components/guardias-view/guardias-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfessionalFormComponent,
    PopupComponent,
    CalendarComponent,
    TimePickerComponent,
    SearchProfessionalComponent,
    HomePageComponent,
    DailyScheduleComponent,
    ScheduleCardComponent,
    RegistroDiarioComponent,
    LoginComponent,
    RegistroDiarioComponent,
    RegistroActividadesComponent,
    ScheduleDistributionComponent,
    ProfessionalNewsComponent,
    ProfessionalAbmComponent,
    ProfessionalListComponent,
    NovedadesFormComponent,
    DistHorariaComponent,
    ConfirmDialogComponent,
    GuardiasViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ProfessionalTableComponent,
    NgxMatTimepickerModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
  ],
  providers: [
    ProfessionalDataServiceService
    /*ProfessionalDataServiceService,*/
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
