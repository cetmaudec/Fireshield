import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import Swal from'sweetalert2'
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';




/*   import { environment } from '../environment';

 this.http.put(environment.urlAddress+'cliente/correo/update', dataCorreo, {responseType: 'text'}) */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /*
    Variables utilizadas para que el usuario pueda logearse correctamente. 
  */

  // Variable de tipo FormGroup que permite trabajar el formulario de login.

  LoginForm: FormGroup;
  
  /*
    En el constructor se inicializa el formulario con valores vacíos. Además, se declaran variables que serán útiles
    para redirigir luego de logearse y para autentificar que es un usuario registrado.
  */

  constructor(private router: Router,private formBuilder: FormBuilder,private auth: AuthService ) {
    this.LoginForm =  this.formBuilder.group({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      
    });
   }

  /*
    El método onInit lo único que realiza, es llamar al servicio de autentificación y deslogear al último usuario que estuviese
    logeado.
  */
   
  ngOnInit() {
    
  }

   /*
    Método que es llamado cuando se oprime el botón de iniciar sesión. Si el usuario está registrado, será redirigido al
    home, en caso contrario se dirá que el usuario y/o contraseña son incorrectos.
  */

  async loginUser(){
    this.auth.login(this.LoginForm.value.username, this.LoginForm.value.password).pipe(first()).subscribe( 
      (response ) => {
            if(response=='Activo'){
              this.router.navigate(['/estado']);
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'Usuario en espera',
                text: 'Tu solicitud de registro aún no ha sido aceptada'
              })
            }
          },
      (error)=>{
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario y/o Contraseña Incorrecta'
          })
      });   
  }
  
  register(){
    this.router.navigate(['/registro'])
  }
}

