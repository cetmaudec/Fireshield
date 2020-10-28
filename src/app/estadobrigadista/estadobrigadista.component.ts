import { Component, AfterViewInit, OnInit, ViewChild  } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as L from 'leaflet';

import { environment } from '../environment';



@Component({
  selector: 'app-estadobrigadista',
  templateUrl: './estadobrigadista.component.html',
  styleUrls: ['./estadobrigadista.component.css']
})

export class EstadobrigadistaComponent implements OnInit{

  /*
    Variables utilizadas para poder desplegar información respecto a un brigadista en particular. Se despliega un gráfico
    con los últimos datos del brigadista, además de una tabla con el dato actual y la ruta que ha seguido el brigadista.
  */
  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  // Variable que almacena hasta los últimos 20 datos de las fechas y horas del brigadista en cuestión.

  ultimasFechasYHoras$: any = [];

  // Variable que contiene el rut del brigadista del que se están obteniendo los datos. Este dato se obtiene desde la ruta.

  rut: any ;

  /*
    Variable de apoyo que se utiliza para dibujar en el mapa la trayectoria que siguió el brigadista. Esto pasa porque la
    consulta que realiza el server las envía ordenada al revez de como deben ser almacenadas en el arreglo.
  */

  k = 0;

  // Variable que almacena los últimos datos del brigadista en cuestión. Es decir, su actual temperatura, pulsación, ubicación, etc.

  datoActual$: any = [];


  // Variable que almacena las últimas 20 posiciones del brigadista en cuestión.

  ultimasPosiciones$: any = [];

  // Variable que retorna las últimas 20 posiciones del brigadista en cuestión.

  ultimasPosiciones2$: any = [];

  // Variable que se utiliza para desplegar en el mapa la trayectoria que siguió el brigadista.

  ultimasPosicionesfinal$: any = [];


  // Variable que almacena la información de su brigada en el combate.

  combatesbrigadadabrig$:any=[];

  // Variable que almacena la cantidad de tiempo que lleva el brigadista combatiendo.

  datos1 = { horas: 0, minutos: 0, segundos:0 };

  // Variable que almacena en formato de string el tiempo que lleva el brigadista combatiendo.

  tiempo : string;


  multiPolyLineOptions = {color:'red'};

  map:any;


  latlang:any;

  fatiga: any;
  nombre_brigadista: any;

  /*
    En el constructor se obtiene el número de rut del brigadista a través de la ruta,
    además cargo del usuario actual. Por otro lado, se declaran variables que serán útiles para realizar
    consultas a la base de datos a través del server (HttpClient) y para obtener los valores de la ruta.
    También, se inicializan los colores del gráfico.
  */

  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    this.rut=this.rutaActiva.snapshot.paramMap.get('rut');
    this.latlang = [
      [0.000,0.000]
    ];

  }

  /*
    En el OnInit se llaman los métodos necesarios obtener los datos para que se forme correctamente el gráfico asociado
    al brigadista, además de las posiciones para poder trazar la trayectoria que ha seguido. También se obtienen los datos
    que serán desplegados en la tabla de la información actual, así como la fatiga que posee el brigadista actualmente para
    cambiar el ícono del marcador al color correspondiente.
  */

  async ngOnInit() {
    //Método que obtiene el dato actual del brigadista.
    this.datoActual$ = await this.getDatoActual();

    this.fatiga = this.datoActual$[0].fatigado;
    this.nombre_brigadista = this.datoActual$[0].nombre+" "+this.datoActual$[0].apellidoP+" "+this.datoActual$[0].apellidoM;
  
    //Método que obtiene información de la brigada a la que pertenece el brigadista y su combate asociado.
    this.combatesbrigadadabrig$ = await this.getCombatesBrigadaBrig();
    this.tiempoCombate();
  }

  openCity(cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
  }

  
  async getDatoActual(){
    this.datoActual$ = await this.http.get(environment.urlAddress+'select/brigadista/data/last/'+this.rut).toPromise();
    return this.datoActual$.data;
  }

  async getCombatesBrigadaBrig(){
    return await this.http.get(environment.urlAddress+'select/combate/brigada/brigadista/'+this.rut).toPromise();
  }

  dhm(t){
    var ch = 60 * 60 * 1000,
        cm = 60 * 1000,
        h = Math.floor( (t) / ch),
        m = Math.floor( (t - h * ch) / cm),
        s = Math.round( (t - h * ch - m * cm)/1000),
        pad = function(n){ return n < 10 ? n : n; };
      if( m === 60 ){
        h++;
        m = 0;
      }
      this.datos1.horas = h;
      this.datos1.minutos = pad(m);
      this.datos1.segundos = pad(s);
  }

  tiempoCombate(){
    let dateString1=this.combatesbrigadadabrig$.data[0].fecha + ' ' + this.combatesbrigadadabrig$.data[0].hora;

    let date=dateString1.split(' ');

    var anyo = Number(date[0].split('-')[0]);
    var mes = Number(date[0].split('-')[1]);
    var dia = Number(date[0].split('-')[2]);
    var hora = Number(date[1].split(':')[0]);
    var minuto = Number(date[1].split(':')[1]);
    var segundo = Number(date[1].split(':')[2]);

    var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);

    let dateAct = new Date();


    let anyoAct = dateAct.getFullYear();
    let monthAct = dateAct.getMonth()+1;
    let dayAct = dateAct.getDate();

    let hourAct = dateAct.getHours();
    let minuteAct = dateAct.getMinutes();
    let secondsAct = dateAct.getSeconds();

    let mesString;
    let dayString;
    let hourString;
    let minuteString;
    let secondString;

    if(monthAct>=0 && monthAct<=9){
      mesString = '0' + monthAct;
    }else{
      mesString = monthAct;
    }

    if(dayAct>=0 && dayAct<=9){
      dayString = '0' + dayAct;
    }else{
      dayString = dayAct;
    }

    if(hourAct>=0 && hourAct<=9){
      hourString = '0' + hourAct;
    }else{
      hourString = hourAct;
    }

    if(minuteAct>=0 && minuteAct<=9){
      minuteString = '0' + minuteAct
    }else{
      minuteString = minuteAct
    }

    if(secondsAct>=0 && secondsAct<=9){
      secondString = '0' + secondsAct
    }else{
      secondString = secondsAct
    }

    let dateString2=anyoAct + '-'+ mesString + '-' + dayString + ' ' + hourString + ':' + minuteString + ':' + secondString;

    let date2=dateString2.split(' ');


    var anyo2 = Number(date2[0].split('-')[0]);
    var mes2 = Number(date2[0].split('-')[1]);
    var dia2 = Number(date2[0].split('-')[2]);
    var hora2 = Number(date2[1].split(':')[0]);
    var minuto2 = Number(date2[1].split(':')[1]);
    var segundo2 = Number(date2[1].split(':')[2]);

    var dateObj2=new Date(anyo2,mes2-1,dia2,hora2,minuto2,segundo2);


    var dif = dateObj2.getTime() - dateObj.getTime();

    this.dhm(dif);

    var horasString;
    var minutosString;
    var segundosString;

    if(this.datos1.horas >=0 && this.datos1.horas<=9){
      horasString = '0' + this.datos1.horas;
    }else{
      horasString = this.datos1.horas;
    }

    if(this.datos1.minutos>=0 && this.datos1.minutos<=9){
      minutosString = '0' + this.datos1.minutos
    }else{
      minutosString = this.datos1.minutos
    }

    if(this.datos1.segundos>=0 && this.datos1.segundos<=9){
      segundosString = '0' + this.datos1.segundos
    }else{
      segundosString = this.datos1.segundos
    }
    this.tiempo = horasString + ':' + minutosString + ':' + segundosString;
  }


}