import { Component, AfterViewInit, OnInit, ViewChild  } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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


var baseLayer = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '...',
    maxZoom: 50
  }
);


@Component({
  selector: 'app-map-unit',
  templateUrl: './map-unit.component.html',
  styleUrls: ['./map-unit.component.css']
})
export class MapUnitComponent implements OnInit, AfterViewInit  {

  	cargo:any;
  	rut: any ;
  	latlngs:any;

  	fatiga: any;
	nombre_brigadista: any;

  	intervalUpdate: any = null;
  	map:any;

  	Posiciones$:any = [];

  	constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
  		this.cargo=localStorage.getItem('cargo');
    	this.rut=this.rutaActiva.snapshot.paramMap.get('rut');
    	this.latlngs = [];
   	}

  	async ngOnInit() {
  		this.intervalUpdate = setInterval(function(){
    	  this.showData();
    	}.bind(this), 20000); 
  	}

	initMap(){
    	this.map = L.map('map', {
      	center: [this.Posiciones$[0].latitud, this.Posiciones$[0].longitud],
      	zoom: 17
    	});
  	}

  	async showData(){
    	this.Posiciones$ = await this.getUltimasPosiciones();
    	this.addRoutes()    	
  	}

  	async ngAfterViewInit(){
  		this.Posiciones$ = await this.getUltimasPosiciones(); 
    	this.map = L.map('map', {
      		center: [ this.Posiciones$[0].latitud,this.Posiciones$[0].longitud],
      		zoom: 18
    	});   
    	const tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      		maxZoom: 20,
      		subdomains:['mt0','mt1','mt2','mt3']
    	});
    	tiles.addTo(this.map);
    	await this.addMarkers();
   }


  	async getUltimasPosiciones(){
    	this.Posiciones$ = await this.http.get(environment.urlAddress+'select/brigadista/gps/last/'+this.rut).toPromise();
    	return this.Posiciones$.data;
  	}

  	async addMarkers(){
  		this.addRoutes();
    	if(this.Posiciones$[0].fatigado==0){
      		L.marker([this.Posiciones$[0].latitud, this.Posiciones$[0].longitud], {icon: marcadorVerde}).addTo(this.map);
    	}else if(this.Posiciones$[0].fatigado==1){
      		L.marker([this.Posiciones$[0].latitud, this.Posiciones$[0].longitud], {icon: marcadorAmarillo}).addTo(this.map);
    	}else{
      		L.marker([this.Posiciones$[0].latitud, this.Posiciones$[0].longitud], {icon: marcadorRojo}).addTo(this.map);
    	}
    	return;
  	}


  	async addRoutes(){
  		var k = 0;
  		var tam = this.Posiciones$.length;
		for(let i=0; i<tam;i++){
      if(this.Posiciones$[tam - 1 -i].latitud!=-1 && this.Posiciones$[tam - 1 -i].longitud!=-1){
        console.log("dibuja");
        console.log(this.Posiciones$[tam - 1 -i].latitud, this.Posiciones$[tam - 1 -i].longitud);
	   		this.latlngs.push([this.Posiciones$[tam - 1 -i].latitud, this.Posiciones$[tam - 1 -i].longitud]);
		  }
    }
		var polyline = L.polyline(this.latlngs, {color: 'red'}).addTo(this.map);
	}
}
