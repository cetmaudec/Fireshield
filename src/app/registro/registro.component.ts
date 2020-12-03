import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { environment } from '../environment';

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
  
  password: any;
  confirmPassword: any;
  confirm = false;
  userExist = false;

  users : any = [];

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
      password: new FormControl('',Validators.required)
    });

  }

  async ngOnInit() {
    this.users = await this.getUsuario();
    console.log(this.users);

  }


  async getUsuario(){
      this.users = await this.http.get(environment.urlAddress+'select/usuario/rut').toPromise();
      return this.users;
    }

  
  /*
    Método que es llamado cuando se oprime el botón de registrar. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Solicitud enviada con éxito", en caso
    contrario, se despliega el mensaje "Error en el envío de la solicitud de registro". Además, se redirige al usuario a
    la pantalla de login.
  */

  onSubmit(){
    if(this.userExist==true){
      Swal.fire({
        icon: 'warning',
        title:'Usuario ya existente!',
        confirmButtonText: 'Ok!'
        });
    }else if(this.RegistroForm.value!=null){
      this.http.post(environment.urlAddress+'insert/usuario', this.RegistroForm.value, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title:'Solicitud de usuario enviada!',
                text: 'Espere a que su solicitud sea aceptada.',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['']);
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

  verificarUsuario(event: Event){
    this.userExist = false;
      var newUser = (event.target as HTMLInputElement).value;
      for(let user of this.users.data){                                                                                                                                                                                                                                                                                             
        if(newUser == user.rut){
          this.userExist = true;
        } 
      }
    }

  getPassword(event: Event){
    this.password = (event.target as HTMLInputElement).value;
  }

  getconfirmPassword(event: Event){
    this.confirmPassword = (event.target as HTMLInputElement).value;
    if(this.confirmPassword==this.password){
      this.confirm=true;
    }else{
      this.confirm=false;
    }
  }


}
