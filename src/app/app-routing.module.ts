import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { ProfessionalFormEditComponent } from './components/professional-form-edit/professional-form-edit.component';
import { ProfessionalDhComponent } from './components/professional-dh/professional-dh.component';
import { ProfessionalDhHistComponent } from './components/professional-dh-hist/professional-dh-hist.component';
import { ProfessionalDhJunioComponent } from './components/professional-dh-junio/professional-dh-junio.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { NovedadesFormComponent } from './components/novedades-form/novedades-form.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { DistHorariaGuardiaComponent } from './components/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaConsComponent } from './components/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from './components/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaOtrasComponent } from './components/dist-horaria-otras/dist-horaria-otras.component';
import { GuardiasViewComponent } from './components/guardias-view/guardias-view.component';
import { GuardiasViewPComponent } from './components/guardias-view-p/guardias-view-p.component';
import { GuardiaActivaComponent } from './components/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardia-pasiva/guardia-pasiva.component';
import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';
import { DdjjExtraComponent } from './components/ddjj-extra/ddjj-extra.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { DdjjExtraTotComponent } from './components/ddjj-extra-tot/ddjj-extra-tot.component';
import { DdjjExtraTotRecComponent } from './components/ddjj-extra-tot-rec/ddjj-extra-tot-rec.component';
import { DdjjExtraTotApComponent } from './components/ddjj-extra-tot-ap/ddjj-extra-tot-ap.component';
import { DdjjContrafacturaTotComponent } from './components/ddjj-contrafactura-tot/ddjj-contrafactura-tot.component';
import { DdjjContrafacturaTotApComponent } from './components/ddjj-contrafactura-tot-ap/ddjj-contrafactura-tot-ap.component';
import { DdjjContrafacturaTotRecComponent } from './components/ddjj-contrafactura-tot-rec/ddjj-contrafactura-tot-rec.component';
import { DdjjCargoyagrupTotComponent } from './components/ddjj-cargoyagrup-tot/ddjj-cargoyagrup-tot.component';
import { DdjjCargoyagrupTotalApComponent } from './components/ddjj-cargoyagrup-total-ap/ddjj-cargoyagrup-total-ap.component';
import { DdjjCargoyagrupTotalRecComponent } from './components/ddjj-cargoyagrup-total-rec/ddjj-cargoyagrup-total-rec.component';
import { DdjjTentativoComponent } from './components/ddjj-tentativo/ddjj-tentativo.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { CronogramaComponent } from './components/cronograma/cronograma.component';
import { CronogramaDefComponent } from './components/cronograma-def/cronograma-def.component';
import { CronogramaDefMaternoComponent } from './components/cronograma-def-materno/cronograma-def-materno.component';
import { CronogramaDefSroqueComponent } from './components/cronograma-def-sroque/cronograma-def-sroque.component';
import { CronogramaRegComponent } from './components/cronograma-reg/cronograma-reg.component';
import { CronogramaPComponent } from './components/cronograma-p/cronograma-p.component';
import { CronogramaPDefComponent } from './components/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPDefTotComponent } from './components/cronograma-p-def-tot/cronograma-p-def-tot.component';
import { CronogramaFormAgregarComponent } from './components/cronograma-form-agregar/cronograma-form-agregar.component';
import { CronogramaPHosComponent } from './components/cronograma-p-hos/cronograma-p-hos.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { HistorialComponent } from './components/historial/historial.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';
import { PopupDdjjCfComponent } from './components/popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupDdjjCfEditComponent } from './components/popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'professional-form', component: ProfessionalFormComponent },
  { path: 'professional-form-edit', component: ProfessionalFormEditComponent },
  { path: 'daily-schedule', component: DailyScheduleComponent},
  {path:"home-page", component:HomePageComponent},
  {path:"registro-diario",component: RegistroDiarioComponent},
  {path:"registro-actividades",component: RegistroActividadesComponent},
  { path: 'professional-list', component: ProfessionalListComponent},
  { path: 'professinal-news', component: ProfessionalNewsComponent},
  { path: 'schedule-distribution', component: ScheduleDistributionComponent},
  {path: 'novedades-form', component: NovedadesFormComponent},
  {path:'dist-horaria', component:DistHorariaComponent},
  {path:'dist-horaria-guardias', component:DistHorariaGuardiaComponent},
  {path:'dist-horaria-cons', component:DistHorariaConsComponent},
  {path:'dist-horaria-giras', component:DistHorariaGirasComponent},
  {path:'dist-horaria-otras', component:DistHorariaOtrasComponent},
  {path:'guardias-view', component: GuardiasViewComponent},
  {path:'guardias-view-p', component: GuardiasViewPComponent},
  {path:'guardia-activa',component:GuardiaActivaComponent},
  {path:'guardia-pasiva', component:GuardiaPasivaComponent},
  {path: 'professional-detail/:id', component: ProfessionalDetailComponent },
  {path: 'professional-dh/:id', component: ProfessionalDhComponent },
  {path: 'professional-dh-hist/:id', component: ProfessionalDhHistComponent },
  {path: 'professional-dh-junio/:id', component: ProfessionalDhJunioComponent },
  {path:'ddjj-extra',component:DdjjExtraComponent},
  {path:'ddjj-contrafactura',component:DdjjContrafacturaComponent},
  {path:'ddjj-cargoyagrup',component:DdjjCargoyagrupComponent},
  {path:'ddjj-extra-tot',component:DdjjExtraTotComponent},
  {path:'ddjj-extra-tot-rec',component:DdjjExtraTotRecComponent},
  {path:'ddjj-extra-tot-ap',component:DdjjExtraTotApComponent},
  {path:'ddjj-contrafactura-tot',component:DdjjContrafacturaTotComponent},
  {path:'ddjj-contrafactura-tot-ap',component:DdjjContrafacturaTotApComponent},
  {path:'ddjj-contrafactura-tot-rec',component:DdjjContrafacturaTotRecComponent},
  {path:'ddjj-cargoyagrup-tot',component:DdjjCargoyagrupTotComponent},
  {path:'ddjj-cargoyagrup-total-ap',component:DdjjCargoyagrupTotalApComponent},
  {path:'ddjj-cargoyagrup-total-rec',component:DdjjCargoyagrupTotalRecComponent},
  {path:'ddjj-tentativo',component:DdjjTentativoComponent},
 /*  {path:'api', component:ApiComponent} */
 {path:'MonthTableComponent',component:MonthTableComponent},
 {path: 'cronograma', component:CronogramaComponent},
 {path: 'cronograma-def', component:CronogramaDefComponent},
 {path: 'cronograma-def-materno', component:CronogramaDefMaternoComponent},
 {path: 'cronograma-def-sroque', component:CronogramaDefSroqueComponent},
 {path: 'cronograma-reg', component:CronogramaRegComponent},
 {path: 'cronograma-p', component:CronogramaPComponent},
 {path: 'cronograma-p-def', component:CronogramaPDefComponent},
 {path: 'cronograma-p-def-tot', component:CronogramaPDefTotComponent},
 {path: 'cronograma-p-hos', component:CronogramaPHosComponent},
 {path: 'cronograma-form-agregar', component:CronogramaFormAgregarComponent},
 {path: 'popup-calendario', component:PopupCalendarioComponent},
 {path: 'digesto', component:DigestoComponent},
 {path: 'novedades', component:NovedadesComponent}, 
 {path: 'historial', component:HistorialComponent},
 {path: 'disponibilidad', component:DisponibilidadComponent},
 {path: 'popup-calendario-disp', component:PopupCalendarioDispComponent},
 {path: 'popup-novedad-agregar', component:PopupNovedadAgregarComponent},
 {path: 'popup-ddjj-cf', component:PopupDdjjCfComponent},
 {path: 'popup-ddjj-cf-edit', component:PopupDdjjCfEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
