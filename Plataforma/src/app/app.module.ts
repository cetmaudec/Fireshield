import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './home/home.component';
import { EstadoComponent } from './estado/estado.component';
import { ContactoComponent } from './contacto/contacto.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    FooterComponent,
    RegistroComponent,
    HomeComponent,
    EstadoComponent,
    ContactoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
