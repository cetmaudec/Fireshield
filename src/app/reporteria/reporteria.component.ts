import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import {Router} from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import swal from'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-reporteria',
  templateUrl: './reporteria.component.html',
  styleUrls: ['./reporteria.component.css']
})
export class ReporteriaComponent implements OnInit {
  eleccion$ :any;
  eleccion2$ :any;
  combactivos$: any = [];
  combmes$: any = [];
  comb6mes$: any = [];
  combanyo$: any = [];
  combtodos$: any = [];

  combmes2$: any = [];
  comb6mes2$: any = [];
  combanyo2$: any = [];
  combtodos2$: any = [];

  combmes2fin$: any = [];
  comb6mes2fin$: any = [];
  combanyo2fin$: any = [];
  combtodos2fin$: any = [];

  tiempo:any=[];
  tiempo2:any=[];
  tiempo3:any=[];
  datos1 = { dias: 0, horas: 0, minutos:0 };

  datos2 = { i: 0, dias: 0, horas: 0, minutos:0 };
  tiempodatos2:any=[];
  tiempo2datos2:any=[];
  tiempo3datos2:any=[];


  existe:any=[];

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.eleccion$='Activos';
    this.eleccion2$='Último Mes2';
    this.tiempo=[];
    this.tiempo2=[];
    this.tiempo3=[];
    this.tiempodatos2=[];
    this.tiempo2datos2=[];
    this.tiempo3datos2=[];
    pdfMake.vfs = pdfFonts.pdfMake.vfs; 
  }

  ngOnInit() {
    document.getElementById("defaultOpen").click();
    this.getCombActivos();
    this.getCombMes2();
    
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
  onChange(deviceValue) {
    console.log(deviceValue);
    if(deviceValue ==='Activos'){
      this.eleccion$='Activos';
      console.log(deviceValue);
      this.getCombActivos();
    }else if (deviceValue ==='Último Mes'){
      this.eleccion$='Último Mes';
      this.getCombMes();
    }else if (deviceValue ==='Últimos 6 Meses'){
      this.eleccion$='Últimos 6 Meses';
      this.getComb6Mes();
    }else if (deviceValue ==='Último Año'){
      this.eleccion$='Último Año';
      console.log(this.eleccion$)
      this.getCombAnyo();
    }else if (deviceValue ==='Todos'){
      this.eleccion$='Todos';
      this.getCombTodos();
    }else if (deviceValue ==='Último Mes2'){
      this.eleccion2$='Último Mes2';
      this.getCombMes2();
    }else if (deviceValue ==='Últimos 6 Meses2'){
      this.eleccion2$='Últimos 6 Meses2';
      this.getComb6Mes2();
    }else if (deviceValue ==='Último Año2'){
      this.eleccion2$='Último Año2';
      this.getCombAnyo2();
    }else if (deviceValue ==='Todos2'){
      this.eleccion2$='Todos2';
      this.getCombTodos2();
    }
  
  }

  async getCombActivos(){
    this.combactivos$= await this.http.get('http://localhost:8000/combActivos').toPromise();
    //console.log(this.combactivos$.data);
   
  }

  dhm(t){


    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
      if( m === 60 ){
        h++;
        m = 0;
      }
      if( h === 24 ){
        d++;
        h = 0;
      }

      

      this.datos1.dias = d;
      this.datos1.horas = pad(h);
      this.datos1.minutos = pad(m);

}

  dhm2(t){

    var cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    d = Math.floor(t / cd),
    h = Math.floor( (t - d * cd) / ch),
    m = Math.round( (t - d * cd - h * ch) / 60000),
    pad = function(n){ return n < 10 ? n : n; };
      if( m === 60 ){
      h++;
      m = 0;
      }
      if( h === 24 ){
      d++;
      h = 0;
      }



      this.datos1.dias = d;
      this.datos1.horas = pad(h);
      this.datos1.minutos = pad(m);



  }

  
  async getTiempo(combates :any){

    //console.log("holiiiiiii")
    
    var tam = combates.data.length;

    for(let i=0;i<tam;i++){
      let dateString1=combates.data[i].fecha + ' ' + combates.data[i].hora;
      let dateString2=combates.data[i].fechafin + ' ' + combates.data[i].horafin;

      let date=dateString1.split(' ');

      var anyo = Number(date[0].split('-')[0]);
      var mes = Number(date[0].split('-')[1]);
      var dia = Number(date[0].split('-')[2]);
      var hora = Number(date[1].split(':')[0]);
      var minuto = Number(date[1].split(':')[1]);
      var segundo = Number(date[1].split(':')[2]);

      var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);


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
      this.tiempo[i] = this.datos1.dias;
      this.tiempo2[i] = this.datos1.horas;
      this.tiempo3[i] = this.datos1.minutos;

    }
  }


  async getCombMes(){
    this.combmes$= await this.http.get('http://localhost:8000/combMes').toPromise();


    this.getTiempo(this.combmes$);

    

  }
  async getComb6Mes(){
    this.comb6mes$= await this.http.get('http://localhost:8000/comb6Mes').toPromise();

    this.getTiempo(this.comb6mes$);
   
  }

  async getCombAnyo(){
    this.combanyo$= await this.http.get('http://localhost:8000/combAnyo').toPromise();

    this.getTiempo(this.combanyo$);
   
  }

  async getCombTodos(){
    this.combtodos$= await this.http.get('http://localhost:8000/combTodos').toPromise();
    this.getTiempo(this.combtodos$);
   
  }

  async calcularTiempo(nombre_brigada, n_brigada, k, combate){

    var datos2 = { i: 0, dias: 0, horas: 0, minutos:0 };

    let i = k;

    let diasAcum = 0;
    let horasAcum = 0;
    let minutosAcum = 0;

    

    while(i<combate.data.length && combate.data[i].nombre_brigada == nombre_brigada && combate.data[i].n_brigada == n_brigada ){
      this.datos1.dias = 0;
      this.datos1.horas = 0;
      this.datos1.minutos = 0;

      let dateString1=combate.data[i].fecha + ' ' + combate.data[i].hora;
      let dateString2=combate.data[i].fechafin + ' ' + combate.data[i].horafin;

      let date=dateString1.split(' ');

      var anyo = Number(date[0].split('-')[0]);
      var mes = Number(date[0].split('-')[1]);
      var dia = Number(date[0].split('-')[2]);
      var hora = Number(date[1].split(':')[0]);
      var minuto = Number(date[1].split(':')[1]);
      var segundo = Number(date[1].split(':')[2]);

      var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);

      let date2=dateString2.split(' ');
      var anyo2 = Number(date2[0].split('-')[0]);
      var mes2 = Number(date2[0].split('-')[1]);
      var dia2 = Number(date2[0].split('-')[2]);
      var hora2 = Number(date2[1].split(':')[0]);
      var minuto2 = Number(date2[1].split(':')[1]);
      var segundo2 = Number(date2[1].split(':')[2]);

      

      var dateObj2=new Date(anyo2,mes2-1,dia2,hora2,minuto2,segundo2);

      var dif = dateObj2.getTime() - dateObj.getTime(); 

      console.log("Diferencia : "+dif);

      this.dhm2(dif);
      console.log(this.datos1.dias);
      console.log(this.datos1.horas);
      console.log(this.datos1.minutos);

      

      diasAcum = diasAcum + this.datos1.dias;
      horasAcum = horasAcum + this.datos1.horas;
      minutosAcum = minutosAcum + this.datos1.minutos;
      
      i++;

    }

    console.log("dias: " + diasAcum);
    console.log("horas: " + horasAcum);
    console.log("minutos: "+ minutosAcum);

    datos2.i = i;
    datos2.dias = diasAcum;
    datos2.horas = horasAcum;
    datos2.minutos = minutosAcum;

    return datos2;
    

  }


  async getCombMes2(){
    this.combmes2$= await this.http.get('http://localhost:8000/combMes2').toPromise();
    this.combmes2fin$ = await this.http.get('http://localhost:8000/combFin').toPromise();

    let tam = this.combmes2$.data.length;

    let k = 0;
    let time;

    for(let i = 0; i<tam;i++){
      time = 0;
      this.datos2 = await this.calcularTiempo(this.combmes2$.data[i].nombre_brigada, this.combmes2$.data[i].n_brigada, k, this.combmes2fin$);
      k = this.datos2.i;
      let params = new HttpParams().set("n_brigada", this.combmes2$.data[i].n_brigada).set("nombre",this.combmes2$.data[i].nombre_brigada);
      
      this.existe = await this.http.get('http://localhost:8000/existe',{headers: new HttpHeaders({
        'Content-Type':'application/json'
        }), params: params}).toPromise();

        console.log("condicion : "+ this.existe.data[0].cond);
        
        if(this.existe.data[0].cond == 1){
          console.log("condicion 1 ");
          this.tiempodatos2[i]=this.datos2.dias;
          this.tiempo2datos2[i]=this.datos2.horas;
          this.tiempo3datos2[i]=this.datos2.minutos;
        }else{
          console.log("condicion 0 ");
          let dateString1=this.combmes2$.data[i].fecha + ' ' + this.combmes2$.data[i].hora;

          let date=dateString1.split(' ');

          var anyo = Number(date[0].split('-')[0]);
          var mes = Number(date[0].split('-')[1]);
          var dia = Number(date[0].split('-')[2]);
          var hora = Number(date[1].split(':')[0]);
          var minuto = Number(date[1].split(':')[1]);
          var segundo = Number(date[1].split(':')[2]);

          var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);

          var fechaAct = new Date();


          var dif = fechaAct.getTime() - dateObj.getTime(); 

          console.log("Diferencia : "+dif);

          this.dhm(dif);
          this.tiempodatos2[i] = this.datos1.dias;
          this.tiempo2datos2[i] = this.datos1.horas;
          this.tiempo3datos2[i] = this.datos1.minutos;



        }
    }
    
    console.log(this.tiempodatos2);
    console.log(this.tiempo2datos2);
    console.log(this.tiempo3datos2);

  }
  async getComb6Mes2(){
    this.comb6mes2$= await this.http.get('http://localhost:8000/comb6Mes2').toPromise();

    this.comb6mes2fin$= await this.http.get('http://localhost:8000/combFin').toPromise();

    let tam = this.comb6mes2$.data.length;

    let k = 0;
    let time;

    for(let i = 0; i<tam;i++){
      time = 0;
      this.datos2 = await this.calcularTiempo(this.comb6mes2$.data[i].nombre_brigada, this.comb6mes2$.data[i].n_brigada, k, this.comb6mes2fin$);
      k = this.datos2.i;

      
      let params = new HttpParams().set("n_brigada", this.comb6mes2$.data[i].n_brigada).set("nombre",this.comb6mes2$.data[i].nombre_brigada);
      
      this.existe = await this.http.get('http://localhost:8000/existe',{headers: new HttpHeaders({
        'Content-Type':'application/json'
        }), params: params}).toPromise();

        console.log("condicion : "+ this.existe.data[0].cond);
        
        if(this.existe.data[0].cond == 1){
          console.log("condicion 1 ");
          this.tiempodatos2[i]=this.datos2.dias;
          this.tiempo2datos2[i]=this.datos2.horas;
          this.tiempo3datos2[i]=this.datos2.minutos;
        }else{
          console.log("condicion 0 ");
          let dateString1=this.comb6mes2$.data[i].fecha + ' ' + this.comb6mes2$.data[i].hora;

          let date=dateString1.split(' ');

          var anyo = Number(date[0].split('-')[0]);
          var mes = Number(date[0].split('-')[1]);
          var dia = Number(date[0].split('-')[2]);
          var hora = Number(date[1].split(':')[0]);
          var minuto = Number(date[1].split(':')[1]);
          var segundo = Number(date[1].split(':')[2]);

          var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);

          var fechaAct = new Date();


          var dif = fechaAct.getTime() - dateObj.getTime(); 

          console.log("Diferencia : "+dif);

          this.dhm(dif);
          this.tiempodatos2[i] = this.datos1.dias;
          this.tiempo2datos2[i] = this.datos1.horas;
          this.tiempo3datos2[i] = this.datos1.minutos;



        }
      
    }
    
    console.log(this.tiempodatos2);
    console.log(this.tiempo2datos2);
    console.log(this.tiempo3datos2);
   
  }

  async getCombAnyo2(){
    this.combanyo2$= await this.http.get('http://localhost:8000/combAnyo2').toPromise();

    
    this.combanyo2fin$= await this.http.get('http://localhost:8000/combFin').toPromise();

    let tam = this.combanyo2$.data.length;

    let k = 0;
    let time;

    for(let i = 0; i<tam;i++){
      time = 0;
      this.datos2 = await this.calcularTiempo(this.combanyo2$.data[i].nombre_brigada, this.combanyo2$.data[i].n_brigada, k, this.combanyo2fin$);
      k = this.datos2.i;
      let params = new HttpParams().set("n_brigada", this.combanyo2$.data[i].n_brigada).set("nombre",this.combanyo2$.data[i].nombre_brigada);
      
      this.existe = await this.http.get('http://localhost:8000/existe',{headers: new HttpHeaders({
        'Content-Type':'application/json'
        }), params: params}).toPromise();

        console.log("condicion : "+ this.existe.data[0].cond);
        
        if(this.existe.data[0].cond == 1){
          console.log("condicion 1 ");
          this.tiempodatos2[i]=this.datos2.dias;
          this.tiempo2datos2[i]=this.datos2.horas;
          this.tiempo3datos2[i]=this.datos2.minutos;
        }else{
          console.log("condicion 0 ");
          let dateString1=this.combanyo2$.data[i].fecha + ' ' + this.combanyo2$.data[i].hora;

          let date=dateString1.split(' ');

          var anyo = Number(date[0].split('-')[0]);
          var mes = Number(date[0].split('-')[1]);
          var dia = Number(date[0].split('-')[2]);
          var hora = Number(date[1].split(':')[0]);
          var minuto = Number(date[1].split(':')[1]);
          var segundo = Number(date[1].split(':')[2]);

          var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);

          var fechaAct = new Date();


          var dif = fechaAct.getTime() - dateObj.getTime(); 

          console.log("Diferencia : "+dif);

          this.dhm(dif);
          this.tiempodatos2[i] = this.datos1.dias;
          this.tiempo2datos2[i] = this.datos1.horas;
          this.tiempo3datos2[i] = this.datos1.minutos;



        }
    }
    
    console.log(this.tiempodatos2);
    console.log(this.tiempo2datos2);
    console.log(this.tiempo3datos2);
   
  }

  async getCombTodos2(){
    this.combtodos2$= await this.http.get('http://localhost:8000/combTodos2').toPromise();

    this.combtodos2fin$= await this.http.get('http://localhost:8000/combFin').toPromise();

    let tam = this.combtodos2$.data.length;

    let k = 0;
    let time;

    for(let i = 0; i<tam;i++){
      time = 0;
      this.datos2 = await this.calcularTiempo(this.combtodos2$.data[i].nombre_brigada, this.combtodos2$.data[i].n_brigada, k, this.combtodos2fin$);
      k = this.datos2.i;
      let params = new HttpParams().set("n_brigada", this.combtodos2$.data[i].n_brigada).set("nombre",this.combtodos2$.data[i].nombre_brigada);
      
      this.existe = await this.http.get('http://localhost:8000/existe',{headers: new HttpHeaders({
        'Content-Type':'application/json'
        }), params: params}).toPromise();

        console.log("condicion : "+ this.existe.data[0].cond);
        
        if(this.existe.data[0].cond == 1){
          console.log("condicion 1 ");
          this.tiempodatos2[i]=this.datos2.dias;
          this.tiempo2datos2[i]=this.datos2.horas;
          this.tiempo3datos2[i]=this.datos2.minutos;
        }else{
          console.log("condicion 0 ");
          let dateString1=this.combtodos2$.data[i].fecha + ' ' + this.combtodos2$.data[i].hora;

          let date=dateString1.split(' ');

          var anyo = Number(date[0].split('-')[0]);
          var mes = Number(date[0].split('-')[1]);
          var dia = Number(date[0].split('-')[2]);
          var hora = Number(date[1].split(':')[0]);
          var minuto = Number(date[1].split(':')[1]);
          var segundo = Number(date[1].split(':')[2]);

          var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);

          var fechaAct = new Date();


          var dif = fechaAct.getTime() - dateObj.getTime(); 

          console.log("Diferencia : "+dif);

          this.dhm(dif);
          this.tiempodatos2[i] = this.datos1.dias;
          this.tiempo2datos2[i] = this.datos1.horas;
          this.tiempo3datos2[i] = this.datos1.minutos;



        }
    }
    
    console.log(this.tiempodatos2);
    console.log(this.tiempo2datos2);
    console.log(this.tiempo3datos2);
   
  }

  generatePdf(idcombate, hito, fecha, hora){
    const dd = {
      
      
      content: [



        { 
          text: ['Combate N°' + idcombate + ': ',
            {
              text: hito, fontSize: 15, underline: false


            },
          ], fontSize: 30, bold: true, alignment: 'center'
      
      
        },
        '\n\n\n',

        {
          ul: [
            'Fecha de inicio del combate : ' + fecha,
            'Hora de inicio del combate : ' + hora,
            ]
        }

       




      ]





    }




    pdfMake.createPdf(dd).open({}, window);



    //pdfMake.createPdf(dd).download("nombredeprueba.pdf")

  }
}
