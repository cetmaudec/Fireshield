import { Component, OnInit ,ViewChild, ViewChildren, QueryList, ElementRef,AfterViewInit, ChangeDetectorRef  } from '@angular/core';
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
      pass: new FormControl('',Validators.required),
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
    this.getData();
    this.intervalHolder =  setInterval(()=>{
      this._changeDetectorRef.markForCheck();
      //console.log("entro");
      this.getData();
    }, 5000);  
    
  }

  // Método que obtiene toda la información mencionada anteriormente.

  async getData(){
    this.admin$=await this.getAdmin();
    this.jefes$=await this.getJefes();
    this.num=await this.getNumEspera();
    this.listaEspera$=await this.getListaEspera();
  }

  // Método que obtiene el número de personas que están en la lista de espera.

  async getNumEspera(){
    this.espera$= await this.http.get('http://3.13.114.248:8000/nEspera').toPromise();
    return this.espera$.data[0].numero;
  }

  // Método que obtiene la información de los miembros del personal que están en la lista de espera.

  async getListaEspera(){
    this.espera2$= await this.http.get('http://3.13.114.248:8000/listaEspera').toPromise();
    return this.espera2$.data

  }

  /*
    Método que es llamado cuando se oprime el botón de registrar personal. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción del nuevo personal, se desplegará el mensaje "Registro exitoso de Personal"
    , en caso contrario, se despliega el mensaje "Error en el registro de Personal". 
    Además, se redirige al usuario a la pantalla en donde se muestran todos los miembros del personal.
  */

  onSubmit(){
    if(this.PersonalForm.value!=null){
      this.http.post('http://3.13.114.248:8000/addPersonal', this.PersonalForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
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

  // Método que al oprimir en un personal, permite ir a la pantalla que permite modificar a ese mismo personal.
  
  modPersonal(id:string){
    this.router.navigate(['/modPersonal',id]);
  }
  
  /*
    Método que permite aceptar una solicitud de registro. Esto realiza una petición de post al server con la información
    que había sido ingresada al registrarse.
  */

  addPersonal(id:string, i:number){

    this.http.post('http://3.13.114.248:8000/addEsperaPersonal', this.listaEspera$[i], { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
        (response ) => {
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

  /*
    Método que permite rechazar una solicitud de registro. Esto realiza una petición de delete al server, que elimina de la lista
    de espera al sujeto en cuestión.
  */

  rmPersonal(id:string){
    if(confirm("¿Estás seguro de querer rechazar a este personal "+id+"?")) {
      this.http.delete('http://3.13.114.248:8000/rmEsperaPersonal/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Solicitud rechazada con éxito').then(() => {
              location.reload();
              
            }
          );
          },
          (error)=>{
            swal.fire('Error al rechazar solicitud', error, 'success');
          });
  
    }

  }

  /*
    Método que permite eliminar a un personal. Esto solo lo pueden realizar los super administradores. 
  */

  delPersonal(id:string){
    if(confirm("¿Estás seguro de querer borrar este personal "+id+"?")) {
      console.log(id);
      console.log("Implement delete functionality here");
    
      this.http.delete('http://3.13.114.248:8000/delPersonal/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
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

  

  async getAdmin(){
    this.result$= await this.http.get('http://3.13.114.248:8000/admin').toPromise();
    
    return this.result$.data;
  }

  async getJefes(){
    this.result2$= await this.http.get('http://3.13.114.248:8000/jefes').toPromise();
    
    return this.result2$.data;
  }

}
