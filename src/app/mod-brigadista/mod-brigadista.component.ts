import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import swal from'sweetalert2';


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
    const result1 =  await this.getBrigadista();
    
    // Se obtienen todos los posibles nombres de brigadas disponibles.

    this.nombresbrigadas$ = await this.getNombresBrigadas();
    this.getnBrigadas(result1.nombre_brigada);
    this.modBrigForm.patchValue({
      nombre:result1.nombre,
      apellidoP:result1.apellidoP,
      apellidoM:result1.apellidoM,
      correo:result1.correo,
      nombre_brigada:result1.nombre_brigada,
      n_brigada:result1.n_brigada,
      cargo:result1.cargo,
      peso:result1.peso,
      altura:result1.altura,
      pulsera:result1.pulsera
    });

  
    await this.getPulseraActual();
    this.getPulserasNoUsadas();
    const result2 = await this.getPulserasNoUsadas();
    
  }

  async getNombresBrigadas(){
    this.nombresbrigadas2$= await this.http.get('http://localhost:8000/nombresbrigadas').toPromise();
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
    this.brigadas$= await this.http.get('http://localhost:8000/brigadasPorNombre' + nombre).toPromise();
   
  }

  async getBrigadista(){
    this.brigadista$ = await this.http.get('http://localhost:8000/brigadista/'+this.rut).toPromise();
    return this.brigadista$.data[0]
  }

  /*
    Método que es llamado cuando se oprime el botón de modificar brigadadista. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación, se desplegará el mensaje "Modificación exitosa de brigadista", en caso
    contrario, se despliega el mensaje "Error en modificación de brigadista". Además, se redirige al usuario a
    la pantalla en donde se muestran los brigadistas de la brigada en donde insertó al brigadista.
  */
  onSubmit(){
    if(this.modBrigForm.value!=null){
      this.http.put('http://localhost:8000/modBrigadista/'+this.rut, this.modBrigForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificación exitosa de brigadista').then(() => {
                this.router.navigate(['/brigadistas/'+this.modBrigForm.value.n_brigada+'/'+this.modBrigForm.value.nombre_brigada]);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en modificación de brigadista',error).then(() => {
              this.router.navigate(['/brigadas']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
  }
  
  // Método que obtiene la pulsera actual del brigadista
  
    async getPulseraActual(){
      this.act$ = await this.http.get('http://localhost:8000/pulseraAct/'+this.rut).toPromise();
      return this.act$;
    }
  
  async getPulserasNoUsadas(){
    this.pulserasNoUsadas$ = await this.http.get('http://localhost:8000/pulserasnousadas').toPromise();
    return this.pulserasNoUsadas$;
  }


}