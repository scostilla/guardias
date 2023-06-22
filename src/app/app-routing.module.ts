import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'professional-form', component: ProfessionalFormComponent },
  { path: 'daily-schedule', component: DailyScheduleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
