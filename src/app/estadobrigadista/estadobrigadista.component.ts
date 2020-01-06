import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadobrigadista',
  templateUrl: './estadobrigadista.component.html',
  styleUrls: ['./estadobrigadista.component.css']
})

export class EstadobrigadistaComponent implements OnInit {

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

  // Variable que sirve para etiquetar cada uno de los datos que serán desplegados en la gráfica del brigadista.

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Pulsaciones' },
    { data: [], label: 'T° Ambiental' },
    { data: [], label: 'T° Corporal'}
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
    }
  ];

  // Variable que permite habiliar las leyendas en el gráfico.

  public lineChartLegend:boolean = true;

  // Variable que sirve para definir el tipo de gráfico que se va a dibujar.

  public lineChartType:string='line';

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
    
    // Variable que almacena el número de posiciones que se pueden obtener del brigadista.

    let tam = this.ultimasPosiciones$.length;
    
    // Aquí se cambia el color del marcador de acuerdo a la fatiga.

    if(this.datoActual$.fatigado = 0){
      
      this.iconAct ='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }else if(this.datoActual$.fatigado = 1){
     
      this.iconAct ='http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }else if(this.datoActual$.fatigado = 2){
      
      this.iconAct ='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }

    // Se almacenan las ultimas posiciones del brigadista para poder trazar la ruta.
  
    for(let i=0; i<tam;i++){
      this.ultimasPosicionesfinal$[this.k] = this.ultimasPosiciones$[tam - 1 - i];
      this.k++;
    
    }

    // Método que obtiene las ultimas pulsaciones para poder graficarlas.

    this.getUltimasPulsaciones();

    // Método que obtiene las ultimas temperaturas ambientales para poder graficarlas.

    this.getUltimasTemperaturasAmbientales();

    // Método que obtiene las ultimas temperaturas corporales para poder graficarlas.

    this.getUltimasTemperaturasCorporales();

    // Método que obtiene las ultimas fechas y horas para poder graficarlas.

    this.getUltimasFechasYHoras();
  }

   // Método que permite que el usuario pueda acceder a las diferentes opciones del menú (Datos, Gráficos y Mapa).


   openCity(evt, cityName) {
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
    this.datoActual2$ = await this.http.get('http://localhost:8000/datosestadoactualbrigadistas/'+this.rut).toPromise();
   return this.datoActual2$.data;

  }


  async getUltimasPosiciones(){
   this.ultimasPosiciones2$ = await this.http.get('http://localhost:8000/ultimasPosiciones/'+this.rut).toPromise();
   return this.ultimasPosiciones2$.data;  

  }

  // Algo que destacar de este método, es que añade las pulsaciones en la gráfica.

  async getUltimasPulsaciones(){
    this.ultimasPulsaciones$ = await this.http.get('http://localhost:8000/ultimaspulsaciones/'+this.rut).toPromise();
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
    this.ultimasTemperaturasAmbientales$ = await this.http.get('http://localhost:8000/ultimastemperaturasambientales/'+this.rut).toPromise();

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
    this.ultimasTemperaturasCorporales$ = await this.http.get('http://localhost:8000/ultimastemperaturascorporales/'+this.rut).toPromise();

    let tam = this.ultimasTemperaturasCorporales$.data.length;
    let tam2 = this.ultimasTemperaturasCorporales$.data.length;
    for (let j = 0; j < tam2; j++) {
      this.lineChartData[2].data[j] = this.ultimasTemperaturasCorporales$.data[tam-1].t_corporal;
      tam--;
    }
    this.chart.update();
    
  }

  // Algo que destacar de este método, es que añade las fechas y horas en la gráfica.

  
  async getUltimasFechasYHoras(){
    this.ultimasFechasYHoras$ = await this.http.get('http://localhost:8000/ultimasfechasyhoras/'+this.rut).toPromise();
    let tam = this.ultimasFechasYHoras$.data.length;
    for(let i=0;i<this.ultimasFechasYHoras$.data.length;i++){
      this.lineChartLabels[i] = this.ultimasFechasYHoras$.data[tam-1].fecha +"-" + this.ultimasFechasYHoras$.data[tam-1].hora;
      tam--;
    }


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