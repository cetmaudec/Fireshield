import { Component, AfterViewInit, OnInit, ViewChild  } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as L from 'leaflet';
import { environment } from '../environment';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

 	intervalUpdate: any = null;
 	
	chartRealtime: any = null;
  last_time: any; 

  pulsaciones:any = [];
  saturacion:any =[]
  t_corporal: any = [];
  t_ambiental: any = [];
  time: any = [];

  AllData:any= [];
  LastData:any= [];

  rut:any = [];

  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.rut=this.rutaActiva.snapshot.paramMap.get('rut');
  }

	async ngOnInit() {
    this.AllData = await this.getData();
    this.last_time = this.AllData.data[0].hora;
    for(let data of this.AllData.data){
      this.pulsaciones.push(data.pulsaciones);
      this.saturacion.push(data.saturacion);
      this.t_corporal.push(data.t_corporal);
      this.t_ambiental.push(data.t_ambiental);
      this.time.push(data.hora);
    }
    this.pulsaciones.reverse();
    this.saturacion.reverse();
    this.t_corporal.reverse();
    this.t_ambiental.reverse();
    this.time.reverse();

	  this.intervalUpdate = setInterval(function(){
	    this.showData();
	  }.bind(this), 10000);

	  this.chartRealtime = new Chart('realtime', {
   		type: 'line',
   		data: {
   		 	labels: this.time,
   		 	datasets: [
   		 	{
    	    	label: 'Pulsaciones',
        		data: this.pulsaciones,
        		fill: false,
        		backgroundColor: 'rgba(177, 223, 171,0.2)',
      			borderColor: 'rgb(102, 194, 165)'

      		},
      		{
    	    	label: 'Saturación',
        		data: this.saturacion,
        		fill: false,
        		backgroundColor: 'rgb(46, 133, 186, 0.3)',
      			borderColor: 'rgb(46, 133, 186)'

      		},
      		{
    	    	label: 'T° Ambiental',
        		data: this.t_ambiental,
        		fill: false,
        		backgroundColor: 'rgba(223, 72, 75,0.2)',
      			borderColor: 'rgb(223, 72, 75)'

      		},
      		{
    	    	label: 'T° Corporal',
        		data: this.t_corporal,
        		fill: false,
        		backgroundColor: 'rgba(252, 174, 97,0.3)',
      			borderColor: 'rgb(252, 174, 97)'

      		}
   		 ]
   		},
   		options: {
        responsive: true,
        legend: {
          labels: {
            fontColor: "black"
          }
        }, 
        scales: {
          xAxes: [{
            ticks: {
              fontColor: 'black',
              autoSkip: true,
              maxTicksLimit: 5
            },
            gridLines: {
              color: 'rgba(255,255,255,0.3)',
            },
          }],
          yAxes: [{
            id: 'y-axis-0',
            position: 'left',
            gridLines: {
              color: 'rgba(255,255,255,0.3)',
            },
            ticks: {
              fontColor: 'black',
            }
          }]
        },
      }
    });
  }


 	/**
 	* Print the data to the chart
 	* @function showData
 	* @return {void}
 	*/
 	async showData(){
    this.LastData = await this.getLastData();
    if(this.LastData.data[0].hora!=this.last_time){
      for(let data of this.LastData.data){
        this.pulsaciones.push(data.pulsaciones);
        this.saturacion.push(data.saturacion);
        this.t_corporal.push(data.t_corporal);
        this.t_ambiental.push(data.t_ambiental);
        this.time.push(data.hora);
        this.chartRealtime.update();
      }
    }
 	}

	 	/**
	 * On component destroy
	 * @function ngOnDestroy
	 * @return {void}
	 */
	 ngOnDestroy() {
	  clearInterval(this.intervalUpdate);
	 }


  async getData(){
    this.AllData = await this.http.get(environment.urlAddress+'select/data/'+this.rut).toPromise();
    return this.AllData;
  }

  async getLastData(){
    this.LastData = await this.http.get(environment.urlAddress+'select/data/last/'+this.rut).toPromise();
    return this.LastData;
  }

}
