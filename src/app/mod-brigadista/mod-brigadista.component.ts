import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { environment } from '../environment';


@Component({
  selector: 'app-mod-brigadista',
  templateUrl: './mod-brigadista.component.html',
  styleUrls: ['./mod-brigadista.component.css']
})
export class ModBrigadistaComponent implements OnInit {

  /*
    Variables utilizadas para poder modificar correctamente a un brigadista. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario.

  modBrigForm: FormGroup;

  // Variable que almacena el rut del brigadista del que se desea modificar algun dato. Se obtiene por la ruta.
  rut: any ;
  
  /* 
    Variable en donde se almacenan todos los números de brigada correspondientes
    al nombre de la brigada en donde se desea agregar al brigadista.
  */
  brigadas$: any = [];
  
  // Variable que almacena toda la información personal del brigadista.
  brigadista$:any;

  // Variable que contiene todos los números de id de pulsera que aún no han sido usados por ningún brigadista.
  pulserasNoUsadas$:any=[];

  // Variable que almacena el número de pulsera actual del brigadista.
  act$:any=[];

  // Variable que contiene todos los posibles nombres de brigadas disponibles.
  nombresbrigadas$: any;
  
  // Variable que retorna todos los posibles nombres de brigadas disponibles.
  nombresbrigadas2$:any;

  edit_brigada: Boolean = false;
  edit_condicion: Boolean = false;
  
  /*
    En el constructor además de obtener el rut a través de la ruta,
    se inicializa el formulario del brigadista que se quiere modificar con valores vacíos. Además, se declaran 
    variables que serán útiles para realizar consultas a la base de datos a través del server (HttpClient) y para 
    redirigir luego de modificar al brigadista.
  */

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.rut=this.rutaActiva.snapshot.paramMap.get('id');

    this.modBrigForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
      nombre_brigada: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      n_brigada: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      peso: new FormControl('',Validators.required),
      altura: new FormControl('',Validators.required),
      pulsera: new FormControl('',Validators.required)
      
    });
  }

  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca todos los datos
    actuales del brigadista. Además, se rellenan los campos con estos datos. 
  */
  async ngOnInit() {
    this.brigadista$ = this.getBrigadista();

    // Se obtienen todos los posibles nombres de brigadas disponibles.
    this.nombresbrigadas$ = await this.getNombresBrigadas();
    this.getnBrigadas(this.brigadista$.nombre_brigada);
    const result2 = await this.getPulserasNoUsadas();   
  }

  async getNombresBrigadas(){
    this.nombresbrigadas2$= await this.http.get(environment.urlAddress+'select/distinct/brigada/nombre').toPromise();
    return this.nombresbrigadas2$.data;
  }

  /*
    Método que de acuerdo al nombre de la brigada seleccionada por el usuario, se obtiene el máximo número de brigada
    asociado a ese nombre de brigada en particular.
  */
  onChange(deviceValue) {
    this.getnBrigadas(deviceValue);
  }


  // Método que obtiene el máximo número de brigada asociado a un nombre de brigada en particular.
  async getnBrigadas(nombre){
    this.brigadas$= await this.http.get(environment.urlAddress+'select/brigada/numero' + nombre).toPromise();
    return this.brigadas$;
  }

  async getBrigadista(){
    this.brigadista$ = await this.http.get(environment.urlAddress+'brigadista/'+this.rut).toPromise();
    return this.brigadista$;
  }

  /*
    Método que es llamado cuando se oprime el botón de modificar brigadadista. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación, se desplegará el mensaje "Modificación exitosa de brigadista", en caso
    contrario, se despliega el mensaje "Error en modificación de brigadista". Además, se redirige al usuario a
    la pantalla en donde se muestran los brigadistas de la brigada en donde insertó al brigadista.
  */
  EditCondicion(){
    const n_brigada = this.brigadista$.data[0].n_brigada;
    const nombre_brigada = this.brigadista$.data[0].nombre_brigada
    const data_condicion = { 
      'peso': this.modBrigForm.get('peso').value,
      'altura': this.modBrigForm.get('altura').value,
    }

    if(this.modBrigForm.value!=null){
      this.http.put(environment.urlAddress+'update/brigadista/condicion/'+this.rut, data_condicion, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Modificación exitosa de brigadista!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['/brigadistas/'+n_brigada+'/'+nombre_brigada]); 
                  }
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
      );  
    }
  }

  EditBrigada(){
    const n_brigada = this.brigadista$.data[0].n_brigada;
    const nombre_brigada = this.brigadista$.data[0].nombre_brigada
    const data_brigada = { 
      'pulsera': this.modBrigForm.get('pulsera').value,
      'cargo': this.modBrigForm.get('cargo').value,
      'n_brigada': n_brigada,
      'nombre_brigada': nombre_brigada
    }

    if(this.modBrigForm.value!=null){
      this.http.put(environment.urlAddress+'update/brigadista/brigada/'+this.rut, data_brigada, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Modificación exitosa de brigadista!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['/brigadistas/'+n_brigada+'/'+nombre_brigada]); 
                  }
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
      );  
    }
  }



  EditInfo(group: any){
    console.log(group);
    if(group == 'brigada'){
      this.edit_brigada = true;
      console.log(this.edit_brigada);
    }else if(group == 'condicion'){
      this.edit_condicion = true;
      console.log(this.edit_condicion);
    }else{
      this.edit_brigada = false;
      this.edit_condicion = false;
    }
  }

  
  // Método que obtiene la pulseras disponibles para asociar.  
    async getPulserasNoUsadas(){
      this.pulserasNoUsadas$ = await this.http.get(environment.urlAddress+'select/pulsera/brigadista/disponible').toPromise();
    return this.pulserasNoUsadas$;
  }


}