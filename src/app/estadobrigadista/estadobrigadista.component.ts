import { Component, AfterViewInit, OnInit, ViewChild  } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
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


var baseLayer = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '...',
    maxZoom: 18
  }
);


@Component({
  selector: 'app-estadobrigadista',
  templateUrl: './estadobrigadista.component.html',
  styleUrls: ['./estadobrigadista.component.css']
})

export class EstadobrigadistaComponent implements OnInit, AfterViewInit {

  /*
    Variables utilizadas para poder desplegar información respecto a un brigadista en particular. Se despliega un gráfico
    con los últimos datos del brigadista, además de una tabla con el dato actual y la ruta que ha seguido el brigadista.
  */
  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  // Variable que almacena hasta los últimos 20 datos de las pulsaciones del brigadista en cuestión.

  ultimasPulsaciones$: any = [];

  // Variable que almacena hasta los últimos 20 datos de las saturaciones del brigadista en cuestión.

  ultimasSaturaciones$: any = [];

  // Variable que almacena hasta los últimos 20 datos de las temperaturas ambientales del brigadista en cuestión.

  ultimasTemperaturasAmbientales$: any = [];

  // Variable que almacena hasta los últimos 20 datos de las temperaturas corporales del brigadista en cuestión.

  ultimasTemperaturasCorporales$: any = [];

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

  // Variable que retorna los últimos datos del brigadista en cuestión. Es decir, su actual temperatura, pulsación, ubicación, etc.

  datoActual2$: any = [];

  // Variable que almacena las últimas 20 posiciones del brigadista en cuestión.

  ultimasPosiciones$: any = [];

  // Variable que retorna las últimas 20 posiciones del brigadista en cuestión.

  ultimasPosiciones2$: any = [];

  // Variable que se utiliza para desplegar en el mapa la trayectoria que siguió el brigadista.

  ultimasPosicionesfinal$: any = [];

  /*
    Variable que se utiliza para almacenar el ícono que se va a mostrar en la actual posición del brigadista en el mapa.
    Este varía de acuerdo a la fatiga que posee el brigadista en el actual momento.
  */

  iconAct : any;

  // Variable que permite que al presionar sobre el marcador del brigadista, muestre su nombre y rut.

  infoWindow : any;

  // Variable que almacena la información de su brigada en el combate.

  combatesbrigadadabrig$:any=[];

  // Variable que almacena la cantidad de tiempo que lleva el brigadista combatiendo.

  datos1 = { horas: 0, minutos: 0, segundos:0 };

  // Variable que almacena en formato de string el tiempo que lleva el brigadista combatiendo.

  tiempo : string;

  // Variable que sirve para etiquetar cada uno de los datos que serán desplegados en la gráfica del brigadista.

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Pulsaciones' },
    { data: [], label: 'T° Ambiental' },
    { data: [], label: 'T° Corporal'},
    { data: [], label: 'Saturación'}
  ];

  // Variable que sirve para las label del gráfico.

  public lineChartLabels: Label[] = [];

  /*
    Variable que sirve para definir todas las opciones del gráfico. Estas opciones pueden ser el color del fondo,
    el color de la letra, el tamaño de la letra, la cantidad de marcadores, etc.
  */

  public lineChartOptions: (ChartOptions & { annotation: any }) = {

    responsive: true,

    legend: {
      labels: {
          fontColor: "white"
      }
    },
    scales: {

      xAxes: [
        {

          ticks: {
            fontColor: 'white',
            autoSkip: true,
            maxTicksLimit: 5
          },
          gridLines: {
            color: 'rgba(255,255,255,0.3)',
          },


      }
    ],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'rgba(255,255,255,0.3)',
          },
          ticks: {
            fontColor: 'white',
          }
        }
      ]
    },

    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'white',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'white',
            content: 'LineAnno'
          }
        },
      ],
    },


  };

  // Variable que almacena algunos colores definidos.

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgb(128, 255, 128, 0.3)',
      borderColor: 'rgb(128, 255, 128, 1)',
      pointBackgroundColor:'rgb(128, 255, 128, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(128, 255, 128, 0.8)'
    }
  ];

  // Variable que permite habiliar las leyendas en el gráfico.

  public lineChartLegend:boolean = true;

  // Variable que sirve para definir el tipo de gráfico que se va a dibujar.

  public lineChartType:string='line';


  multiPolyLineOptions = {color:'red'};

  map:any;

  latlang:any;


  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  /*
    En el constructor se obtiene el número de rut del brigadista a través de la ruta,
    además cargo del usuario actual. Por otro lado, se declaran variables que serán útiles para realizar
    consultas a la base de datos a través del server (HttpClient) y para obtener los valores de la ruta.
    También, se inicializan los colores del gráfico.
  */

  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');



    this.rut=this.rutaActiva.snapshot.paramMap.get('rut');

    this.lineChartColors[0].borderColor = 'black';
    this.lineChartColors[0].backgroundColor = `rgba(255, 255, 255, 0.3)`;

    this.lineChartColors[1].borderColor = 'red';
    this.lineChartColors[1].backgroundColor = `rgba(255, 255, 255, 0.3)`;

    this.lineChartColors[2].borderColor = 'blue';
    this.lineChartColors[2].backgroundColor = `rgba(255, 255, 255, 0.3)`;
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
   document.getElementById("defaultOpen").click();

    //Método que obtiene el dato actual del brigadista.

    this.datoActual$ = await this.getDatoActual();
    //Método que obtiene hasta las ultimas 20 posiciones del brigadista.



    this.ultimasPosiciones$ = await this.getUltimasPosiciones();

    //Método que obtiene información de la brigada a la que pertenece el brigadista y su combate asociado.

    this.combatesbrigadadabrig$ = await this.getCombatesBrigadaBrig();


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


    console.log(dateObj);
    console.log(dateObj2);
    var dif = dateObj2.getTime() - dateObj.getTime();
    console.log(dif);
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

    // Variable que almacena el número de posiciones que se pueden obtener del brigadista.

    let tam = this.ultimasPosiciones$.length;

    // Aquí se cambia el color del marcador de acuerdo a la fatiga.



    // Se almacenan las ultimas posiciones del brigadista para poder trazar la ruta.

    for(let i=0; i<tam;i++){
      this.ultimasPosicionesfinal$[this.k] = this.ultimasPosiciones$[tam - 1 - i];
      this.k++;

      this.latlang[i] = [this.ultimasPosiciones$[tam - 1 - i].latidud, this.ultimasPosiciones$[tam - 1 - i].longitud]
    }
    console.log(this.latlang)
    var multipolyline = L.polyline(this.latlang,this.multiPolyLineOptions);
    console.log(multipolyline)

    multipolyline.addTo(this.map)

    // Método que obtiene las ultimas pulsaciones para poder graficarlas.

   this.getUltimasPulsaciones();

    // Método que obtiene las ultimas temperaturas ambientales para poder graficarlas.

   this.getUltimasTemperaturasAmbientales();

    // Método que obtiene las ultimas temperaturas corporales para poder graficarlas.

    this.getUltimasTemperaturasCorporales();

    // Método que obtiene las ultimas fechas y horas para poder graficarlas.

    this.getUltimasFechasYHoras();

    // Método que obtiene las ultimas saturaciones para poder graficarlas.

    this.getUltimasSaturaciones();





  }

   // Método que permite que el usuario pueda acceder a las diferentes opciones del menú (Datos, Gráficos y Mapa).

  async ngAfterViewInit(){


    this.datoActual$ = await this.getDatoActual();
    console.log(this.datoActual$)
    this.map = L.map('map', {
      center: [ this.datoActual$[0].latidud,this.datoActual$[0].longitud ],
      zoom: 16
    });
    const tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 50,
      subdomains:['mt0','mt1','mt2','mt3']
  });

    tiles.addTo(this.map);

    console.log(this.map);

    console.log()

    //L.prototype.options.icon = marcadorVerde;



    await this.addRoutes();


   }


  async addRoutes(){
    //let tam = this.datoActual$.data;
    console.log(this.datoActual$[0].fatigado)
    /*for(let i = 0; i<tam;i++){
      console.log(this.datoActual$.fatigado)
    }*/

    if(this.datoActual$[0].fatigado==0){
      L.marker([this.datoActual$[0].latidud, this.datoActual$[0].longitud], {icon: marcadorVerde}).addTo(this.map);
      console.log(this.datoActual$[0].latidud, this.datoActual$[0].longitud)
      console.log( L.marker([this.datoActual$[0].latidud, this.datoActual$[0].longitud], {icon: marcadorVerde}));
    }else if(this.datoActual$[0].fatigado==1){

      L.marker([this.datoActual$[0].latidud, this.datoActual$[0].longitud], {icon: marcadorAmarillo}).addTo(this.map);
    }else{
      console.log(this.datoActual$)
      L.marker([this.datoActual$[0].latidud, this.datoActual$[0].longitud], {icon: marcadorRojo}).addTo(this.map);
    }

    return;

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

      console.log("horas : " + this.datos1.horas);
      console.log("horas : " + this.datos1.minutos);
      console.log("horas : " + this.datos1.segundos);

}

  async getDatoActual(){
    this.datoActual2$ = await this.http.get('http://3.13.114.248:8000/datosestadoactualbrigadistas/'+this.rut).toPromise();


   return this.datoActual2$.data;

  }

  async getCombatesBrigadaBrig(){
    return await this.http.get('http://3.13.114.248:8000/combatesbrigadabrig/'+this.rut).toPromise();
  }


  async getUltimasPosiciones(){
   this.ultimasPosiciones2$ = await this.http.get('http://3.13.114.248:8000/ultimasPosiciones/'+this.rut).toPromise();


   return this.ultimasPosiciones2$.data;

  }

  // Algo que destacar de este método, es que añade las pulsaciones en la gráfica.

  async getUltimasPulsaciones(){
    this.ultimasPulsaciones$ = await this.http.get('http://3.13.114.248:8000/ultimaspulsaciones/'+this.rut).toPromise();
    let tam = this.ultimasPulsaciones$.data.length;
    let tam2 = this.ultimasPulsaciones$.data.length;

    for (let j = 0; j < tam2; j++) {
      this.lineChartData[0].data[j] = this.ultimasPulsaciones$.data[tam-1].pulsaciones;

      tam--;
    }
    this.chart.update();

  }

  // Algo que destacar de este método, es que añade las temperaturas ambientales en la gráfica.

  async getUltimasTemperaturasAmbientales(){
    this.ultimasTemperaturasAmbientales$ = await this.http.get('http://3.13.114.248:8000/ultimastemperaturasambientales/'+this.rut).toPromise();

    let tam = this.ultimasTemperaturasAmbientales$.data.length;
    let tam2 = this.ultimasTemperaturasAmbientales$.data.length;
    for (let j = 0; j < tam2; j++) {
      this.lineChartData[1].data[j] = this.ultimasTemperaturasAmbientales$.data[tam-1].t_ambiental;
      tam--;
    }
    this.chart.update();

  }

  // Algo que destacar de este método, es que añade las temperaturas corporales en la gráfica.

  async getUltimasTemperaturasCorporales(){
    this.ultimasTemperaturasCorporales$ = await this.http.get('http://3.13.114.248:8000/ultimastemperaturascorporales/'+this.rut).toPromise();

    let tam = this.ultimasTemperaturasCorporales$.data.length;
    let tam2 = this.ultimasTemperaturasCorporales$.data.length;
    for (let j = 0; j < tam2; j++) {
      this.lineChartData[2].data[j] = this.ultimasTemperaturasCorporales$.data[tam-1].t_corporal;
      tam--;
    }
    this.chart.update();

  }

  async getUltimasSaturaciones(){
    this.ultimasSaturaciones$ = await this.http.get('http://3.13.114.248:8000/ultimassaturaciones/'+this.rut).toPromise();

    let tam = this.ultimasSaturaciones$.data.length;
    let tam2 = this.ultimasSaturaciones$.data.length;
    for (let j = 0; j < tam2; j++) {
      this.lineChartData[3].data[j] = this.ultimasSaturaciones$.data[tam-1].saturacion;
      tam--;
    }
    this.chart.update();
  }

  // Algo que destacar de este método, es que añade las fechas y horas en la gráfica.


  async getUltimasFechasYHoras(){
    this.ultimasFechasYHoras$ = await this.http.get('http://3.13.114.248:8000/ultimasfechasyhoras/'+this.rut).toPromise();
    let tam = this.ultimasFechasYHoras$.data.length;
    for(let i=0;i<this.ultimasFechasYHoras$.data.length;i++){
      this.lineChartLabels[i] = this.ultimasFechasYHoras$.data[tam-1].fecha +"-" + this.ultimasFechasYHoras$.data[tam-1].hora;
      tam--;
    }


  }


}