import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../environment';


@Component({
  selector: 'app-combates',
  templateUrl: './combates.component.html',
  styleUrls: ['./combates.component.css']
})
export class CombatesComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar información respecto a los combates. Pueden ser combates activos o todos los 
    que han habido hasta la fecha. Además, hay variables que permiten eliminar un combate o añadir nuevos combates.
  */

  /*
    Esta variable contiene la información de todos los combates que han habido hasta la fecha. Es decir, su id, hito, fecha
    de inicio, hora de inicio y estado actual.
  */

  combates$: any = [];
  combatesActivos$: any = [];

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  // Variable de tipo FormGroup que permite trabajar el formulario para añadir un nuevo combate.

  CombateForm: FormGroup;
  brigada_Activa: any = [];


  /*
    En el constructor obtiene el cargo del usuario actual, además de inicializar el formulario con valores vacíos. 
    Por otro lado, se declaran variables que serán útiles para realizar consultas a la base de datos a través del server (HttpClient)
    y para redirigir luego de añadir el nuevo combate.
  */
 
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.CombateForm =  this.formBuilder.group({
      hito: new FormControl('',Validators.required),
      fecha: new FormControl('', Validators.required),
      hora: new FormControl('',Validators.required)
    });
    
   }

  /*
    En el OnInit se llaman los métodos necesarios para que se muestren todos los combates. Además, los métodos necesarios
    para que al iniciar el formulario, este conozca los valores posibles para cada campo. 
    En este caso, solo se necesita saber el id recomendado a utilizar para el próximo combate.
  */ 

  async ngOnInit() {
    document.getElementById("defaultOpen").click();

    // Método que obtiene la información actual de todos los combates.

    this.combates$ = await this.getCombates();
    this.combatesActivos$ = await this.getCombatesActivos();
  }

  async getCombates(){
    this.combates$ = await this.http.get(environment.urlAddress+'combates').toPromise();
    return this.combates$;
  }

  async getCombatesActivos(){
    this.combatesActivos$ = await this.http.get(environment.urlAddress+'combates/activos').toPromise();
    return this.combatesActivos$;
  }


  // Método que permite que el usuario pueda acceder a las diferentes opciones del menú de combate (Activos, Todos y Añadir).

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

    /*
    Método que es llamado cuando se oprime el botón de registrar combate. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Registro exitoso de combate", en caso
    contrario, se despliega el mensaje "Error en el registro de combate". Además, se redirige al usuario a
    la pantalla combates.
  */

  onSubmit(){
    if(this.CombateForm.value!=null){
      this.http.post(environment.urlAddress+'insert/combate', this.CombateForm.value, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Registro de nuevo combate existoso!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                   this.ngOnInit();
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
        );  
    }
  }



  /*
    Método que permite finalizar un combate. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación del estado del combate, se desplegará el mensaje 
    "Combate finalizado exitosamente", en caso contrario, se despliega el mensaje "Error al finalizar combate".
  */

  delCombate(id:string){
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de querer finalizar el combate'+id+'?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
     if (result.value) {
        this.http.put(environment.urlAddress+'combate/fin/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  
            this.finalizaTodo(id),
          err => 
            console.log(err)
        );  
      }
    });
  }


  async getCombateBrigadaActiva(idCombate:string){
    this.brigada_Activa  = await this.http.get(environment.urlAddress+'select/combatebrigada/activa/'+idCombate).toPromise();
    return this.brigada_Activa;
  }



  async finalizaTodo(id:any){
    this.brigada_Activa = await this.getCombateBrigadaActiva(id);
    console.log(this.brigada_Activa.data);

    for(let activa of this.brigada_Activa.data){
      console.log(activa);
      this.retirar(activa.n_brigada, activa.nombre_brigada, id);
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Brigada retirada de combate correctamente!',
      confirmButtonText: 'Ok!'
      }).then((result) => {
        location.reload();
      })
  }



  retirar(n_brigada:string, nombre:string, id:any){
    this.http.put(environment.urlAddress+'update/combate/brigada/retiro', {'n_brigada': n_brigada, 'id':id,'nombre_brigada':nombre}, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  
            this.update_fatiga(n_brigada, nombre, id),
          err => 
            console.log(err)

    );
  }

  update_fatiga(n_brigada:string,nombre:string, id:any){
    this.http.put(environment.urlAddress+'update/fatigaretiro', {'n_brigada': n_brigada, 'id':id,'nombre_brigada':nombre}, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(      
          response => console.log(response),
          err => console.log(err) 
        );
  }
}
