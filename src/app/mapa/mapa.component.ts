import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import * as L from 'leaflet';



var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [41, 41],
   
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [70, 41]
  }
});

const marcadorVerde = new LeafIcon({
  iconUrl: 'assets/verdao.png',
  shadowUrl: 'assets/marker-shadow.png'
});

const marcadorAmarillo = new LeafIcon({
  iconUrl: 'assets/amarelo.png',
  shadowUrl: 'assets/marker-shadow.png'
});

const marcadorRojo = new LeafIcon({
  iconUrl: 'assets/rojinho.png',
  shadowUrl: 'assets/marker-shadow.png'
});





@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})



export class MapaComponent implements AfterViewInit, OnInit {
  private map;


  n_brigada: any ;

  nombre_brigada: any ;

  brigadistas$: any = [];

  datosEstado$: any = [];

  latProm: any;

  longProm: any;

  cargo:any;

  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient, private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre_brigada = this.rutaActiva.snapshot.paramMap.get('id2');
    this.latProm = 0.0;
    this.longProm = 0.0;

  }

  ngOnInit() {

  }

  async ngAfterViewInit(){

    await this.getBrigadistas();


    this.initMap();

      const tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    tiles.addTo(this.map);

    await this.addMarkers();

  }


  private initMap(): void {
    this.map = L.map('map', {
      center: [ this.latProm, this.longProm ],
      zoom: 14
    });
  }


  async getBrigadistas(){
    let headers: HttpHeaders = new HttpHeaders();


    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);

    this.brigadistas$ = await this.http.get('http://3.13.114.248:8000/estadobrigadistas',{ headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).toPromise();



    await this.calcLatLongProm();

    return;



  }

  async calcLatLongProm(){
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

  async addMarkers(){
    let tam = this.brigadistas$.data.length;

    for(let i=0;i<tam;i++){
      var button = document.createElement('button');
      button.innerText = this.brigadistas$.data[i].nombre + ' ' + this.brigadistas$.data[i].apellidoP + ' ' + this.brigadistas$.data[i].apellidoM;
      button.id="Boton";
      let self = this;
      button.onclick=function(){
        self.router.navigate(['/estadobrigadista/' + self.brigadistas$.data[i].rut]);
        console.log(self.brigadistas$.data[i].rut);
      };
      if(this.brigadistas$.data[i].fatigado==0){
        L.marker([this.brigadistas$.data[i].latidud, this.brigadistas$.data[i].longitud], {icon: marcadorVerde}).addTo(this.map).bindPopup(button);
      }else if(this.brigadistas$.data[i].fatigado==1){

        L.marker([this.brigadistas$.data[i].latidud, this.brigadistas$.data[i].longitud], {icon: marcadorAmarillo}).addTo(this.map).bindPopup(button);
      }else{
        L.marker([this.brigadistas$.data[i].latidud, this.brigadistas$.data[i].longitud], {icon: marcadorRojo}).addTo(this.map).bindPopup(button);
      }

    }

  }



}