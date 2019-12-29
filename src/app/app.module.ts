import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import {MatTabsModule} from '@angular/material/tabs';
import {TabsModule} from 'ngx-tabset';
import { IgxCarouselModule } from 'igniteui-angular';
import {CarouselModule} from "ngx-carousel-lib";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  


//I keep the new line
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './home/home.component';
import { EstadoComponent } from './estado/estado.component';
import { ContactoComponent } from './contacto/contacto.component';
import * as $ from 'jquery';
import { BrigadasComponent } from './brigadas/brigadas.component';
import { BrigadistasComponent } from './brigadistas/brigadistas.component';
import { AddBrigadistaComponent } from './add-brigadista/add-brigadista.component';
import { ModBrigadistaComponent } from './mod-brigadista/mod-brigadista.component';
import { CombatesComponent } from './combates/combates.component';
import { EstadobrigadistasbrigadaComponent } from './estadobrigadistasbrigada/estadobrigadistasbrigada.component';
import { EstadobrigadistaComponent } from './estadobrigadista/estadobrigadista.component';
import { AddBrigadaComponent } from './add-brigada/add-brigada.component';
import { ModBrigadaComponent } from './mod-brigada/mod-brigada.component';
import { UnirseCombateComponent } from './unirse-combate/unirse-combate.component';
import { CombateBrigComponent } from './combate-brig/combate-brig.component';
import { ModCombateComponent } from './mod-combate/mod-combate.component';
import { MapaComponent } from './mapa/mapa.component';
import { Navbar2Component } from './navbar2/navbar2.component';
import { PersonalComponent } from './personal/personal.component';
import { ModPersonalComponent } from './mod-personal/mod-personal.component';
import { ReporteriaComponent } from './reporteria/reporteria.component';
// For MDB Angular Free

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    FooterComponent,
    RegistroComponent,
    HomeComponent,
    EstadoComponent,
    ContactoComponent,
    BrigadasComponent,
    BrigadistasComponent,
    AddBrigadistaComponent,
    ModBrigadistaComponent,
    CombatesComponent,
    EstadobrigadistasbrigadaComponent,
    EstadobrigadistaComponent,
    AddBrigadaComponent,
    ModBrigadaComponent,
    UnirseCombateComponent,
    CombateBrigComponent,
    ModCombateComponent,
    MapaComponent,
    Navbar2Component,
    PersonalComponent,
    ModPersonalComponent,
    ReporteriaComponent

    //I keep the new line
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    ChartsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    IgxCarouselModule,
    NgSelectModule,
    GoogleMapsModule,
    NgbModule,
  
    MatCarouselModule.forRoot(),
    MatTabsModule,
    TabsModule,
    CarouselModule,
    
    


    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZooAkDjnn2bF4nrmvqrx3WrdlRBP38Ow',
      libraries: ['places']
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8000'],
        blacklistedRoutes: ['localhost:8000/auth']
      }
    })
  ],
  entryComponents: [],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
