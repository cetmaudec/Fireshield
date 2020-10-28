import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import * as L from 'leaflet';
import { environment } from '../environment';


var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [41, 41],
   
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [70, 41]
  }
});


const marcadorVerde = new LeafIcon({
  iconUrl: '../assets/images/icons/verde_marker.png',
  shadowUrl: 'assets/marker-shadow.png'
});

const marcadorAmarillo = new LeafIcon({
  iconUrl: '../assets/images/icons/ama_marker.png',
  shadowUrl: 'assets/marker-shadow.png'
});

const marcadorRojo = new LeafIcon({
  iconUrl: '../assets/images/icons/rojo_marker.png',
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

  exitData: Boolean = false;

  intervalUpdate: any = null;

  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient, private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre_brigada = this.rutaActiva.snapshot.paramMap.get('id2');
    this.latProm = 0.0;
    this.longProm = 0.0;

  }

  ngOnInit() {
    this.intervalUpdate = setInterval(function(){
      this.showData();
    }.bind(this), 20000);
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


  async showData(){
    await this.getBrigadistas();
    console.log("showData");
    await this.addMarkers();
  }
  
  ngOnDestroy() {
    clearInterval(this.intervalUpdate);
   }


  private initMap(): void {
    this.map = L.map('map', {
      center: [ this.latProm, this.longProm ],
      zoom: 17
    });
  }


  async getBrigadistas(){
    let headers: HttpHeaders = new HttpHeaders();
    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);
    this.brigadistas$ = await this.http.get(environment.urlAddress+'select/brigadistas/gps',{ headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).toPromise();   
    if(this.brigadistas$.data.length>=1){
      this.exitData = true;
    }
    await this.calcLatLongProm();
    return;
  }


  async calcLatLongProm(){
    let tam = this.brigadistas$.data.length;
    for(let i=0; i<tam; i++){
      if(this.brigadistas$.data[i].latitud>=-56 && this.brigadistas$.data[i].latitud<=-17 && 
        this.brigadistas$.data[i].longitud>=-75 && this.brigadistas$.data[i].longitud<=-66){
        this.latProm = this.latProm + this.brigadistas$.data[i].latitud;
        this.longProm = this.longProm + this.brigadistas$.data[i].longitud;
        console.log(this.brigadistas$.data[i].latitud);
        console.log(this.brigadistas$.data[i].longitud);
      }else{
        tam = tam -1;
      }       
    }
    this.latProm = this.latProm/tam;
    this.longProm = this.longProm/tam;
  }


  async addMarkers(){
    let tam = this.brigadistas$.data.length;
    for(let i=0;i<tam;i++){
      var button = document.createElement('button');
      button.innerText = this.brigadistas$.data[i].nombre + ' ' + this.brigadistas$.data[i].apellidoP + ' ' + this.brigadistas$.data[i].apellidoM;
      button.id="button";
      let self = this;
      button.onclick=function(){
        self.router.navigate(['/estadobrigadista/' + self.brigadistas$.data[i].rut]);
      };
      if(this.brigadistas$.data[i].fatigado==0){
        L.marker([this.brigadistas$.data[i].latitud, this.brigadistas$.data[i].longitud], {icon: marcadorVerde}).addTo(this.map).bindPopup(button);
      }else if(this.brigadistas$.data[i].fatigado==1){

        L.marker([this.brigadistas$.data[i].latitud, this.brigadistas$.data[i].longitud], {icon: marcadorAmarillo}).addTo(this.map).bindPopup(button);
      }else{
        L.marker([this.brigadistas$.data[i].latitud, this.brigadistas$.data[i].longitud], {icon: marcadorRojo}).addTo(this.map).bindPopup(button);
      }

    }

  }



}