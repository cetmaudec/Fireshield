import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Component({
  selector: 'app-estadobrigadistasbrigada',
  templateUrl: './estadobrigadistasbrigada.component.html',
  styleUrls: ['./estadobrigadistasbrigada.component.css']
})
export class EstadobrigadistasbrigadaComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar el estado (en forma de semáforo) de cada uno de los brigadistas
    de una brigada en particular.
  */

  // Variable que se utiliza para almacenar el número de la brigada desde la ruta.

  n_brigada: any ;
  
  // Variable que se utiliza para almacenar el nombre de la brigada desde la ruta.

  nombre_brigada:any;

  // Variable que almacena el estado actual de cada uno de los brigadistas de la brigada en cuestión.

  brigadistas$: any = [];

  datosEstado$: any = [];

  /*
    Variable que se utiliza para calcular la latitud promedio de todos los brigadistas de la brigada, para poder dejar el 
    mapa centrado en este punto.
  */

  latProm: any;

  /*
    Variable que se utiliza para calcular la longitud promedio de todos los brigadistas de la brigada, para poder dejar el 
    mapa centrado en este punto.
  */

  longProm: any;

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  intervalUpdate: any = null;

  /*
    En el constructor se obtiene el número de brigada y el nombre de la misma a través de la ruta,
    además cargo del usuario actual. Por otro lado, se declara la variable que será útil para realizar 
    consultas a la base de datos a través del server (HttpClient).
  */


  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre_brigada = this.rutaActiva.snapshot.paramMap.get('id2');
    this.latProm = 0;
    this.longProm = 0;
   }

  /*
    En el OnInit se obtienen los datos actuales de cada uno de los brigadistas de la brigada en cuestión. 

  */ 

  async ngOnInit() {
    this.brigadistas$ = await this.getBrigadistas();
    
    this.intervalUpdate = setInterval(function(){
      this.showData();
    }.bind(this), 20000);
  }


  async showData(){
    this.brigadistas$ = await this.getBrigadistas();
  }


  async getBrigadistas(){
    let headers: HttpHeaders = new HttpHeaders();
    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);
    this.brigadistas$ = await this.http.get(environment.urlAddress+'brigadistas',{ headers: new HttpHeaders({ 'Content-Type': 'application/json'}), params: params}).toPromise();
    return this.brigadistas$;
  }

 
  // Método que calcula la latitud y longitud promedio de las posiciones de todos los brigadistas de la brigada.
  calcLatLongProm(){
    console.log(this.brigadistas$);
    let tam = this.brigadistas$.data.length;
    for(let i=0; i<tam; i++){
      this.latProm = this.latProm + this.brigadistas$.data[i].latidud;
      this.longProm = this.longProm + this.brigadistas$.data[i].longitud;
    }
    
    this.latProm = this.latProm/tam;
    this.longProm = this.longProm/tam;
    
  }
}
