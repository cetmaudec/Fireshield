import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
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
  LoginForm: FormGroup;
  public error: string;
  constructor(private router: Router,private formBuilder: FormBuilder,private auth: AuthService ) {
    this.LoginForm =  this.formBuilder.group({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      
    });
   }

  ngOnInit() {
    this.auth.logout();
    
  }


  public onSubmit() {
    console.log(this.LoginForm.value.password);
    this.auth.login(this.LoginForm.value.username, this.LoginForm.value.password)
      .pipe(first())
      .subscribe( 
        result => this.router.navigate(['/home']),
        err => swal.fire('Usuario y/o Contraseña Incorrecta')
  
      );
      //swal.fire('Error en el borrado de brigada', this.error, 'success');
  }
  
}
