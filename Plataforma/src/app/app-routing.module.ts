import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EstadoComponent } from './estado/estado.component';
import { ContactoComponent } from './contacto/contacto.component';


const routes: Routes = [
  {path:'', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'home', component: HomeComponent},
  {path: 'estado', component: EstadoComponent},
  {path: 'contacto', component: ContactoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
