import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})

export class EstadoComponent implements OnInit {

  @ViewChildren('mycharts') allMyCanvas: any; 
  @ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;

  /*
    Variables utilizadas para poder desplegar información respecto al estado actual de las brigadas que se encuentran
    combatiendo. Como se despliegan gráficos, se añadieron variables que almacenan datos importantes para poder desplegar
    esto correctamente.
  */

  // Variable utilizara para retornar el número de brigadas que actualmente están en combate.

  nbrigadas$: any = [];

  // Variable que almacena el número de brigadas que actualmente están en combate.

  n: any;

  

  datosEstado$: any = [];

  /* 
    Variable que retorna la información relacionada a las brigadas que están peleando actualmente en algun combate. Además,
    de los ruts de sus jefes de brigada.
  */

  estadoBrig$: any = [];

  /* 
    Variable que almacena la información relacionada a las brigadas que están peleando actualmente en algun combate. Además,
    de los ruts de sus jefes de brigada.
  */

  brigadas:any = [];

  // Variable que retorna el número de brigadistas que actualmente se encuentran con fatiga baja por cada brigada.

  fatigaBaja$: any = [];

  // Variable que retorna el número de brigadistas que actualmente se encuentran con fatiga media por cada brigada.

  fatigaMedia$: any = [];

  // Variable que retorna el número de brigadistas que actualmente se encuentran con fatiga alta por cada brigada.

  fatigaAlta$: any = [];

  // Variable que sirve para crear cada uno de los gráficos, con sus distintas caracteristicas.

  charts: any;   

  // Arreglo que servirá para almacenar cada uno de los gráficos que se vayan creando.

  array = [];

  // Variable que almacena el número de brigadistas que actualmente se encuentran con fatiga baja por cada brigada.
  
  bajos$: any =[];

  // Variable que almacena el número de brigadistas que actualmente se encuentran con fatiga media por cada brigada.

  medios$: any =[];

  // Variable que almacena el número de brigadistas que actualmente se encuentran con fatiga alta por cada brigada.

  altos$: any=[];

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  /*
    Variable que almacena el rut que posee el actual usuario que está en la sesión actual. Esto sirve para que si
    el usuario es un jefe de brigada, solo pueda ver las brigadas que tiene bajo su cargo.
  */

  rut_jefe:any;

  // Variable que habilita las leyendas en los gráficos.
  
  public pieChartLegend = true;

  // Variable que habilita como plugin de los gráficos solo a los labels.

  public pieChartPlugins = [pluginDataLabels];

  /*
    En el constructor obtiene el cargo y el rut del usuario actual. Por otro lado, se declara una variable que 
    será útil para realizar consultas a la base de datos a través del server (HttpClient).
  */
 
 
  constructor(private http: HttpClient) {
    this.charts=[];
    this.cargo=localStorage.getItem('cargo');
    this.rut_jefe=localStorage.getItem('user');
  }
  
  /*
    Método que obtiene el arreglo con todos los canvas, y luego para todos los canvas almacena cada gráfico en
    el arreglo de gráficos.
  */

  ngAfterViewInit() {
    let canvasCharts = this.allMyCanvas._results;  
    canvasCharts.map((myCanvas, i) => { 
       this.charts[i].chart = new Chart(myCanvas.nativeElement.getContext('2d'), {
        
       })
    })
  }

  /*
    En el OnInit se llaman los métodos necesarios para que se muestren correctamente todos los gráficos
    asociados a cada una de las brigadas que actualmente están en combate. Para realizar esto, es necesario obtener
    el número de brigadistas que se encuentran con una fatiga alta, media y baja por cada brigada. Además, de la creación
    de cada uno de los gráficos.
  */ 

  async ngOnInit() {
    
    // Método que calcula el número de brigadas que actualmente están en combate.

    this.n = await this.getnBrigadas();

    /*
      Creación de cada uno de las n gráficas que se van a mostrar. Cada uno de estos gráficos se almacena en una posición
      del arreglo de gráficos.
    */

    for(let i=0;i<this.n;i++){
      this.charts[i] = [
        {
          "id": i,   // Just an identifier
          "chart": []            // The chart itself is going to be saved here
        }
      ]
    }

    /*
      Método que obtiene la información relacionada a las brigadas que están peleando actualmente en algun combate. Además,
      de los ruts de sus jefes de brigada.
    */
    
    this.brigadas=await this.getDatosEstado();

    //Método que obtiene el número de brigadistas que se encuentran actualmente en fatiga baja por cada una de las brigadas.

    this.bajos$=await this.getnFatigadosBajo();

    //Método que obtiene el número de brigadistas que se encuentran actualmente en fatiga media por cada una de las brigadas.

    this.medios$=await this.getnFatigadosMedio();

    //Método que obtiene el número de brigadistas que se encuentran actualmente en fatiga alta por cada una de las brigadas.

    this.altos$=await this.getnFatigadosAlto();

   // this.setDatosRandom();

    // Método que crea cada uno de los gráficos con sus datos correspondientes.

    this.createChartsData()
   
  }



  async getnBrigadas(){
    this.nbrigadas$= await this.http.get('http://localhost:8000/nbrigadas').toPromise();
    return this.nbrigadas$.data[0].numero;
  }

  

  async getDatosEstado() {
    this.estadoBrig$= await this.http.get('http://localhost:8000/estadoBrigadas').toPromise();

    return this.estadoBrig$.data;
  
  }

  async getnFatigadosBajo(){
    this.fatigaBaja$= await this.http.get('http://localhost:8000/FatigaBajaBrigadas').toPromise();

    
   
    
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

  /*
    Este método define cada uno de los gráficos con las mismas opciones. Estas opciones están relacionadas con los colores
    tamaño de la letra, el tipo de gráfico, las etiquetas, los datos de cada gráfica, y otras opciones.
  */
  
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

  // Método que crea un gráfico y lo almacena en el arreglo de gráficos.

  createCharts(pieData) {
      for (var j = 0; j < this.n; j++) {
        let canvasCharts = this.allMyCanvas._results;  // Get array with all canvas
        canvasCharts.map((myCanvas, j) => {   // For each canvas, save the chart on the charts array 
           this.charts[j].chart = new Chart(myCanvas.nativeElement.getContext('2d'), pieData[j]);
        })
         
      }
  }


  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  
    
    
  
  
  
}
