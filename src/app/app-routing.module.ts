import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'professional-form', component: ProfessionalFormComponent },
  { path: 'daily-schedule', component: DailyScheduleComponent},
  {path:"home", component: HomeComponent},
  {path:"login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
