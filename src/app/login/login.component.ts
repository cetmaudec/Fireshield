import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import swal from'sweetalert2'
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';

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
    this.auth.logout();
    
  }

   /*
    Método que es llamado cuando se oprime el botón de iniciar sesión. Si el usuario está registrado, será redirigido al
    home, en caso contrario se dirá que el usuario y/o contraseña son incorrectos.
  */

  public onSubmit() {
    console.log(this.LoginForm.value.password);
    this.auth.login(this.LoginForm.value.username, this.LoginForm.value.password)
      .pipe(first())
      .subscribe( 
        result => this.router.navigate(['/home']),
        err => swal.fire('Usuario y/o Contraseña Incorrecta')
  
      );

  }
  
}
