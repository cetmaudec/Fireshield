import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { environment } from '../environment';

@Component({
  selector: 'app-add-brigada',
  templateUrl: './add-brigada.component.html',
  styleUrls: ['./add-brigada.component.css']
})
export class AddBrigadaComponent implements OnInit {

  /*
    Variables utilizadas para poder crear correctamente una nueva brigada. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario.
  BrigadaForm: FormGroup; 

  /* 
    Variable en donde se almacena el número de la última brigada correspondiente
    al nombre de la brigada que se desea agregar. Se usa para que el usuario agrege
    un número de brigada superior al máximo que ya existe.  
  */

  brigadas$: any = [];

  // Variable que almacena todos los nombres posibles de brigadas a añadir.

  nombresbrigadas$: any=[];
  
  // Variable que almacena todos los posibles jefes de brigadas.
  jefes$: any = [];

  // Variable que almacena todos los posibles jefes de brigadas.
  region$: any = [];
  
  num_brig = 0;

  /*
    En el constructor se inicializa el formulario con valores vacíos. Además, se declaran variables que serán útiles
    para realizar consultas a la base de datos a través del server (HttpClient) y para redirigir luego de añadir la nueva
    brigada.
  */

  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 

    this.BrigadaForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      region: new FormControl('',Validators.required),
      n_brigada: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
    });
    
  }

  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca los valores
    posibles para cada campo. En este caso, se necesitan saber los nombres de las brigadas disponibles y los números
    asociados a cada una de estas. Además, se necesitan saber todos los posiles jefes de brigada.
  */

  async ngOnInit() {

    // Método que obtiene el nombre de todas las brigadas.
    //this.getBrigadas(); 
    //this.jefes$ = await this.getJefes();
    // Método que obtiene los ruts de todos los jefes de brigadas. 
    this.jefes$ = await this.getJefes();
    this.brigadas$ = await this.getnBrigadas();
    this.region$ = await this.getRegion();
    this.nombresbrigadas$ = await this.getBrigadas();
    console.log(this.nombresbrigadas$);
  }


/*************************************************************************************
                                  GETTERS
**************************************************************************************/

  async getBrigadas(){
    this.nombresbrigadas$= await this.http.get(environment.urlAddress+'select/distinct/brigada/nombre').toPromise();
    return this.nombresbrigadas$;    
  }

  async getnBrigadas(){
    this.brigadas$= await this.http.get(environment.urlAddress+'select/brigada/max/nombre').toPromise();
    return this.brigadas$;
  }

  async getRegion(){
    this.region$= await this.http.get(environment.urlAddress+'region').toPromise();
    return this.region$;
  }

  async getJefes(){
    this.jefes$ = await this.http.get(environment.urlAddress+'select/usuario/jefe').toPromise();
    return this.jefes$;
  }

  /*
    Método que es llamado cuando se oprime el botón de registrar brigada. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Registro exitoso de la brigada", en caso
    contrario, se despliega el mensaje "Error en el registro de brigada." Además, se redirige al usuario a
    la pantalla en donde se muestran todas las brigadas existentes.
  */

  onSubmit(){
    console.log(this.BrigadaForm.value);
    if(this.BrigadaForm.value!=null){
      this.http.post(environment.urlAddress+'insert/brigada', this.BrigadaForm.value, 
        { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Registro de brigada exitoso!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  this.router.navigate(['/brigadas']);
                }) ,
          err => Swal.fire({
                  icon: 'error',
                  title: 'Oops!',
                  text: 'Ha ocurrido un error en el registro de brigada'
                }).then((result)=>{
                  this.router.navigate(['/brigadas']);
                })
        )
      }  
    }


/*
  Método que de acuerdo al nombre de la brigada seleccionada por el usuario, se obtiene el máximo número de brigada
  asociado a ese nombre de brigada en particular.
*/

async onChange(deviceValue) {
  console.log(deviceValue);
  for(let b of this.brigadas$.data){
    if(deviceValue == b.nombre){
      this.num_brig = b.max+1;
    }
  }
}

}
