import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import swal from'sweetalert2';

import Swal from'sweetalert2';
import { environment } from '../environment';


@Component({
  selector: 'app-mod-brigada',
  templateUrl: './mod-brigada.component.html',
  styleUrls: ['./mod-brigada.component.css']
})
export class ModBrigadaComponent implements OnInit {

  /*
    Variables utilizadas para poder modificar correctamente una nueva brigada. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario.

  modBrigadaForm: FormGroup;

  // Variable que almacena el numero de la brigada que se desea modificar.

  brig: any ;

  // Variable que almacena el nombre de la brigada que se desea modificar.

  brig2: any;

  // Variable que retorna toda la información de la brigada que se desea modificar.

  brigada$: any;

  // Variable que almacena el rut del jefe actual de la brigada que se desea modificar.

  jefes$: any = [];

  // Variable que almacena tanto el nombre como el numero de la brigada que se desea modificar.

  datos: any;
  edit_brigada: Boolean = false;

  /*
    En el constructor se inicializa el formulario de la brigada que se quiere modificar con valores vacíos. 
    Además, se declaran variables que serán útiles para realizar consultas a la base de datos a través del server (HttpClient) 
    y para redirigir luego de modificar la brigada.
  */

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
      this.brig=this.rutaActiva.snapshot.paramMap.get('id');
      this.brig2 = this.rutaActiva.snapshot.paramMap.get('id2');
      this.datos =
        {
          "numero" : this.brig,
          "nombre" : this.brig2
        }
       
      this.modBrigadaForm =  this.formBuilder.group({
        rut: new FormControl('',Validators.required),    
      });
      this.edit_brigada= false;
  }
  
  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca el rut actual del
    jefe de la brigada actua. Además, se obtienen todos los ruts de los posibles jefes de brigada disponibles.
  */

  async ngOnInit() {
    console.log("init");
    // Se obtienen todos los jefes de brigadas disponibles.
    this.jefes$ = this.getJefes();
    console.log(this.jefes$);
    // Se obtiene el actual jefe de brigada de la brigada en cuestión.
    this.brigada$ = this.getJefeBrigada();
    console.log(this.brigada$);
    

  }

  async getJefeBrigada(){
    let params = new HttpParams().set("n_brigada", this.brig).set("nombre",this.brig2);
    this.brigada$ = await this.http.get(environment.urlAddress+'select/jefebrigada',{headers: new HttpHeaders({
    'Content-Type':'application/json'}), params: params}).toPromise();
    return this.brigada$;
    
  }


  /*
    Método que es llamado cuando se oprime el botón de modificar. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación, se desplegará el mensaje "Modificación exitosa de brigada", en caso
    contrario, se despliega el mensaje "Error en modificación de brigada." Además, se redirige al usuario a
    la pantalla en donde se muestran todas las brigadas existentes.
  */

  EditBrigada(){
    if(this.modBrigadaForm.value!=null){
      let params = new HttpParams().set("n_brigada", this.brig).set("nombre",this.brig2);
      this.http.put(environment.urlAddress+'update/brigada/set/jefe', this.modBrigadaForm.value, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Modificación exitosa de brigada!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['/brigadas']);
                  }
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          }));
      }
  }
  
  async getJefes(){
    this.jefes$ = await this.http.get(environment.urlAddress+'select/usuario/jefe').toPromise();
    return this.jefes$;
  }

  EditInfo(group: any){
    console.log(group);
    if(group == 'brigada'){
      this.edit_brigada = true;
      console.log(this.edit_brigada);
    }else{
      this.edit_brigada = false;
    }
  }


}
