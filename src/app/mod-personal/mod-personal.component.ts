import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mod-personal',
  templateUrl: './mod-personal.component.html',
  styleUrls: ['./mod-personal.component.css']
})
export class ModPersonalComponent implements OnInit {

  /*
    Variables utilizadas para poder modificar correctamente a un miembro del personal. 
  */

  // Variable que almacena el rut del personal que será modificado.

  rut:any;

  // Variable de tipo FormGroup que permite trabajar el formulario para modificar al miembro del personal.

  ModPersonalForm: FormGroup;

  // Variable que almacena toda la información personal del miembro del personal que se desea modificar.

  personal$:any;
  
   /*
    En el constructor se obtiene el rut del miembro del personal a través de la ruta, además de inicializar el formulario 
    con valores vacíos. Por otro lado, se declaran variables que serán útiles para realizar consultas a la 
    base de datos a través del server (HttpClient) y para redirigir luego de modificar el personal. Notar que el rut
    debe estar bien escrito para que pueda ser validado.
   */
 

  constructor(private rutaActiva: ActivatedRoute, private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.rut=this.rutaActiva.snapshot.paramMap.get('id');
    this.ModPersonalForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',[Validators.required, Validators.pattern('[0-9]+.+[0-9]+.+[0-9]+-[0-9kK]{1}$')]),
      cargo: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      usuario: new FormControl('',Validators.required),
      pass: new FormControl('',Validators.required)
    });

  }

  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca todos los datos
    actuales del personal. Además, se rellenan los campos con estos datos. 
  */


  async ngOnInit() {
    
    // Se obtienen los datos actuales del mimebro del personal, para luego rellenar los campos con eso.

    const result1 =  await this.getPersonal();
    this.ModPersonalForm.patchValue({
      nombre:result1.nombre,
      apellidoP:result1.apellidoP,
      apellidoM:result1.apellidoM,
      rut:result1.rut,
      correo:result1.correo,
      usuario:result1.usuario,
      pass:result1.pass,
      cargo:result1.cargo
    });

    

  }

   /*
    Método que es llamado cuando se oprime el botón de modificar personal. Se realiza un put en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la modificación, se desplegará el mensaje "Modificado con éxito", en caso
    contrario, se despliega el mensaje "Error en la modificación de los datos del usuario". Además, se redirige al usuario a
    la pantalla en donde se muestran todos los miembros del personal.
  */

  onSubmit(){
    if(this.ModPersonalForm.value!=null){
      
      this.http.put('http://localhost:8000/modUsuario/'+this.rut, this.ModPersonalForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificado con éxito.').then(() => {
              this.router.navigate(['/personal']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en la modificación de los datos del usuario.', error).then(() => {
              this.router.navigate(['/personal']);
              
              }
            );
          
          });
          this.ngOnInit();  
          
    }
      
  }


  async getPersonal(){
    this.personal$ = await this.http.get('http://localhost:8000/personal/'+this.rut).toPromise();
    return this.personal$.data[0];
  }

}
