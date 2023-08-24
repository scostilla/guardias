import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { NovedadesFormComponent } from './components/novedades-form/novedades-form.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { GuardiasViewComponent } from './components/guardias-view/guardias-view.component';
import { GuardiasViewPComponent } from './components/guardias-view-p/guardias-view-p.component';
import { GuardiaActivaComponent } from './components/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardia-pasiva/guardia-pasiva.component';
import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';
import { DdjjExtraComponent } from './components/ddjj-extra/ddjj-extra.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { CronogramaComponent } from './components/cronograma/cronograma.component';
import { CronogramaDefComponent } from './components/cronograma-def/cronograma-def.component';
import { CronogramaRegComponent } from './components/cronograma-reg/cronograma-reg.component';
import { CronogramaPComponent } from './components/cronograma-p/cronograma-p.component';
import { CronogramaPDefComponent } from './components/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPHosComponent } from './components/cronograma-p-hos/cronograma-p-hos.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { HistorialComponent } from './components/historial/historial.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'professional-form', component: ProfessionalFormComponent },
  { path: 'daily-schedule', component: DailyScheduleComponent},
  {path:"home-page", component:HomePageComponent},
  {path:"registro-diario",component: RegistroDiarioComponent},
  {path:"registro-actividades",component: RegistroActividadesComponent},
  { path: 'professional-list', component: ProfessionalListComponent},
  { path: 'professinal-news', component: ProfessionalNewsComponent},
  { path: 'schedule-distribution', component: ScheduleDistributionComponent},
  {path: 'novedades-form', component: NovedadesFormComponent},
  {path:'dist-horaria', component:DistHorariaComponent},
  {path:'guardias-view', component: GuardiasViewComponent},
  {path:'guardias-view-p', component: GuardiasViewPComponent},
  {path:'guardia-activa',component:GuardiaActivaComponent},
  {path:'guardia-pasiva', component:GuardiaPasivaComponent},
  { path: 'professional-detail/:id', component: ProfessionalDetailComponent },
  {path:'ddjj-extra',component:DdjjExtraComponent},
  {path:'ddjj-contrafactura',component:DdjjContrafacturaComponent},
  {path:'ddjj-cargoyagrup',component:DdjjCargoyagrupComponent},
 /*  {path:'api', component:ApiComponent} */
 {path:'MonthTableComponent',component:MonthTableComponent},
 {path: 'cronograma', component:CronogramaComponent},
 {path: 'cronograma-def', component:CronogramaDefComponent},
 {path: 'cronograma-reg', component:CronogramaRegComponent},
 {path: 'cronograma-p', component:CronogramaPComponent},
 {path: 'cronograma-p-def', component:CronogramaPDefComponent},
 {path: 'cronograma-p-hos', component:CronogramaPHosComponent},
 {path: 'popup-calendario', component:PopupCalendarioComponent},
 {path: 'digesto', component:DigestoComponent},
 {path: 'novedades', component:NovedadesComponent}, 
 {path: 'historial', component:HistorialComponent},
 {path: 'disponibilidad', component:DisponibilidadComponent},
 {path: 'popup-calendario-disp', component:PopupCalendarioDispComponent},
 {path: 'popup-novedad-agregar', component:PopupNovedadAgregarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
