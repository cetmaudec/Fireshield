import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


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

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  // Variable de tipo FormGroup que permite trabajar el formulario para añadir un nuevo combate.

  CombateForm: FormGroup;

  // Variable que contiene el id del último combate añadido. 

  Combat$: any = [];

  /*
    Variable que almacena el id que se recomienda que el usuario debe utilizar para registrar el nuevo combate.
    Corresponde al valor que contiene Combat$ + 1. 
  */

  maxCombat: any;

  /*
    En el constructor obtiene el cargo del usuario actual, además de inicializar el formulario con valores vacíos. 
    Por otro lado, se declaran variables que serán útiles para realizar consultas a la base de datos a través del server (HttpClient)
    y para redirigir luego de añadir el nuevo combate.
  */
 
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.CombateForm =  this.formBuilder.group({
      id: new FormControl('',Validators.required),
      hito: new FormControl('',Validators.required),
      
    });
    
   }

  /*
    En el OnInit se llaman los métodos necesarios para que se muestren todos los combates. Además, los métodos necesarios
    para que al iniciar el formulario, este conozca los valores posibles para cada campo. 
    En este caso, solo se necesita saber el id recomendado a utilizar para el próximo combate.
  */ 

  ngOnInit() {
    document.getElementById("defaultOpen").click();

    // Método que obtiene la información actual de todos los combates.

    this.getCombates();

    this.maxCombat = 0;

    // Método que calcula el id recomendado para agregar el nuevo combate.

    this.getMaxCombat();
  }
  getCombates(){
    this.http.get('http://localhost:8000/combates').subscribe(resp =>
      this.combates$ = resp as []
  
    )

  }

  /*
    Método que permite finalizar un combate. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación del estado del combate, se desplegará el mensaje 
    "Combate finalizado exitosamente", en caso contrario, se despliega el mensaje "Error al finalizar combate".
  */

  delCombate(id:string){
    if(confirm("¿Estás seguro de querer finalizar el combate "+id+"?")) {

    
      this.http.put('http://localhost:8000/finCombate/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Combate finalizado exitosamente').then(() => {
              location.reload();
              
            }
          );

          },
          (error)=>{
            swal.fire('Error al finalizar combate', error, 'success');
 
          });
  
    }
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
    console.log("entre");
    if(this.CombateForm.value!=null){
      this.http.post('http://localhost:8000/addCombate', this.CombateForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de combate').then(() => {
                this.router.navigate(['/combates']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de combate',error).then(() => {
              this.router.navigate(['/combates']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
  }


  async getMaxCombat(){

    this.Combat$ = await this.http.get('http://localhost:8000/maxCombat').toPromise();
    console.log(this.Combat$.data[0].combate);
    this.Combat$.data[0].combate++;

    this.maxCombat = this.Combat$.data[0].combate + 1;
    
    
  }

}
