import { Component, OnInit ,ViewChild, ViewChildren, QueryList, ElementRef,AfterViewInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  result$: any = [];
  result2$: any = [];
  admin$:any=[];
  jefes$:any=[];
  PersonalForm: FormGroup;
  event: any;
  espera$: any;
  num: any;
  espera2$: any=[];
  listaEspera$:any=[];
  constructor( private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.PersonalForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      usuario: new FormControl('',Validators.required),
      pass: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      
    });
  }

  async ngOnInit() {
    document.getElementById("defaultOpen").click();
    this.admin$=await this.getAdmin();
    this.jefes$=await this.getJefes();
    console.log(this.admin$)
    console.log(this.jefes$)
    this.num=await this.getNumEspera();
    this.listaEspera$=await this.getListaEspera();
    console.log(this.listaEspera$)
  }

  async getNumEspera(){
    this.espera$= await this.http.get('http://localhost:8000/nEspera').toPromise();
    return this.espera$.data[0].numero;
   console.log("espera   "+this.espera$.data[0].numero);
  }

  async getListaEspera(){
    this.espera2$= await this.http.get('http://localhost:8000/listaEspera').toPromise();
    return this.espera2$.data
   console.log("espera   "+this.espera$.data[0].numero);
  }
  onSubmit(){
    console.log("entre");
    if(this.PersonalForm.value!=null){
      this.http.post('http://localhost:8000/addPersonal', this.PersonalForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de Personal').then(() => {
                this.router.navigate(['/personal']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de Personal',error).then(() => {
              this.router.navigate(['/personal']);
              
              }
            );
          
          });
          this.ngOnInit();
    }
  }


  
  modPersonal(id:string){
    this.router.navigate(['/modPersonal',id]);

  }
  
  addPersonal(id:string){
      console.log(this.listaEspera$[0])
      console.log(this.PersonalForm.value)
      this.http.post('http://localhost:8000/addEsperaPersonal', this.listaEspera$[0], { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de Personal').then(() => {
                this.router.navigate(['/personal']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de Personal',error).then(() => {
              this.router.navigate(['/personal']);
              
              }
            );
          
          });
          this.ngOnInit();
    

  }

  rmPersonal(id:string){
    if(confirm("¿Estás seguro de querer añadir este personal "+id+"?")) {
      console.log(id);
      console.log("Implement delete functionality here");
    
      this.http.delete('http://localhost:8000/rmEsperaPersonal/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Solicitud rechazada con éxito').then(() => {
              location.reload();
              
            }
          );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error al rechazar solicitud', error, 'success');
            console.log('error during post is ', error)
          });
  
    }

  }
  delPersonal(id:string){
    if(confirm("¿Estás seguro de querer borrar este personal "+id+"?")) {
      console.log(id);
      console.log("Implement delete functionality here");
    
      this.http.delete('http://localhost:8000/delPersonal/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Borrado de personal completo').then(() => {
              location.reload();
              
            }
          );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error en el borrado de personal', error, 'success');
            console.log('error during post is ', error)
          });
  
    }
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

  async getAdmin(){
    this.result$= await this.http.get('http://localhost:8000/admin').toPromise();
    
    return this.result$.data;
  }

  async getJefes(){
    this.result2$= await this.http.get('http://localhost:8000/jefes').toPromise();
    
    return this.result2$.data;
  }

}
