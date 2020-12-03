import { Component, OnInit ,ViewChild, ViewChildren, QueryList, ElementRef,AfterViewInit, ChangeDetectorRef  } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { environment } from '../environment';


@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar correctamente todos los miembros del personal, además de permitir añadir
    nuevos miembros o aceptar solicitudes de registro pendientes. 
  */

  // Variable que retorna la información de los miembros del personal que sean Administradores o Super-Administradores.

  result$: any = [];

  // Variable que retorna la información de los miembros del personal que sean Jefes de brigada.
 
  result2$: any = [];

  // Variable que almacena la información de los miembros del personal que sean Administradores o Super-Administradores.

  admin$:any=[];

  // Variable que retorna la información de los miembros del personal que sean Jefes de Brigada.

  jefes$:any=[];

  // Variable de tipo FormGroup que permite trabajar el formulario para agregar un miembro al personal.

  PersonalForm: FormGroup;

  // Variable que retorna el número de personas que están en la lista de espera para ser aceptados como miembros del personal.

  espera$: any;

  // Variable que almacena el número de personas que están en la lista de espera para ser aceptados como miembros del personal.

  num: any;

  // Variable que retorna la información de todas las personas que están en la lista de espera.

  espera2$: any=[];

  // Variable que almacena la información de todas las personas que están en la lista de espera.

  listaEspera$:any=[];

  // Variable que almacena el rut del personal que está en la sesión actual.

  rut:any;

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  // Variable que permite que el navbar actualice su información cada cierto intervalo de tiempo.

  intervalHolder: any;

  password: any;
  confirmPassword: any;
  confirm = false;

   /*
    En el constructor se obtiene el rut y el cargo del usuario actual, además de inicializar el formulario 
    de personal con valores vacíos. Por otro lado, se declaran variables que serán útiles para realizar 
    consultas a la base de datos a través del server (HttpClient), para deslogearse con el servicio de 
    autentificacion, para poder actualizar la información del navbar cada cierto tiempo y para redirigir luego
    de la inserción exitosa de un nuevo personal. Notar que los ruts deben estar bien escritos en el momento
    de querer añadir un personal, dado que de otra manera no será posible enviar el registro.
   */

  constructor( private formBuilder: FormBuilder,private http: HttpClient,private router: Router, private _changeDetectorRef: ChangeDetectorRef) {
    this.rut=localStorage.getItem('user');
    this.cargo=localStorage.getItem('cargo');
    
    this.PersonalForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',[Validators.required, Validators.pattern('[0-9]+.+[0-9]+.+[0-9]+-[0-9kK]{1}$')]),
      correo: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      
    });
  }

  /*
    En el OnInit, se obtiene toda la información respecto de los miembros del personal que son administradores y jefes
    de brigada, además de obtener el número de personas que hay en la lista de espera, así como estos mismos. Esta información
    se va a obtener cada cierto intervalo de tiempo.
  */

  async ngOnInit() {
    document.getElementById("defaultOpen").click();
    this.admin$ = await this.getAdmin();
    this.jefes$ = await this.getJefes();
    this.listaEspera$ = await this.getListaEspera();
    this.num = this.listaEspera$.data.length;
  }


  // Método que obtiene la información de los miembros del personal que están en la lista de espera.
  async getListaEspera(){
    this.listaEspera$ = await this.http.get(environment.urlAddress+'select/usuario/espera').toPromise();
    return this.listaEspera$;
  }

  async getAdmin(){
    this.admin$= await this.http.get(environment.urlAddress+'select/usuario/admin').toPromise();
    return this.admin$;
  }

  async getJefes(){
    this.jefes$ = await this.http.get(environment.urlAddress+'select/usuario/jefe').toPromise();
    return this.jefes$;
  }

  /*
    Método que es llamado cuando se oprime el botón de registrar personal. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción del nuevo personal, se desplegará el mensaje "Registro exitoso de Personal"
    , en caso contrario, se despliega el mensaje "Error en el registro de Personal". 
    Además, se redirige al usuario a la pantalla en donde se muestran todos los miembros del personal.
  */

  onSubmit(){
    if(this.PersonalForm.value!=null && this.confirm==true){
      this.http.post(environment.urlAddress+'insert/usuario/activo', this.PersonalForm.value, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Registro exitoso de Personal!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                   this.router.navigate(['/personal']);
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
      );  
    }
  }

  // Método que al oprimir en un personal, permite ir a la pantalla que permite modificar a ese mismo personal.
  
  modPersonal(id:string){
    this.router.navigate(['/edit/usuario',id]);
  }
  
  /*
    Método que permite aceptar una solicitud de registro. Esto realiza una petición de post al server con la información
    que había sido ingresada al registrarse.
  */

  addPersonal(id:string, i:number){
    Swal.fire({
      icon: 'warning',
      title: '¿Desea aceptar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
     if (result.value) {

      this.http.post(environment.urlAddress+'update/usuario/set/estado/activo', this.listaEspera$.data[i], { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Solicitud aceptada exitosamente!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                   this.router.navigate(['/personal']);
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
        );  
      }
    });
  }

  /*
    Método que permite rechazar una solicitud de registro. Esto realiza una petición de delete al server, que elimina de la lista
    de espera al sujeto en cuestión.
  */

  rmPersonal(id:string){
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de querer rechazar a este personal '+id+'?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
     if (result.value) {
      this.http.delete(environment.urlAddress+'delete/usuario/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Solicitud rechazada con éxito',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  this.router.navigate(['/personal']);
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
        );  
      }
    });
  }

  /*
    Método que permite eliminar a un personal. Esto solo lo pueden realizar los super administradores. 
  */

  delPersonal(id:string){
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de querer borrar este personal '+id+'?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
     if (result.value) {
      this.http.delete(environment.urlAddress+'delete/usuario/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Personal borrado exitosamente!',
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
    });
  }   

  /*
    Método que permite que el usuario pueda acceder a las diferentes opciones del menú (Administradores, Jefes de Brigada,
    Añadir Personal y Solicitudes).
  */

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

  getPassword(event: Event){
    this.password = (event.target as HTMLInputElement).value;
    console.log(this.password);
  }

  getconfirmPassword(event: Event){
    this.confirmPassword = (event.target as HTMLInputElement).value;
    console.log(this.password +" = "+this.confirmPassword);
    if(this.confirmPassword==this.password){
      this.confirm=true;
    }else{
      this.confirm=false;
    }
  }

}
