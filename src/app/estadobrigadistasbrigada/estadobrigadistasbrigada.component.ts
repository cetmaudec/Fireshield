import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-estadobrigadistasbrigada',
  templateUrl: './estadobrigadistasbrigada.component.html',
  styleUrls: ['./estadobrigadistasbrigada.component.css']
})
export class EstadobrigadistasbrigadaComponent implements OnInit {
  brig: any ;
  brigadistas$: any = [];
  datosEstado$: any = [];
  latProm: any;
  longProm: any;
  cargo:any;
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    this.brig=this.rutaActiva.snapshot.paramMap.get('id');
    this.latProm = 0;
    this.longProm = 0;
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
    headers = headers.append('id', this.brig);


    console.log(this.brig);
    this.brigadistas$ = await this.http.get('http://localhost:8000/estadobrigadistas/'+this.brig).toPromise();
    
    try {
      
    }catch(e) {
      if(e instanceof RangeError){
        this.brigadistas$ = 0;
      }
      
    }

    this.calcLatLongProm();



  }

  setDatosRandom(){
    this.http.get('http://localhost:8000/datosRandom').subscribe(resp2 =>
    this.datosEstado$ = resp2 as []
    )
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
  
  
}
