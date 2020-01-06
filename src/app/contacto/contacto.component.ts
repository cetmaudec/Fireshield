import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import swal from'sweetalert2';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})


export class ContactoComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar información de contacto, además de variables que permiten al usuario 
    poder contactarse por correo con los operadores.
  */

  // Variable de tipo FormGroup que permite trabajar el formulario de contacto por correo.

  ContactoForm: FormGroup;

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  /*
    En el constructor obtiene el cargo del usuario actual, además de inicializar el formulario con valores vacíos. 
    Por otro lado, se declaran una variable que será útil para realizar consultas a la base de datos a 
    través del server (HttpClient).
  */

  constructor(private formBuilder: FormBuilder,private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    this.ContactoForm = this.formBuilder.group({
      nombre: new FormControl(''),
      phone: new FormControl('', [Validators.minLength(9), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,4})?$')]),
      correo: new FormControl('', [Validators.email]),
      asunto: new FormControl(''),
      mensaje: new FormControl(''),



    });


   }

  ngOnInit() {
   
  
  }

  /*
    Método que es llamado cuando se oprime el botón de enviar correo. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente el enviado del correo, se desplegará el mensaje "Mensaje de contacto enviado exitosamente",
    en caso contrario, se despliega el mensaje "Error en envío de mensaje de contacto".
  */

  onSubmit(){ 
    if(this.ContactoForm.value!=null){
      this.http.post('http://localhost:8000/contacto', this.ContactoForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Mensaje de contacto enviado exitosamente.')
           
          },
          (error)=>{
            swal.fire('Error en envío de mensaje de contacto.', error) 
          });
          this.ngOnInit();
        }
  }
  

}
