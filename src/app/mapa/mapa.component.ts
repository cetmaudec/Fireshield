import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  n_brigada: any ;
  nombre_brigada: any ;
  brigadistas$: any = [];
  datosEstado$: any = [];
  latProm: any;
  longProm: any;
  infoWindow: any;
  cargo:any;
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre_brigada = this.rutaActiva.snapshot.paramMap.get('id2');
    this.latProm = 0.0;
    this.longProm = 0.0;
   }

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

  onMouseOver(infoWindow, gm) {

    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
}


  close_window(infoWindow, gm){
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }


  }


}