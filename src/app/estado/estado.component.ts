import { Component, OnInit ,ViewChild, ViewChildren, QueryList, ElementRef,AfterViewInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { ChartType, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as Chart from 'chart.js';
import { map, catchError } from 'rxjs/operators';
import { from,  throwError } from 'rxjs';


@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})

export class EstadoComponent implements OnInit {
  usuarios$: any = [];
  nbrigadas$: any = [];
  datosEstado$: any = [];
  estadoBrig$: any = [];
  fatigaBaja$: any = [];
  fatigaMedia$: any = [];
  fatigaAlta$: any = [];
  charts: any;   
  array = [];
  brigadas:any = [];
  n:any;
  bajos$: any =[];
  medios$: any =[];
  altos$: any=[] ;
  cargo:any;
  rut_jefe:any;
  @ViewChildren('mycharts') allMyCanvas: any; 
  @ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;
  constructor(private http: HttpClient,private elementRef: ElementRef) {
    this.charts=[];
    this.cargo=localStorage.getItem('cargo');
    this.rut_jefe=localStorage.getItem('user');
  }
  

  ngAfterViewInit() {
    let canvasCharts = this.allMyCanvas._results;  // Get array with all canvas
    canvasCharts.map((myCanvas, i) => {   // For each canvas, save the chart on the charts array 
       this.charts[i].chart = new Chart(myCanvas.nativeElement.getContext('2d'), {
        
       })
    })
  }
  
  
    
  
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  
  
 
  

  
  
  async ngOnInit() {
    
    //this.getUsuarios();
    this.n=await this.getnBrigadas();

    for(let i=0;i<this.n;i++){
      this.charts[i] = [
        {
          "id": i,   // Just an identifier
          "chart": []            // The chart itself is going to be saved here
        }
      ]
    }
    
    this.brigadas=await this.getDatosEstado();
    console.log("holaaaaaa "+this.brigadas[0])
    this.bajos$=await this.getnFatigadosBajo();
    console.log(this.bajos$)
    this.medios$=await this.getnFatigadosMedio();
    console.log(this.medios$)
    this.altos$=await this.getnFatigadosAlto();
    console.log(this.altos$)
    
    //setTimeout(location.reload(),5000);
    //console.log(this.datosEstado$[0].fecha);
    /*setTimeout(function(){
      window.location.reload();
    }, 5000);*/

    //this.setDatosRandom();
    this.createChartsData()
   
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  async getnBrigadas(){
    this.nbrigadas$= await this.http.get('http://localhost:8000/nbrigadas').toPromise();
    
    return this.nbrigadas$.data[0].numero;
  }

  

  async getDatosEstado() {
    this.estadoBrig$= await this.http.get('http://localhost:8000/estadoBrigadas').toPromise();
    return this.estadoBrig$.data;
    }
  
  createChartsData(){
   
        for (var i = 0; i < this.n; i++) {
         
            var pie = {
                type: 'pie',
                
                data: {
                    
                    labels: ['Riesgo Alto', 'Riesgo Medio', 'Riesgo Bajo'],
                    datasets: [{
                      
                        backgroundColor: ['rgba(255,0,0)', 'rgba(255,255,0)', 'rgba(0,255,0)'],
                        data: [this.altos$[i].fatigaAlta,this.medios$[i].fatigaMedia,this.bajos$[i].fatigaBaja]
                    }]
                },
                options: {
                  responsive: true,
                  legend: {
                    position: 'right',
                    labels: {
                      render: 'percentage',
                      fontColor: "white",
                      fontSize: 10
                  }
                  },
                  plugins: {
                    datalabels: {
                      formatter: (value, ctx) => {
                          let sum = 0;
                          let dataArr = ctx.chart.data.datasets[0].data;
                          dataArr.map(data => {
                              sum += data;
                          });
                          let percentage = (value*100 / sum).toFixed(2)+"%";
                          return percentage;
                      },
                      color: '#fff',
                  },
                    labels: {
                     
                      precision: 2
                    }
                  }
                }
            };
            console.log(pie)
            this.array.push(pie);
        }

        this.createCharts(this.array);
  }
  createCharts(pieData) {
      for (var j = 0; j < this.n; j++) {
        let canvasCharts = this.allMyCanvas._results;  // Get array with all canvas
        canvasCharts.map((myCanvas, j) => {   // For each canvas, save the chart on the charts array 
           this.charts[j].chart = new Chart(myCanvas.nativeElement.getContext('2d'), pieData[j]);
        })
         
      }
  }
  async getnFatigadosBajo(){
    this.fatigaBaja$= await this.http.get('http://localhost:8000/FatigaBajaBrigadas').toPromise();
    console.log(this.fatigaBaja$)
    
   
    
    this.chart.forEach((child) => {
      child.chart.update()
  });
    return this.fatigaBaja$.data
    
  }

  async getnFatigadosMedio(){
    this.fatigaMedia$ = await this.http.get('http://localhost:8000/FatigaMediaBrigadas').toPromise();
    console.log(this.fatigaMedia$)
   
    this.chart.forEach((child) => {
      child.chart.update()
  });
  return this.fatigaMedia$.data
  }

  async getnFatigadosAlto(){
    this.fatigaAlta$= await this.http.get('http://localhost:8000/FatigaAltaBrigadas').toPromise();
    console.log(this.fatigaAlta$)

    
    
      
    this.chart.forEach((child) => {
      child.chart.update()
  });
      
    return this.fatigaAlta$.data
  }


  setDatosRandom(){
    this.http.get('http://localhost:8000/datosRandom').subscribe(resp2 =>
    this.datosEstado$ = resp2 as []
    )
  }

  
    
    
  
  
  
}
