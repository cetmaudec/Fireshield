import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-unirse-combate',
  templateUrl: './unirse-combate.component.html',
  styleUrls: ['./unirse-combate.component.css']
})
export class UnirseCombateComponent implements OnInit {

  /*
    Variables utilizadas para que los jefes de brigada puedan unir alguna de sus brigadas a un combate en especifico. 
  */

  // Variable que almacena el id de combate al cual el jefe de brigada desea unir alguna de sus brigadas. Se obtiene por ruta.

  id_combate:any;

  // Variable que obtiene el rut del usuario actual.

  rut:any;

  /*
    Variable que almacena la informacion de todas las brigadas que están a cargo del usuario. Solo corresponde para jefes de 
    brigada.
  */
  
  brigadas$: any = [];
  
  // Variable de tipo FormGroup que permite trabajar el formulario para unirse a cierto combate.

  unirseForm: FormGroup;

  // Variable que almacena el cargo del usuario de la sesión actual.
  
  cargo:any;

  /*
    En el constructor se obtiene el cargo del usuario actual, además de inicializar el formulario con valores vacíos. 
    Por otro lado, se declaran variables que serán útiles para realizar consultas a la base de datos a través 
    del server (HttpClient) y para redirigir luego de unirse al combate.
  */

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.id_combate=this.rutaActiva.snapshot.paramMap.get('id');
    this.unirseForm =  this.formBuilder.group({
      n_brigada: new FormControl('',Validators.required),
     
      id: new FormControl('',Validators.required)
    });
    
   }

  // En el OnInit, se obtienen todas las brigadas pertenecientes al usuario de la sesión actual. 

  ngOnInit() {
   
    this.getnBrigadas();
    
    this.unirseForm.patchValue({
      
      id:this.id_combate,
      
      
    })
    this.rut =localStorage.getItem('user');

  }
  async getnBrigadas(){
    this.brigadas$ = await this.http.get('http://3.13.114.248:8000/nbrigadas'+localStorage.getItem('user')).toPromise();
      
  }

  /*
    Método que es llamado cuando se oprime el botón de unirse. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Brigada unida a combate correctamente", en caso
    contrario, se despliega el mensaje "Error al unir a combate". Además, se redirige al usuario a
    la pantalla en donde se muestran todos los combates por brigada.
  */

  onSubmit(){
    console.log("llegueee")
    if(this.unirseForm.value!=null){
      console.log(this.unirseForm.value)
      this.http.post('http://3.13.114.248:8000/unirseCombate2', this.unirseForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log("responseeee"+response);
            swal.fire('Brigada unida a combate correctamente').then(() => {
              this.router.navigate(['/combateBrig/'+this.id_combate]);
                
              }
            );
           
          },
          (error)=>{
            console.log("errro"+error.error);
            swal.fire('Error al unir a combate', error.error).then(() => {
              this.router.navigate(['/combates']);
              
              }
            );
          
          });
          this.ngOnInit();
          
        }
       
  }

}
