import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { environment } from '../environment';

@Component({
  selector: 'app-combate-brig',
  templateUrl: './combate-brig.component.html',
  styleUrls: ['./combate-brig.component.css']
})
export class CombateBrigComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar todas las brigadas que han participado de cierto combate. Además de que
    los jefes de brigada puedan unir o retirar alguna de sus brigadas a ciertos combates.
  */

  /*
    Variable que contiene información asociada a las brigadas que alguna vez se han unido a cierto combate.
    Permite desplegar en pantalla, la fecha y la hora a la que se unió una brigada a cierto combate. 
    Por otro lado, permite saber si ciertas brigadas están actualmente combatiendo en ese combate o están en reposo.
  */
  combatesBrig$: any = [];

  // Variable que almacena el id del combate del cual se desea conocer cierta informacion. Esto se obtiene de la ruta.

  id: any ;

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;
  rut:any;

  /*
    Variable que almacena todas las brigadas del usuario que está en la sesión actual. Obviamente, solo los jefes de brigada
    tienen brigadas a su cargo.
  */

  brigadas$: any = [];

  /*
    En el constructor se obtiene el id del combate del que se desea saber informacion a través de la ruta,
    además del cargo del usuario actual. Por otro lado, se declaran variables que serán útiles para realizar 
    consultas a la base de datos a través del server (HttpClient),para obtener los 
    valores de la ruta y para redirigir al usuario.
  */
  
  constructor(private http: HttpClient,private rutaActiva: ActivatedRoute,private router: Router) { 
    
    this.id=this.rutaActiva.snapshot.paramMap.get('id');
    this.cargo=localStorage.getItem('cargo');
    this.rut = localStorage.getItem('user');
  }

  /*
    En el OnInit se llaman los métodos necesarios para que se muestre correctamente la información
    del combate que se quiere conocer.
  */
 
  async ngOnInit() {
   
  /* 
    Método que obtiene la información actual del combate en cuestión. Así se tiene la fecha en la que se unió y
    el estado en el que se encuentra cada brigada que ha ingresado al combate (Activo o Reposo). 
  */

   this.combatesBrig$ = await this.getCombates();
   console.log(this.combatesBrig$);

   // Método que obtiene todas las brigadas del usuario actual.

   this.brigadas$ = await this.getnBrigadas();
   console.log(this.brigadas$);
  }
 
 /*
  async getDatoActual(){
    this.datoActual$ = await this.http.get(environment.urlAddress+'datosestadoactualbrigadistas/'+this.rut).toPromise();
    return this.datoActual$.data;
  }

 */

  async getCombates(){
    this.combatesBrig$ = await this.http.get(environment.urlAddress+'combate/brigada'+this.id).toPromise();
    return this.combatesBrig$;
  }

  async getnBrigadas(){
    this.brigadas$ = await this.http.get(environment.urlAddress+'select/brigadajefe'+this.rut).toPromise();
    return this.brigadas$;
  }

  /*
    Método que permite a los jefes de brigada, retirar alguna de sus brigadas del combate actual. Se envían a través de 
    parámetros, datos que permite retirar a la brigada en cuestión del combate. Se realiza una consulta delete al server 
    y de acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica 
    que se realizó correctamente el retiro, se desplegará el mensaje "Brigada retirada de combate correctamente",
    en caso contrario, se despliega el mensaje "Error al retirarse de combate"
  */
  
  retirar(n_brigada:string,nombre:string){
     Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de querer retirarse del combate '+this.id+'?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {     
      this.http.put(environment.urlAddress+'update/combate/brigada/retiro', {'n_brigada': n_brigada, 'id':this.id,'nombre_brigada':nombre}, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  
            this.update_fatiga(n_brigada, nombre),
          err => 
            console.log(err)

      );
    });
  }



  update_fatiga(n_brigada:string,nombre:string){
    this.http.put(environment.urlAddress+'update/fatigaretiro', {'n_brigada': n_brigada, 'id':this.id,'nombre_brigada':nombre}, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(      
          response =>  Swal.fire({
                icon: 'success',
                title: 'Brigada retirada de combate correctamente!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  location.reload();
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
        );
  }



  /*
    Método que permite a los jefes de brigada, unir alguna de sus brigadas al combate actual. Se envían a través de 
    parámetros, datos que permite unir a la brigada en cuestión al combate. Se realiza una consulta post al server 
    y de acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica 
    que se unió correctamente a la brigada, se desplegará el mensaje "Brigada unida a combate correctamente",
    en caso contrario, se despliega el mensaje "Error al unir a combate"
  */

 /* unir(id:string,n_brigada:string,nombre:string){
    let params = new HttpParams().set("n_brigada",n_brigada).set("id", id).set("nombre_brigada",nombre);
    let data = {
      'n_brigada': n_brigada,
      'id': id,
      'nombre_brigada': nombre,
    };
    console.log(data);
      this.http.put(environment.urlAddress+'update/combatebrigada/unir', data, 
        {headers: new HttpHeaders({'Content-Type':'application/json'})}).subscribe(
          response => 
          err => console.log(err)
        );
  }*/

  

}
