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

  brigadasCombate$:any=[];
  array:any=[];

  combatesfin$:any=[];
  array2:any=[];

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
    console.log(this.combactivos$);
    this.getTiempo(this.combactivos$);
    console.log(this.tiempo);
    console.log(this.tiempo2);
    console.log(this.tiempo3);
   
  }

  dhm(t){


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

      if(combates.data[i].estado == 0){

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
      console.log(this.tiempo[i])
      console.log(this.tiempo2[i])
      console.log(this.tiempo3[i])
      }else{
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

        console.log(dateString2)
        let date=dateString1.split(' ');

        var anyo = Number(date[0].split('-')[0]);
        var mes = Number(date[0].split('-')[1]);
        var dia = Number(date[0].split('-')[2]);
        var hora = Number(date[1].split(':')[0]);
        var minuto = Number(date[1].split(':')[1]);
        var segundo = Number(date[1].split(':')[2]);

        var dateObj=new Date(anyo,mes-1,dia,hora,minuto,segundo);


        let date2=dateString2.split(' ');

        console.log(date2);
        var anyo2 = Number(date2[0].split('-')[0]);
        var mes2 = Number(date2[0].split('-')[1]);
        var dia2 = Number(date2[0].split('-')[2]);
        var hora2 = Number(date2[1].split(':')[0]);
        var minuto2 = Number(date2[1].split(':')[1]);
        var segundo2 = Number(date2[1].split(':')[2]);

        console.log(anyo2);
        console.log(mes2);
        console.log(dia2);
        console.log(hora2);
        console.log(minuto2);
        console.log(segundo2);

        var dateObj2=new Date(anyo2,mes2,dia2,hora2,minuto2,segundo2);

        console.log(dateObj2);

        

        var dif = dateObj2.getTime() - dateObj.getTime(); 
        
        this.dhm(dif);
        this.tiempo[i] = this.datos1.dias;
        this.tiempo2[i] = this.datos1.horas;
        this.tiempo3[i] = this.datos1.minutos;


        console.log(this.tiempo[i])
        console.log(this.tiempo2[i])
        console.log(this.tiempo3[i])
      }

    }
  }


  async getCombMes(){
    this.combmes$= await this.http.get('http://localhost:8000/combMes').toPromise();

    console.log(this.combmes$)
    this.getTiempo(this.combmes$);

    

  }
  async getComb6Mes(){
    this.comb6mes$= await this.http.get('http://localhost:8000/comb6Mes').toPromise();

    this.getTiempo(this.comb6mes$);
    console.log(this.comb6mes$)
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
      if(this.combmes2$.data[i].estado == 0){
        console.log("condicion 1 ");
        this.tiempodatos2[i]=this.datos2.dias;
        this.tiempo2datos2[i]=this.datos2.horas;
        this.tiempo3datos2[i]=this.datos2.minutos;
      }else if(this.combmes2$.data[i].estado == 1){
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
        console.log("Entré a la condición.")
        console.log("Diferencia : "+dif);

        this.dhm(dif);
        console.log("Dias1  : "+this.datos2.dias);
        console.log("Dias2  : "+this.datos1.dias);
        console.log("Horas1  : "+this.datos2.horas);
        console.log("Horas2  : "+this.datos1.horas);
        console.log("Minutos1  : "+this.datos2.minutos);
        console.log("Minutos2  : "+this.datos1.minutos);
        this.tiempodatos2[i] =  this.datos2.dias + this.datos1.dias;
        this.tiempo2datos2[i] = this.datos2.horas + this.datos1.horas;
        this.tiempo3datos2[i] = this.datos2.minutos + this.datos1.minutos;

        let miliseconds = this.tiempodatos2[i]*24*3600*1000 + this.tiempo2datos2[i]*3600*1000+this.tiempo3datos2[i]*60*1000;

        console.log(miliseconds);
        this.dhm(miliseconds);


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

      
      if(this.comb6mes2$.data[i].estado == 0){
        console.log("condicion 1 ");
        this.tiempodatos2[i]=this.datos2.dias;
        this.tiempo2datos2[i]=this.datos2.horas;
        this.tiempo3datos2[i]=this.datos2.minutos;
      }else if(this.comb6mes2$.data[i].estado == 1){
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
        console.log("Entré a la condición.")
        console.log("Diferencia : "+dif);

        this.dhm(dif);
        console.log("Dias1  : "+this.datos2.dias);
        console.log("Dias2  : "+this.datos1.dias);
        console.log("Horas1  : "+this.datos2.horas);
        console.log("Horas2  : "+this.datos1.horas);
        console.log("Minutos1  : "+this.datos2.minutos);
        console.log("Minutos2  : "+this.datos1.minutos);
        this.tiempodatos2[i] =  this.datos2.dias + this.datos1.dias;
        this.tiempo2datos2[i] = this.datos2.horas + this.datos1.horas;
        this.tiempo3datos2[i] = this.datos2.minutos + this.datos1.minutos;


        let miliseconds = this.tiempodatos2[i]*24*3600*1000 + this.tiempo2datos2[i]*3600*1000+this.tiempo3datos2[i]*60*1000;

        console.log(miliseconds);
        this.dhm(miliseconds);


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
      if(this.combanyo2$.data[i].estado == 0){
        console.log("condicion 1 ");
        this.tiempodatos2[i]=this.datos2.dias;
        this.tiempo2datos2[i]=this.datos2.horas;
        this.tiempo3datos2[i]=this.datos2.minutos;
      }else if(this.combanyo2$.data[i].estado == 1){
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
        console.log("Entré a la condición.")
        console.log("Diferencia : "+dif);

        this.dhm(dif);
        console.log("Dias1  : "+this.datos2.dias);
        console.log("Dias2  : "+this.datos1.dias);
        console.log("Horas1  : "+this.datos2.horas);
        console.log("Horas2  : "+this.datos1.horas);
        console.log("Minutos1  : "+this.datos2.minutos);
        console.log("Minutos2  : "+this.datos1.minutos);
        this.tiempodatos2[i] =  this.datos2.dias + this.datos1.dias;
        this.tiempo2datos2[i] = this.datos2.horas + this.datos1.horas;
        this.tiempo3datos2[i] = this.datos2.minutos + this.datos1.minutos;

        let miliseconds = this.tiempodatos2[i]*24*3600*1000 + this.tiempo2datos2[i]*3600*1000+this.tiempo3datos2[i]*60*1000;

        console.log(miliseconds);
        this.dhm(miliseconds);


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
      console.log(this.combtodos2$.data[i].nombre_brigada);
      console.log(this.combtodos2$.data[i].n_brigada);
      time = 0;
      this.datos2 = await this.calcularTiempo(this.combtodos2$.data[i].nombre_brigada, this.combtodos2$.data[i].n_brigada, k, this.combtodos2fin$);
      k = this.datos2.i;
     
        if(this.combtodos2$.data[i].estado == 0){
          console.log("condicion 1 ");
          this.tiempodatos2[i]=this.datos2.dias;
          this.tiempo2datos2[i]=this.datos2.horas;
          this.tiempo3datos2[i]=this.datos2.minutos;
        }else if(this.combtodos2$.data[i].estado == 1){
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
          console.log("Entré a la condición.")
          console.log("Diferencia : "+dif);

          this.dhm(dif);
          console.log("Dias1  : "+this.datos2.dias);
          console.log("Dias2  : "+this.datos1.dias);
          console.log("Horas1  : "+this.datos2.horas);
          console.log("Horas2  : "+this.datos1.horas);
          console.log("Minutos1  : "+this.datos2.minutos);
          console.log("Minutos2  : "+this.datos1.minutos);
          this.tiempodatos2[i] =  this.datos2.dias + this.datos1.dias;
          this.tiempo2datos2[i] = this.datos2.horas + this.datos1.horas;
          this.tiempo3datos2[i] = this.datos2.minutos + this.datos1.minutos;

          let miliseconds = this.tiempodatos2[i]*24*3600*1000 + this.tiempo2datos2[i]*3600*1000+this.tiempo3datos2[i]*60*1000;

        console.log(miliseconds);
        this.dhm(miliseconds);


        this.tiempodatos2[i] = this.datos1.dias;
        this.tiempo2datos2[i] = this.datos1.horas;
        this.tiempo3datos2[i] = this.datos1.minutos;
          


        }
    }
    
    console.log(this.tiempodatos2);
    console.log(this.tiempo2datos2);
    console.log(this.tiempo3datos2);
   
  }
  async generatePdfActivos(estado, idcombate, hito, fecha, hora,i,nalta,nmedia){
    var estado2;
    if(estado==0){
      estado2='Finalizado'
    }else{
      estado2='Activo'
    }
    
    this.array=[];
    this.brigadasCombate$= await this.http.get('http://localhost:8000/brigadasCombate/'+idcombate).toPromise();
    console.log(this.brigadasCombate$.data)
    this.array2=[];
    this.combatesfin$=await this.http.get('http://localhost:8000/combatesFin/'+idcombate).toPromise();
    console.log(this.combatesfin$.data)
    
    for (let i = 0; i<this.brigadasCombate$.data.length;i++){

      this.array[i]=' Brigada N°'+this.brigadasCombate$.data[i].n_brigada
    }
    var titulos = new Array( 'Nombre Brigada', 'N° Brigada', 'Id Combate ', 'Fecha Inicio', 'Hora Inicio','Fecha Término', 'Hora Término' );
    this.array2[0]=titulos
    for (let i = 1; i<this.combatesfin$.data.length+1;i++){

      this.array2[i]=[];
      this.array2[i][0]=this.combatesfin$.data[i-1].nombre_brigada
      this.array2[i][1]=this.combatesfin$.data[i-1].n_brigada
      this.array2[i][2]=this.combatesfin$.data[i-1].id
      this.array2[i][3]=this.combatesfin$.data[i-1].fecha
      this.array2[i][4]=this.combatesfin$.data[i-1].hora
      this.array2[i][5]=this.combatesfin$.data[i-1].fecharetiro
      this.array2[i][6]=this.combatesfin$.data[i-1].horaretiro
    }

    console.log(this.array)
    console.log(this.array2)
    
    const dd = {
      
      
      content: [
        
        { 
          text: ['Reportería por Combate']
            
          , fontSize: 30, italic: true, alignment: 'center'
      
      
        },
        
        
        '\n\n\n',
        { 
          text: ['Combate N°' + idcombate + ': ',
            {
              text: hito, fontSize: 20, underline: false


            },
          ], fontSize: 20, bold: true, alignment: 'center'
      
      
        }, 
        '\n\n\n',
        { 
          text: ['Estado: ' + estado2 ,
           
          ], fontSize: 17, bold: true, 
      
      
        },
        '\n',

        {
          ul: [
            'Fecha de inicio del combate : ' + fecha,
            'Hora de inicio del combate : ' + hora,
            'Tiempo de combate activo: ' + this.tiempo[i] + ' dias, ' + 
            this.tiempo2[i] + ' horas, '+
            this.tiempo3[i] + ' minutos.',
            'N° de brigadistas en fatiga alta: ' + nalta,
            'N° de brigadistas en fatiga media: ' + nmedia,
            'Brigadas que se unieron a este combate: '+ this.array
            ]
        },
        '\n\n\n',
        { 
          text: ['Registro de los retiros de brigadas de este combate:']
            
          , fontSize: 15, italic: true
      
      
        },
        '\n\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*','*', '*', '*' ,'*'],
            body: 
              this.array2
            
            
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            }
          }
        },

       




      ]





    }




    pdfMake.createPdf(dd).open({}, window);



    //pdfMake.createPdf(dd).download("nombredeprueba.pdf")

  }

  
  async generatePdf(estado,idcombate, hito, fecha, hora,fechafin,horafin,i,nalta,nmedia){
    var estado2;
    if(estado==0){
      estado2='Finalizado'
    }else{
      estado2='Activo'
    }
    
    this.array=[];
    this.brigadasCombate$= await this.http.get('http://localhost:8000/brigadasCombate/'+idcombate).toPromise();
    console.log(this.brigadasCombate$.data)
    this.array2=[];
    this.combatesfin$=await this.http.get('http://localhost:8000/combatesFin/'+idcombate).toPromise();
    console.log(this.combatesfin$.data)
    
    for (let i = 0; i<this.brigadasCombate$.data.length;i++){

      this.array[i]=' Brigada N°'+this.brigadasCombate$.data[i].n_brigada
    }
    var titulos = new Array( 'Nombre Brigada', 'N° Brigada', 'Id Combate ', 'Fecha Inicio', 'Hora Inicio','Fecha Término', 'Hora Término' );
    this.array2[0]=titulos
    for (let i = 1; i<this.combatesfin$.data.length+1;i++){

      this.array2[i]=[];
      this.array2[i][0]=this.combatesfin$.data[i-1].nombre_brigada
      this.array2[i][1]=this.combatesfin$.data[i-1].n_brigada
      this.array2[i][2]=this.combatesfin$.data[i-1].id
      this.array2[i][3]=this.combatesfin$.data[i-1].fecha
      this.array2[i][4]=this.combatesfin$.data[i-1].hora
      this.array2[i][5]=this.combatesfin$.data[i-1].fecharetiro
      this.array2[i][6]=this.combatesfin$.data[i-1].horaretiro
    }

    console.log(this.array)
    console.log(this.array2)
    
    const dd = {
      
      
      content: [
        
        { 
          text: ['Reportería por Combate']
            
          , fontSize: 30, italic: true, alignment: 'center'
      
      
        },
        
        
        '\n\n\n',
        { 
          text: ['Combate N°' + idcombate + ': ',
            {
              text: hito, fontSize: 20, underline: false


            },
          ], fontSize: 20, bold: true, alignment: 'center'
      
      
        }, 
        '\n\n\n',
        { 
          text: ['Estado: ' + estado2 ,
           
          ], fontSize: 17, bold: true, 
      
      
        },
        '\n',

        {
          ul: [
            'Fecha de inicio del combate : ' + fecha,
            'Hora de inicio del combate : ' + hora,
            'Fecha de término del combate : ' + fechafin,
            'Hora de término del combate : ' + horafin,
            'Tiempo de combate activo: ' + this.tiempo[i] + ' dias, ' + 
            this.tiempo2[i] + ' horas, '+
            this.tiempo3[i] + ' minutos.',
            'N° de brigadistas en fatiga alta: ' + nalta,
            'N° de brigadistas en fatiga media: ' + nmedia,
            'Brigadas que se unieron a este combate: '+ this.array
            ]
        },
        '\n\n\n',
        { 
          text: ['Registro de los retiros de brigadas de este combate:']
            
          , fontSize: 15, italic: true
      
      
        },
        '\n\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*','*', '*', '*' ,'*'],
            body: 
              this.array2
            
            
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            }
          }
        },

       




      ]





    }




    pdfMake.createPdf(dd).open({}, window);



    //pdfMake.createPdf(dd).download("nombredeprueba.pdf")

  }
}
