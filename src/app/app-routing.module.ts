import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EstadoComponent } from './estado/estado.component';
import { ContactoComponent } from './contacto/contacto.component';
import { EstadobrigadistasbrigadaComponent} from './estadobrigadistasbrigada/estadobrigadistasbrigada.component';
import { EstadobrigadistaComponent } from './estadobrigadista/estadobrigadista.component';
import { BrigadasComponent } from './brigadas/brigadas.component';
import { BrigadistasComponent } from './brigadistas/brigadistas.component';
import { AddBrigadistaComponent } from './add-brigadista/add-brigadista.component';
import { ModBrigadistaComponent } from './mod-brigadista/mod-brigadista.component';
import { CombatesComponent } from './combates/combates.component';
import { AddBrigadaComponent } from './add-brigada/add-brigada.component';
import { ModBrigadaComponent } from './mod-brigada/mod-brigada.component';
import { CombateBrigComponent } from './combate-brig/combate-brig.component';
import { UnirseCombateComponent } from './unirse-combate/unirse-combate.component';
import { ModCombateComponent } from './mod-combate/mod-combate.component';
import { MapaComponent } from './mapa/mapa.component';
import { PersonalComponent } from './personal/personal.component';
import { ModPersonalComponent } from './mod-personal/mod-personal.component';






const routes: Routes = [
  {path:'', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'home', component: HomeComponent,canActivate: [AuthGuard]},
  {path: 'estado', component: EstadoComponent,canActivate: [AuthGuard]},
  {path: 'contacto', component: ContactoComponent,canActivate: [AuthGuard]},
  {path: 'estadobrigadistasbrigada/:id', component: EstadobrigadistasbrigadaComponent,canActivate: [AuthGuard]},
  {path: 'estadobrigadista/:rut', component: EstadobrigadistaComponent,canActivate: [AuthGuard]},
  {path: 'brigadas', component: BrigadasComponent,canActivate: [AuthGuard]},
  {path: 'brigadistas/:id/:id2', component: BrigadistasComponent,canActivate: [AuthGuard]},
  {path: 'addBrigadista', component: AddBrigadistaComponent,canActivate: [AuthGuard]},
  {path: 'modBrigadista/:id', component: ModBrigadistaComponent,canActivate: [AuthGuard]},
  {path: 'combates', component: CombatesComponent,canActivate: [AuthGuard]},
  {path: 'addbrigada', component: AddBrigadaComponent,canActivate: [AuthGuard]},
  {path: 'modBrigada/:id/:id2', component: ModBrigadaComponent,canActivate: [AuthGuard]},
  {path: 'combateBrig/:id', component: CombateBrigComponent,canActivate: [AuthGuard]},
  {path: 'unirseCombate/:id', component: UnirseCombateComponent,canActivate: [AuthGuard]},
  {path: 'modCombate/:id', component: ModCombateComponent ,canActivate: [AuthGuard]},
  {path: 'mapa/:id', component: MapaComponent ,canActivate: [AuthGuard]},
  {path: 'personal', component: PersonalComponent ,canActivate: [AuthGuard]},
  {path: 'modPersonal/:id', component: ModPersonalComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
