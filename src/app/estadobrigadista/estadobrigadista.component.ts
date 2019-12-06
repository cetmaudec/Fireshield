import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { ActivatedRoute, Params } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import {MatTabsModule} from '@angular/material/tabs';


@Component({
  selector: 'app-estadobrigadista',
  templateUrl: './estadobrigadista.component.html',
  styleUrls: ['./estadobrigadista.component.css']
})
export class EstadobrigadistaComponent implements OnInit {
  cargo:any;
  ultimasPulsaciones$: any = [];
  ultimasTemperaturasAmbientales$: any = [];
  ultimasTemperaturasCorporales$: any = [];
  ultimasFechasYHoras$: any = [];
  rut: any ;
  k = 0;
  datoActual$: any = [];
  datoActual2$: any = [];
  ultimasPosiciones$: any = [];
  ultimasPosiciones2$: any = [];
  ultimasPosicionesfinal$: any = [];
  origin = { lat: 0.000, lng: 0.000 };
  destination = { lat: 0.000, lng: 0.000 };
  iconAct : any;
  icon: any [];
  infoWindow : any;
  event: any;

 
  waypoints: any;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Pulsaciones' },
    { data: [], label: 'T° Ambiental' },
    { data: [], label: 'T° Corporal'}
  ];

  public lineChartLabels: Label[] = [];
 
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

  public lineChartLegend:boolean = true;
  public lineChartType:string='line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
 
  
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');

    this.icon = [];
    
   
    this.rut=this.rutaActiva.snapshot.paramMap.get('rut');

    this.lineChartColors[0].borderColor = 'black';
    this.lineChartColors[0].backgroundColor = `rgba(255, 255, 255, 0.3)`;

    this.lineChartColors[1].borderColor = 'red';
    this.lineChartColors[1].backgroundColor = `rgba(255, 255, 255, 0.3)`;

    this.lineChartColors[2].borderColor = 'blue';
    this.lineChartColors[2].backgroundColor = `rgba(255, 255, 255, 0.3)`;
  }

  async ngOnInit() {
    document.getElementById("defaultOpen").click();
    
    this.datoActual$ = await this.getDatoActual();
    console.log(this.datoActual$);
    this.ultimasPosiciones$ = await this.getUltimasPosiciones();
    let tam = this.ultimasPosiciones$.length;
    
    if(this.datoActual$.fatigado = 0){
      console.log("Verde");
      this.iconAct ='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }else if(this.datoActual$.fatigado = 1){
      console.log("Amarelo");
       
     
      this.iconAct ='http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }else if(this.datoActual$.fatigado = 2){
      console.log("Rojo");
      this.iconAct ='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }

    console.log(tam);

  
    for(let i=0; i<tam;i++){
      this.ultimasPosicionesfinal$[this.k] = this.ultimasPosiciones$[tam - 1 - i];
      this.k++;
     this.icon[i] = {
        url: 'http://maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png'
      };
    }

  
    this.getUltimasPulsaciones();
    this.getUltimasTemperaturasAmbientales();
    this.getUltimasTemperaturasCorporales();
    this.getUltimasFechasYHoras();
  }


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


  async getUltimasPulsaciones(){
    this.ultimasPulsaciones$ = await this.http.get('http://localhost:8000/ultimaspulsaciones/'+this.rut).toPromise();
    let tam = this.ultimasPulsaciones$.data.length;
    let tam2 = this.ultimasPulsaciones$.data.length;


    console.log(this.ultimasPulsaciones$);

    for (let j = 0; j < tam2; j++) {
     console.log("Entroo");
      this.lineChartData[0].data[j] = this.ultimasPulsaciones$.data[tam-1].pulsaciones;

      tam--;
    }

    console.log(this.lineChartData[0].data);
    this.chart.update();
    
  }

  async getUltimasTemperaturasAmbientales(){
    this.ultimasTemperaturasAmbientales$ = await this.http.get('http://localhost:8000/ultimastemperaturasambientales/'+this.rut).toPromise();

    let tam = this.ultimasTemperaturasAmbientales$.data.length;
    let tam2 = this.ultimasTemperaturasAmbientales$.data.length;
    console.log(this.ultimasTemperaturasAmbientales$);
    for (let j = 0; j < tam2; j++) {
      this.lineChartData[1].data[j] = this.ultimasTemperaturasAmbientales$.data[tam-1].t_ambiental;
      tam--;
    }
    this.chart.update();
    
  }

  async getUltimasTemperaturasCorporales(){
    this.ultimasTemperaturasCorporales$ = await this.http.get('http://localhost:8000/ultimastemperaturascorporales/'+this.rut).toPromise();

    let tam = this.ultimasTemperaturasCorporales$.data.length;
    let tam2 = this.ultimasTemperaturasCorporales$.data.length;
    console.log(this.ultimasTemperaturasCorporales$);
    for (let j = 0; j < tam2; j++) {
      this.lineChartData[2].data[j] = this.ultimasTemperaturasCorporales$.data[tam-1].t_corporal;
      tam--;
    }
    this.chart.update();
    
  }

  
  async getUltimasFechasYHoras(){
    this.ultimasFechasYHoras$ = await this.http.get('http://localhost:8000/ultimasfechasyhoras/'+this.rut).toPromise();
    let tam = this.ultimasFechasYHoras$.data.length;
    for(let i=0;i<this.ultimasFechasYHoras$.data.length;i++){
      this.lineChartLabels[i] = this.ultimasFechasYHoras$.data[tam-1].fecha +"-" + this.ultimasFechasYHoras$.data[tam-1].hora;
      tam--;
    }

    //lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

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