import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  /*
    Variables utilizadas para que las personas puedan enviar solicitudes de registro. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario para enviar una solicitud de registro.

  RegistroForm: FormGroup;
  
  /*
    En el constructor se inicializa el formulario con valores vacíos. Por otro lado, se declaran variables que 
    serán útiles para realizar consultas a la base de datos a través del server (HttpClient) y 
    para redirigir luego de modificar el personal. Notar que el rut debe estar bien escrito para que pueda ser validado.
  */

  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.RegistroForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',[Validators.required, Validators.pattern('[0-9]+.+[0-9]+.+[0-9]+-[0-9kK]{1}$')]),
      cargo: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      pass: new FormControl('',Validators.required)
    });

  }

  ngOnInit() {

    

  }

  
  /*
    Método que es llamado cuando se oprime el botón de registrar. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Solicitud enviada con éxito", en caso
    contrario, se despliega el mensaje "Error en el envío de la solicitud de registro". Además, se redirige al usuario a
    la pantalla de login.
  */

  onSubmit(){
    if(this.RegistroForm.value!=null){
      this.http.post('http://3.13.114.248:8000/addUsuario', this.RegistroForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Solicitud enviada con éxito.').then(() => {
                this.router.navigate(['']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el envío de la solicitud de registro.',error).then(() => {
              this.router.navigate(['']);
              
              }
            );
          
          });
          this.ngOnInit();  
          
    }
         
  }


}
