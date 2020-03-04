import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders,HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-add-brigadista',
  templateUrl: './add-brigadista.component.html',
  styleUrls: ['./add-brigadista.component.css']
})
export class AddBrigadistaComponent implements OnInit {
  /*
    Variables utilizadas para poder añadir correctamente un nuevo brigadista. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario.

  BrigadistaForm: FormGroup;
  
  // Variable que contiene todos los nombres de brigadas disponibles.

  nombresbrigadas$: any;

  /* 
    Variable en donde se almacenan todos los números de brigada correspondientes
    al nombre de la brigada en donde se desea agregar al brigadista.
  */

  brigadas$: any = [];

  // Variable que contiene todos los números de id de pulsera que aún no han sido usados por ningún brigadista.

  pulserasNoUsadas$:any=[];

  n_brigada:any;
  nombre_brigada:any;

  /*
    En el constructor se inicializa el formulario con valores vacíos. Además, se declaran variables que serán útiles
    para realizar consultas a la base de datos a través del server (HttpClient) y para redirigir luego de añadir al nuevo
    brigadadista. Además, a través del pattern, se restringe a que los ruts sean ingresados correctamente, y que los correos
    tengan un correcto formato.
  */

  constructor(private rutaActiva: ActivatedRoute, private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 

    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');

    // Se obtiene el nombre de la brigada de la que se desean conocer sus brigadistas.

    this.nombre_brigada=this.rutaActiva.snapshot.paramMap.get('id2');
    console.log(this.n_brigada,this.nombre_brigada)
    this.BrigadistaForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',[Validators.required, Validators.pattern('[0-9]+.+[0-9]+.+[0-9]+-[0-9kK]{1}$')]),
      f_nacimiento: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
     
      cargo: new FormControl('',Validators.required),
     
      peso: new FormControl('',Validators.required),
      altura: new FormControl('',Validators.required),
      pulsera: new FormControl('',Validators.required),
      
    });
  }

  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca los valores
    posibles para cada campo. En este caso, se necesitan saber los nombres de las brigadas disponibles y los números
    asociados a cada una de estas. Además, se necesitan saber todas las pulseras que aún no han sido usadas.
  */

  async ngOnInit() {
   

    // Método que obtiene el nombre de todas las brigadas.

    this.getBrigadas();

    /*

     Método que obtiene todos los numeros de brigada de la brigada correspondiente. En este caso,
     se inicializa con el nombre de una brigada cualquiera.
    
    */

    this.getnBrigadas("Alerce");

    // Método que obtiene todas las pulseras que no han sido utilizadas por ningún brigadista.

    this.getPulserasNoUsadas();
 
  }

  async getBrigadas(){
    this.nombresbrigadas$= await this.http.get('http://3.13.114.248:8000/nombresbrigadas').toPromise();
  }

  /*
    Método que de acuerdo al nombre de la brigada seleccionada por el usuario, se obtiene el máximo número de brigada
    asociado a ese nombre de brigada en particular.
  */

  onChange(deviceValue) {

    this.getnBrigadas(deviceValue);

  }

  async getnBrigadas(nombre){
    this.brigadas$= await this.http.get('http://3.13.114.248:8000/brigadasPorNombre' + nombre).toPromise();
  }

  /*
    Método que es llamado cuando se oprime el botón de registrar brigadadista. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Registro exitoso del brigadista", en caso
    contrario, se despliega el mensaje "Error en el registro del brigadista". Además, se redirige al usuario a
    la pantalla en donde se muestran los brigadistas de la brigada en donde insertó al brigadista.
  */

  onSubmit(){
    console.log("entre");
    console.log(this.BrigadistaForm.value)
    
    if(this.BrigadistaForm.value!=null){
      console.log(this.n_brigada, this.nombre_brigada)
      let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre_brigada",this.nombre_brigada);
      this.http.post('http://3.13.114.248:8000/addBrigadista', this.BrigadistaForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params:params}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de brigadista').then(() => {
                this.router.navigate(['/brigadistas/'+this.n_brigada+'/'+this.nombre_brigada]);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de brigadista',error).then(() => {
                console.log(error)
              }
            );
          
          });
          this.ngOnInit();
        }
      }

  
  getPulserasNoUsadas(){
    this.http.get('http://3.13.114.248:8000/pulserasnousadas').subscribe(resp =>
      this.pulserasNoUsadas$ = resp as []
  
    )

  }
  	
}