import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar el navbar de manera correcta. Para que pueda actualizarse cada cierto tiempo,
    y para conocer el número de personas en espera de ser aceptados como usuarios. 
  */

  // Variable que retorna el número de personas que están en la lista de espera para ser usuarios.

  espera$: any;

  // Variable que almacena el número de personas que están en la lista de espera para ser usuarios.

  num: any;

  // Variable que permite que el navbar actualice su información cada cierto intervalo de tiempo.

  intervalHolder: any;

   /*
    En el constructor se obtiene la cantidad de personas que están en la lista de espera.
    Por otro lado, se declaran variables que serán útiles para realizar consultas a la base de datos a 
    través del server (HttpClient), para deslogearse con el servicio de autentificacion y para poder
    actualizar la información del navbar cada cierto tiempo. 
   */
 

  constructor(private router: Router, public auth: AuthService,private http: HttpClient, private _changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit() {
    
    // Método que obtiene el número de personas que están en la lista de espera para ser aceptados como usuarios.

    this.getData();

    // Actualizar la información del navbar cada cierto tiempo.

    this.intervalHolder =  setInterval(()=>{
      this._changeDetectorRef.markForCheck();
      //console.log("entro");
      this.getData();
    }, 60000);
    
    
  }
  async getData(){
    this.num=await this.getNumEspera();
  }

  async getNumEspera(){
    this.espera$= await this.http.get('http://3.13.114.248:8000/nEspera').toPromise();
    return this.espera$.data[0].numero;

  }

  // Método que sirve para que el navbar sea responsive y que se vuelva tipo tablet/celular al achicarse mucho.

  myFunction() {
    
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
    x.className += " responsive";
    } else {
    x.className = "topnav";
    }
  }

  // Método que permite utilizar el servicio de autentificacion para que el usuario actual pueda deslogearse.
  
  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
  

}
