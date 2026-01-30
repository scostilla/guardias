//COMPONENTES SISTEMA GUARDIAS

//Autenticacion
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ProfessionalAuthGuard } from 'src/app/guards/professional-auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

//Principales
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { HomeAutoridadComponent } from './components/home-autoridad/home-autoridad.component';
import { HomeHospitalComponent } from './components/home-hospital/home-hospital.component';
import { EfectorSelectorComponent } from './components/home-page/efector-selector/efector-selector.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeProfesionalComponent } from './components/home-profesional/home-profesional.component';
import { HomeProfesionalPublicComponent } from './components/home-profesional-public/home-profesional-public.component';
import { GuardiasPendientesProfesionalesComponent } from './components/home-profesional-public/guardias-pendientes-profesionales/guardias-pendientes-profesionales.component';
import { LoginComponent } from './components/login/login.component';
import { ReportesComponent } from './components/reportes/reportes.component';

//Configuraciones: Generales
import { ValoresBonoUtiCreateComponent } from './components/configuracion/info/valores-bono-uti-create/valores-bono-uti-create.component';
import { ValoresGuardiasCreateComponent } from './components/configuracion/info/valores-guardias-create/valores-guardias-create.component';
import { ValoresGuardiasComponent } from './components/configuracion/info/valores-guardias/valores-guardias.component';
import { SoporteFormComponent } from './components/configuracion/soporte-form/soporte-form.component';


//Configuraciones: Territorio
import { DepartamentoDetailComponent } from './components/configuracion/territorio/departamento-detail/departamento-detail.component';
import { DepartamentoEditComponent } from './components/configuracion/territorio/departamento-edit/departamento-edit.component';
import { DepartamentoComponent } from './components/configuracion/territorio/departamento/departamento.component';
import { LocalidadDetailComponent } from './components/configuracion/territorio/localidad-detail/localidad-detail.component';
import { LocalidadEditComponent } from './components/configuracion/territorio/localidad-edit/localidad-edit.component';
import { LocalidadComponent } from './components/configuracion/territorio/localidad/localidad.component';
import { PaisDetailComponent } from './components/configuracion/territorio/pais-detail/pais-detail.component';
import { PaisEditComponent } from './components/configuracion/territorio/pais-edit/pais-edit.component';
import { PaisComponent } from './components/configuracion/territorio/pais/pais.component';
import { ProvinciaDetailComponent } from './components/configuracion/territorio/provincia-detail/provincia-detail.component';
import { ProvinciaEditComponent } from './components/configuracion/territorio/provincia-edit/provincia-edit.component';
import { ProvinciaComponent } from './components/configuracion/territorio/provincia/provincia.component';

//Configuraciones: Establecimientos
import { CapsDetailComponent } from './components/configuracion/establecimiento/caps-detail/caps-detail.component';
import { CapsEditComponent } from './components/configuracion/establecimiento/caps-edit/caps-edit.component';
import { CapsComponent } from './components/configuracion/establecimiento/caps/caps.component';
import { HospitalDetailComponent } from './components/configuracion/establecimiento/hospital-detail/hospital-detail.component';
import { HospitalEditComponent } from './components/configuracion/establecimiento/hospital-edit/hospital-edit.component';
import { HospitalComponent } from './components/configuracion/establecimiento/hospital/hospital.component';
import { MinisterioDetailComponent } from './components/configuracion/establecimiento/ministerio-detail/ministerio-detail.component';
import { MinisterioEditComponent } from './components/configuracion/establecimiento/ministerio-edit/ministerio-edit.component';
import { MinisterioComponent } from './components/configuracion/establecimiento/ministerio/ministerio.component';
import { PermisosEfectoresComponent } from './components/configuracion/establecimiento/permisos-efectores/permisos-efectores.component';
import { RegionDetailComponent } from './components/configuracion/establecimiento/region-detail//region-detail.component';
import { RegionEditComponent } from './components/configuracion/establecimiento/region-edit/region-edit.component';
import { RegionComponent } from './components/configuracion/establecimiento/region/region.component';


//Configuraciones: Profesionales
import { EspecialidadDetailComponent } from './components/configuracion/profesionales/especialidad-detail/especialidad-detail.component';
import { EspecialidadEditComponent } from './components/configuracion/profesionales/especialidad-edit/especialidad-edit.component';
import { EspecialidadComponent } from './components/configuracion/profesionales/especialidad/especialidad.component';
import { ProfesionDetailComponent } from './components/configuracion/profesionales/profesion-detail/profesion-detail.component';
import { ProfesionEditComponent } from './components/configuracion/profesionales/profesion-edit/profesion-edit.component';
import { ProfesionComponent } from './components/configuracion/profesionales/profesion/profesion.component';

//Configuraciones: Personas
import { PersonDetailComponent } from './components/configuracion/usuarios/person-detail/person-detail.component';
import { PersonEditComponent } from './components/configuracion/usuarios/person-edit/person-edit.component';
import { PersonComponent } from './components/configuracion/usuarios/person/person.component';
import { RevistaComponent } from './components/configuracion/usuarios/revista/revista.component';
import { UsuarioDetailComponent } from './components/configuracion/usuarios/usuario-detail/usuario-detail.component';
import { UsuarioEditComponent } from './components/configuracion/usuarios/usuario-edit/usuario-edit.component';
import { UsuarioComponent } from './components/configuracion/usuarios/usuario/usuario.component';


//Configuraciones: Leyes y novedades
import { ArticuloDetailComponent } from './components/configuracion/leyes/articulo-detail/articulo-detail.component';
import { ArticuloEditComponent } from './components/configuracion/leyes/articulo-edit/articulo-edit.component';
import { ArticuloComponent } from './components/configuracion/leyes/articulo/articulo.component';
import { IncisoDetailComponent } from './components/configuracion/leyes/inciso-detail/inciso-detail.component';
import { IncisoEditComponent } from './components/configuracion/leyes/inciso-edit/inciso-edit.component';
import { IncisoComponent } from './components/configuracion/leyes/inciso/inciso.component';
import { TipoLeyEditComponent } from './components/configuracion/leyes/tipo-ley-edit/tipo-ley-edit.component';
import { TipoLeyComponent } from './components/configuracion/leyes/tipo-ley/tipo-ley.component';
import { TipoLicenciaDetailComponent } from './components/configuracion/leyes/tipo-licencia-detail/tipo-licencia-detail.component';
import { TipoLicenciaEditComponent } from './components/configuracion/leyes/tipo-licencia-edit/tipo-licencia-edit.component';
import { TipoLicenciaComponent } from './components/configuracion/leyes/tipo-licencia/tipo-licencia.component';



//Configuraciones: Calendario
import { FeriadoDetailComponent } from './components/configuracion/calendario/feriado-detail/feriado-detail.component';
import { FeriadoEditComponent } from './components/configuracion/calendario/feriado-edit/feriado-edit.component';
import { FeriadoComponent } from './components/configuracion/calendario/feriado/feriado.component';


//Notificaciones
import { NotificacionDetailComponent } from './components/notificacion/notificacion-detail/notificacion-detail.component';
import { NotificacionEditComponent } from './components/notificacion/notificacion-edit/notificacion-edit.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';


//Sección: Actividades
import { RegistroActividadesEgresoProfesionalComponent } from './components/actividades/registro-actividades-egreso-profesional/registro-actividades-egreso-profesional.component';
import { RegistroActividadesEgresoComponent } from './components/actividades/registro-actividades-egreso/registro-actividades-egreso.component';
import { RegistroActividadesIngresoProfesionalComponent } from './components/actividades/registro-actividades-ingreso-profesional/registro-actividades-ingreso-profesional.component';
import { RegistroActividadesIngresoComponent } from './components/actividades/registro-actividades-ingreso/registro-actividades-ingreso.component';
import { RegistroActividadesProfesionalesComponent } from './components/actividades/registro-actividades-profesionales/registro-actividades-profesionales.component';
import { RegistroActividadesProfesionalesPublicComponent } from './components/actividades/registro-actividades-profesionales-public/registro-actividades-profesionales-public.component';
import { RegistroActividadesComponent } from './components/actividades/registro-actividades/registro-actividades.component';
import { RegistroDiarioComponent } from './components/actividades/registro-diario/registro-diario.component';


//Sección: Personal
import { AsistProfesionalComponent } from './components/personal/asist-profesional/asist-profesional.component';
import { PersonalAutoridadListComponent } from './components/personal/personal-autoridad-list/personal-autoridad-list.component';
import { PersonalAutoridadComponent } from './components/personal/personal-autoridad/personal-autoridad.component';
import { PersonalExternoComponent } from './components/personal/personal-externo/personal-externo.component';
import { PersonalLegajoNoAsistencialComponent } from './components/personal/personal-legajo-no-asistencial/personal-legajo-no-asistencial.component';
import { PersonalLegajoSelectComponent } from './components/personal/personal-legajo-select/personal-legajo-select.component';
import { PersonalLegajoComponent } from './components/personal/personal-legajo/personal-legajo.component';
import { PersonalNoAsistencialComponent } from './components/personal/personal-no-asistencial/personal-no-asistencial.component';
import { PersonalSinLegajoComponent } from './components/personal/personal-sin-legajo/personal-sin-legajo.component';
import { PersonalComponent } from './components/personal/personal/personal.component';

import { AsistencialCreateComponent } from './components/personal/personal-contenido/asistencial-create/asistencial-create.component';
import { AsistencialDetailComponent } from './components/personal/personal-contenido/asistencial-detail/asistencial-detail.component';
import { AsistencialEditComponent } from './components/personal/personal-contenido/asistencial-edit/asistencial-edit.component';
import { AsistencialSelectorAllComponent } from './components/personal/personal-contenido/asistencial-selector/asistencial-selector-all/asistencial-selector-all.component';
import { AsistencialSelectorComponent } from './components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { AsistencialComponent } from './components/personal/personal-contenido/asistencial/asistencial.component';
import { AutoridadListComponent } from './components/personal/personal-contenido/autoridad-list/autoridad-list.component';
import { CargoDetailComponent } from './components/personal/personal-contenido/cargo-detail/cargo-detail.component';
import { CargoEditComponent } from './components/personal/personal-contenido/cargo-edit/cargo-edit.component';
import { CargoComponent } from './components/personal/personal-contenido/cargo/cargo.component';
import { ExternoComponent } from './components/personal/personal-contenido/externo/externo.component';
import { NoAsistencialCreateComponent } from './components/personal/personal-contenido/no-asistencial-create/no-asistencial-create.component';
import { NoAsistencialDetailComponent } from './components/personal/personal-contenido/no-asistencial-detail/no-asistencial-detail.component';
import { NoAsistencialEditComponent } from './components/personal/personal-contenido/no-asistencial-edit/no-asistencial-edit.component';
import { NoAsistencialComponent } from './components/personal/personal-contenido/no-asistencial/no-asistencial.component';

import { LegajoCreateNoasistencialComponent } from './components/personal/legajo/legajo-create-noasistencial/legajo-create-noasistencial.component';
import { LegajoCreateComponent } from './components/personal/legajo/legajo-create/legajo-create.component';
import { LegajoDetailComponent } from './components/personal/legajo/legajo-detail/legajo-detail.component';
import { LegajoEditNoasistencialComponent } from './components/personal/legajo/legajo-edit-noasistencial/legajo-edit-noasistencial.component';
import { LegajoEditComponent } from './components/personal/legajo/legajo-edit/legajo-edit.component';
import { LegajoNoAsistencialComponent } from './components/personal/legajo/legajo-no-asistencial/legajo-no-asistencial.component';
import { LegajoPersonComponent } from './components/personal/legajo/legajo-person/legajo-person.component';

import { PersonalDhCreateComponent } from './components/personal/personal-dh-create/personal-dh-create.component';
import { PersonalDhDetailComponent } from './components/personal/personal-dh-detail/personal-dh-detail.component';
import { PersonalDhEditComponent } from './components/personal/personal-dh-edit/personal-dh-edit.component';
import { PersonalDhHistorialComponent } from './components/personal/personal-dh-historial/personal-dh-historial.component';
import { PersonalDhComponent } from './components/personal/personal-dh/personal-dh.component';


//Sección: Cronograma
import { CronogramaCreateComponent } from './components/cronogramas/cronograma-create/cronograma-create.component';
import { CronogramaDefComponent } from './components/cronogramas/cronograma-def/cronograma-def.component';
import { CronogramaDetailComponent } from './components/cronogramas/cronograma-detail/cronograma-detail.component';
import { CronogramaPDefComponent } from './components/cronogramas/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPHosComponent } from './components/cronogramas/cronograma-p-hos/cronograma-p-hos.component';
import { CronogramaPComponent } from './components/cronogramas/cronograma-p/cronograma-p.component';
import { CronogramaPendienteDetailComponent } from './components/cronogramas/cronograma-pendiente-detail/cronograma-pendiente-detail.component';
import { CronogramaPendienteComponent } from './components/cronogramas/cronograma-pendiente/cronograma-pendiente.component';
import { CronogramaRegComponent } from './components/cronogramas/cronograma-reg/cronograma-reg.component';
import { CronogramaComponent } from './components/cronogramas/cronograma/cronograma.component';



//Sección: Guardias
import { DdjjCargoyagrupDetailComponent } from './components/guardias/ddjj-cargoyagrup-detail/ddjj-cargoyagrup-detail.component';
import { DdjjCargoyagrupComponent } from './components/guardias/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { DdjjContrafacturaComponent } from './components/guardias/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjExtraDetailComponent } from './components/guardias/ddjj-extra-detail/ddjj-extra-detail.component';
import { DdjjExtraComponent } from './components/guardias/ddjj-extra/ddjj-extra.component';
import { DdjjSeleccionComponent } from './components/guardias/ddjj-seleccion/ddjj-seleccion.component';
import { DdjjTentativoComponent } from './components/guardias/ddjj-tentativo/ddjj-tentativo.component';
import { GuardiasViewComponent } from './components/guardias/guardias-view/guardias-view.component';

import { RmensualCargoyagrupComponent } from './components/guardias/rmensual-cargoyagrup/rmensual-cargoyagrup.component';
import { RmensualContrafacturaFueraTerminoComponent } from './components/guardias/rmensual-contrafactura-fuera-termino/rmensual-contrafactura-fuera-termino.component';
import { RmensualContrafacturaComponent } from './components/guardias/rmensual-contrafactura/rmensual-contrafactura.component';
import { RmensualExtraComponent } from './components/guardias/rmensual-extra/rmensual-extra.component';
import { RmensualSeleccionComponent } from './components/guardias/rmensual-seleccion/rmensual-seleccion.component';


//Sección: Historial
import { HistorialComponent } from './components/historial/historial.component';



import { DigestoComponent } from './components/digesto/digesto.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { NovedadesPersonCreateComponent } from './components/personal/novedades/novedades-person-create/novedades-person-create.component';
import { NovedadesPersonEditComponent } from './components/personal/novedades/novedades-person-edit/novedades-person-edit.component';
import { NovedadesPersonComponent } from './components/personal/novedades/novedades-person/novedades-person.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';


//Redirecciona cuando no existe la direccion ingresada
import { NotFoundComponent } from './components/not-found/not-found.component';



import { AsistencialFiltradoSelectorComponent } from './components/personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
import { AutoridadDetailComponent } from './components/personal/personal-contenido/autoridad-detail/autoridad-detail.component';
import { AutoridadEditComponent } from './components/personal/personal-contenido/autoridad-edit/autoridad-edit.component';
import { AutoridadComponent } from './components/personal/personal-contenido/autoridad/autoridad.component';



const routes: Routes = [
  
  //Principales
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:"home-page", component:HomePageComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:"efector-selector", component:EfectorSelectorComponent},
  {path:"home-profesional", component:HomeProfesionalComponent, canActivate: [ProfessionalAuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},
  {path:"home-profesional-public", component:HomeProfesionalPublicComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},
  {path:"guardias-pendientes-profesionales", component:GuardiasPendientesProfesionalesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},
  {path:"home-hospital", component:HomeHospitalComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_HOSPITAL'] }},
  {path:"home-autoridad", component:HomeAutoridadComponent},
  {path: 'configuracion', component:ConfiguracionComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'login', component:LoginComponent},
  {path: 'reportes', component:ReportesComponent},

  //Configuraciones: Generales
  {path: 'valores-guardias', component:ValoresGuardiasComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'valores-guardias-create', component:ValoresGuardiasCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'valores-bono-uti-create', component:ValoresBonoUtiCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'soporte-form', component:SoporteFormComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},


  //Configuraciones: Territorio
  {path: 'pais', component:PaisComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'pais-detail/:id', component:PaisDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'pais-edit/:id', component:PaisEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'provincia', component:ProvinciaComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'provincia-detail/:id', component:ProvinciaDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'provincia-edit/:id', component:ProvinciaEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'departamento', component:DepartamentoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'departamento-detail/:id', component:DepartamentoDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'departamento-edit/:id', component:DepartamentoEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'localidad', component:LocalidadComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'localidad-detail/:id', component:LocalidadDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'localidad-edit/:id', component:LocalidadEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
 
  //Configuraciones: Establecimientos
  {path: 'ministerio', component:MinisterioComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'ministerio-detail/:id', component:MinisterioDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'ministerio-edit/:id', component:MinisterioEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'hospital', component:HospitalComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'hospital-detail/:id', component:HospitalDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'hospital-edit/:id', component:HospitalEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'caps', component:CapsComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'caps-detail/:id', component:CapsDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'caps-edit/:id', component:CapsEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'region', component:RegionComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'region-detail/:id', component:RegionDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'region-edit/:id', component:RegionEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'permisos-efectores', component:PermisosEfectoresComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

 
  //Configuraciones: Profesionales
  {path: 'profesion', component:ProfesionComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'profesion-detail/:id', component:ProfesionDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'profesion-edit/:id', component:ProfesionEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'especialidad', component:EspecialidadComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'especialidad-detail/:id', component:EspecialidadDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'especialidad-edit/:id', component:EspecialidadEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
 
  //Configuraciones: Personas
  {path: 'person', component:PersonComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'person-detail/:id', component:PersonDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'person-edit/:id', component:PersonEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'person-edit', component: PersonEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'revista', component: RevistaComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'revista-edit/:id', component: RegionEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  {path: 'usuario', component:UsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_SUPERUSER'] } },
  {path: 'usuario-detail/:id', component:UsuarioDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_SUPERUSER'] } },
  {path: 'usuario-edit/:id', component:UsuarioEditComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_SUPERUSER'] } },
  
  //Configuraciones: Leyes y novedades
  {path: 'articulo', component:ArticuloComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'articulo-detail/:id', component:ArticuloDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'articulo-edit/:id', component:ArticuloEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'inciso', component:IncisoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'inciso-detail/:id', component:IncisoDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'inciso-edit/:id', component:IncisoEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'tipo-ley', component:TipoLeyComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'tipo-ley-edit/:id', component:TipoLeyEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'tipo-licencia', component:TipoLicenciaComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'tipo-licencia/:id', component:TipoLicenciaDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'tipo-licencia/:id', component:TipoLicenciaEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  
  //Autoridad
  {path: 'autoridad', component:AutoridadComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'autoridad-detail/:id', component:AutoridadDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'autoridad-edit/:id', component:AutoridadEditComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_SUPERUSER', 'ROLE_DPH'] } },


  //Configuraciones: Calendario
  {path: 'feriado', component:FeriadoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'feriado-detail/:id', component:FeriadoDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'feriado-edit/:id', component:FeriadoEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  
  //Notificacion
  {path: 'notificacion', component:NotificacionComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }}, 
  {path: 'notificacion-detail', component:NotificacionDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }}, 
  {path: 'notificacion-edit', component:NotificacionEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }}, 


  //Sección: Actividades
  {path:'registro-diario',component: RegistroDiarioComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'registro-actividades',component: RegistroActividadesComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'registro-actividades-ingreso',component: RegistroActividadesIngresoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'registro-actividades-egreso', component: RegistroActividadesEgresoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  {path:"registro-actividades-ingreso-profesional",component: RegistroActividadesIngresoProfesionalComponent, canActivate: [ProfessionalAuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},
  {path:"registro-actividades-egreso-profesional", component: RegistroActividadesEgresoProfesionalComponent, canActivate: [ProfessionalAuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},
  {path:"registro-actividades-profesionales", component: RegistroActividadesProfesionalesComponent, canActivate: [ProfessionalAuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},
  {path:"registro-actividades-profesionales-public", component: RegistroActividadesProfesionalesPublicComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['ROLE_USER'] }},

  //Sección: Personal
  {path: 'personal', component:PersonalComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-no-asistencial', component:PersonalNoAsistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-autoridad-list', component:PersonalAutoridadListComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-sin-legajo', component:PersonalSinLegajoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-externo', component:PersonalExternoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-legajo', component:PersonalLegajoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-legajo-no-asistencial', component:PersonalLegajoNoAsistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-legajo-select', component:PersonalLegajoSelectComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asist-profesional', component:AsistProfesionalComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-autoridad', component:PersonalAutoridadComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial-selector', component:AsistencialSelectorComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial-selector-all', component:AsistencialSelectorAllComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial-filtrado-selector', component:AsistencialFiltradoSelectorComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial-create', component:AsistencialCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial', component:AsistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial-detail/:id', component:AsistencialDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'asistencial-edit', component:AsistencialEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'no-asistencial', component:NoAsistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'no-asistencial-create', component:NoAsistencialCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'no-asistencial-detail/:id', component:NoAsistencialDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'no-asistencial-edit', component:NoAsistencialEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'autoridad-list', component:AutoridadListComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'externo', component:ExternoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  {path: 'personal-dh', component:PersonalDhComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-dh-edit', component:PersonalDhEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-dh-detail', component:PersonalDhDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-dh-create', component:PersonalDhCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'personal-dh-historial', component:PersonalDhHistorialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cargo', component:CargoComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cargo-detail/:id', component:CargoDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cargo-edit/:id', component:CargoEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  {path: 'legajo-create', component: LegajoCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-detail/:id', component:LegajoDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-edit/:id', component:LegajoEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-edit', component:LegajoEditComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-no-asistencial', component:LegajoNoAsistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-create-noasistencial', component: LegajoCreateNoasistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-edit-noasistencial/:id', component:LegajoEditNoasistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-edit-noasistencial', component:LegajoEditNoasistencialComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'legajo-person', component:LegajoPersonComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},


  //Sección: Cronograma
  {path: 'cronograma', component:CronogramaComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-pendiente', component:CronogramaPendienteComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-pendiente-detail', component:CronogramaPendienteDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-create', component:CronogramaCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-detail', component:CronogramaDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-def', component:CronogramaDefComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-reg', component:CronogramaRegComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-p', component:CronogramaPComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-p-def', component:CronogramaPDefComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path: 'cronograma-p-hos', component:CronogramaPHosComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},


  //Sección: Guardias
  {path:'guardias-view', component: GuardiasViewComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-seleccion',component:DdjjSeleccionComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-extra',component:DdjjExtraComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-extra-detail',component:DdjjExtraDetailComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-contrafactura',component:DdjjContrafacturaComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-cargoyagrup',component:DdjjCargoyagrupComponent, canActivate: [AuthGuard, RoleGuard], data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-cargoyagrup-detail',component:DdjjCargoyagrupDetailComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'ddjj-tentativo',component:DdjjTentativoComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  {path:'rmensual-seleccion',component:RmensualSeleccionComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'rmensual-cargoyagrup',component:RmensualCargoyagrupComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'rmensual-extra',component:RmensualExtraComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'rmensual-contrafactura',component:RmensualContrafacturaComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  {path:'rmensual-contrafactura-fuera-termino',component:RmensualContrafacturaFueraTerminoComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
 

  //Sección: Historial
  {path: 'historial', component:HistorialComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},



  { path: 'novedades-person-edit', component: NovedadesPersonEditComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  { path: 'novedades-person-create', component: NovedadesPersonCreateComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  { path: 'novedades-person', component: NovedadesPersonComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},

  /*  {path:'api', component:ApiComponent} */
  { path: 'digesto', component:DigestoComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},
  { path: 'novedades', component:NovedadesComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }}, 
  { path: 'popup-novedad-agregar', component:PopupNovedadAgregarComponent, data: { deniedRoles: ['ROLE_USER', 'ROLE_HOSPITAL'] }},


  //Pagina no encontrada
{ path: 'not-found', component: NotFoundComponent, canActivate: [AuthGuard] },
{ path: '**', redirectTo: 'not-found' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
