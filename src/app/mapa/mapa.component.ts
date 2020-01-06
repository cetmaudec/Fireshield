import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar un mapa con todos los brigadistas de una brigada en particular. Cada
    uno de estos brigadistas serán marcados con un marcador de un color que representa su nivel de fatiga.
  */

  /*
    Variable que almacena el número de la brigada de la que se desea conocer la ubicación de sus brigadistas. 
    Esto se obtiene de la ruta.
  */

  n_brigada: any ;

  /*
    Variable que almacena el nombre de la brigada de la que se desea conocer la ubicación de sus brigadistas. 
    Esto se obtiene de la ruta.
  */

  nombre_brigada: any ;

  // Variable que almacena las posiciones de cada uno de los brigadistas de la brigada en cuestión.

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

  // Variable que permite que al presionar sobre el marcador del brigadista, muestre su nombre y rut.

  infoWindow: any;

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  /*
    En el constructor se obtiene el número de brigada y el nombre de la misma a través de la ruta,
    además cargo del usuario actual. Por otro lado, se declara la variable que será útil para realizar 
    consultas a la base de datos a través del server (HttpClient).
  */

  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre_brigada = this.rutaActiva.snapshot.paramMap.get('id2');
    this.latProm = 0.0;
    this.longProm = 0.0;
   }


  // El método onInit lo que realiza es obtener las últimas posiciones de cada uno de los brigadistas de la brigada.  

  ngOnInit() {
    this.getBrigadistas();
    
    /*setTimeout(function(){
      window.location.reload();
    }, 5000);
    this.setDatosRandom();*/
  }


  async getBrigadistas(){
    let headers: HttpHeaders = new HttpHeaders();
    

    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);
    
    this.brigadistas$ = await this.http.get('http://localhost:8000/estadobrigadistas',{ headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).toPromise();
    
    

    this.calcLatLongProm();



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
    
    console.log("1 "+this.latProm);
    console.log("2 "+this.longProm);

    console.log(this.brigadistas$.data.length);
  }

  // Método que posibilita que al pasar el mouse encima del marcador del brigadista, se abra el cuadro de información de este.

  onMouseOver(infoWindow, gm) {

    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
}

  // Método que posibilita que se cierre el cuadro de información del brigadista.

  close_window(infoWindow, gm){
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }


  }


}