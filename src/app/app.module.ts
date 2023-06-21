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
import { LeftNavbarComponent } from './components/left-navbar/left-navbar.component';
import { RightNavbarComponent } from './components/right-navbar/right-navbar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { SearchProfessionalComponent } from './components/search-professional/search-professional.component';
import { ProfessionalTableComponent } from './components/professional-table/professional-table.component';
import { ProfessionalDataServiceService } from './services/professionalDataService/professional-data-service.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ProfessionalAbmComponent } from './components/professional-abm/professional-abm.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfessionalFormComponent,
    PopupComponent,
    LeftNavbarComponent,
    RightNavbarComponent,
    CalendarComponent,
    TimePickerComponent,
    SearchProfessionalComponent,
    HomePageComponent,
    DailyScheduleComponent,
    ScheduleCardComponent,
    ScheduleDistributionComponent,
    ProfessionalNewsComponent,
    ProfessionalAbmComponent,
    ProfessionalListComponent,
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
    ProfessionalDataServiceService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
