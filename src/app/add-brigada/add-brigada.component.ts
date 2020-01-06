import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
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
  

  /*
    En el constructor se inicializa el formulario con valores vacíos. Además, se declaran variables que serán útiles
    para realizar consultas a la base de datos a través del server (HttpClient) y para redirigir luego de añadir la nueva
    brigada.
  */

  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 

    this.BrigadaForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
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

    this.getBrigadas(); 

    /*

     Método que obtiene el último número de brigada agregado de la brigada correspondiente. En este caso,
     se inicializa con el nombre de una brigada cualquiera.
    
    */

    this.getnBrigadas("Alerce");

    // Método que obtiene los ruts de todos los jefes de brigadas. 

    this.getJefes();

  }

  async getBrigadas(){
    this.nombresbrigadas$= await this.http.get('http://localhost:8000/nombresbrigadas').toPromise();    
  }

  async getnBrigadas(nombre){
    this.brigadas$= await this.http.get('http://localhost:8000/maxbrigada' + nombre).toPromise();
   
  }

  /*
    Método que es llamado cuando se oprime el botón de registrar brigada. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Registro exitoso de la brigada", en caso
    contrario, se despliega el mensaje "Error en el registro de brigada." Además, se redirige al usuario a
    la pantalla en donde se muestran todas las brigadas existentes.
  */

  onSubmit(){
    console.log("entre");
    if(this.BrigadaForm.value!=null){
      this.http.post('http://localhost:8000/addBrigada', this.BrigadaForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de brigada').then(() => {
                this.router.navigate(['/brigadas']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de brigada',error.error).then(() => {
              this.router.navigate(['/brigadas']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
      }
    
     
  

 
async getJefes(){
  this.jefes$=await this.http.get('http://localhost:8000/jefes').toPromise();

  
}


/*
  Método que de acuerdo al nombre de la brigada seleccionada por el usuario, se obtiene el máximo número de brigada
  asociado a ese nombre de brigada en particular.
*/

onChange(deviceValue) {
  console.log(deviceValue);

  this.getnBrigadas(deviceValue);


}

}
