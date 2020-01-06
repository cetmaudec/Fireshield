import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mod-combate',
  templateUrl: './mod-combate.component.html',
  styleUrls: ['./mod-combate.component.css']
})
export class ModCombateComponent implements OnInit {

  /*
    Variables utilizadas para poder modificar correctamente un combate. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario para modificar el combate.

  CombateForm: FormGroup;

  // Variable que contiene el hito actual que posee el combate en cuestión.

  hito: any;

  // Variable que almacena el id del combate que se desea modificar, se obtiene por la ruta.

  idcombate: any;

   /*
    En el constructor se obtiene el id del combate actual, además de inicializar el formulario con valores vacíos. 
    Por otro lado, se declaran variables que serán útiles para realizar consultas a la base de datos a través del server (HttpClient)
    y para redirigir luego de modificar el combate.
   */
 

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.CombateForm =  this.formBuilder.group({
      id: new FormControl('',Validators.required),
      hito: new FormControl('',Validators.required),
      
    });
    this.idcombate=this.rutaActiva.snapshot.paramMap.get('id');

   }

  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca todos los datos
    actuales del combate. Además, se rellenan los campos con estos datos. 
  */

  async ngOnInit() {
    const result1 =  await this.getHito();
    this.CombateForm.patchValue({
      id: this.idcombate,
      hito: result1.hito
    });


    
  }

  
  /*
    Método que es llamado cuando se oprime el botón de modificar combate. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación, se desplegará el mensaje "Modificación exitosa de combate", en caso
    contrario, se despliega el mensaje "Error en modificación de combate". Además, se redirige al usuario a
    la pantalla en donde se muestran todos los combates.
  */


  onSubmit(){
    console.log("entre");
    if(this.CombateForm.value!=null){
      this.http.put('http://localhost:8000/modCombate/'+this.idcombate, this.CombateForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificación exitosa de combate').then(() => {
                this.router.navigate(['/combates/']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en modificación de combate',error).then(() => {
              this.router.navigate(['/combates']);
              
              }
            );
          
          });
          this.ngOnInit();
    }
  
  }

  // Método que obtiene el hito actual del combate en cuestión.

  async getHito(){
    this.hito = await this.http.get('http://localhost:8000/hito/'+this.idcombate).toPromise();
    return this.hito.data[0]
  }



}