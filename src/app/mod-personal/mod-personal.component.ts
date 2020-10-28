import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../environment';

@Component({
  selector: 'app-mod-personal',
  templateUrl: './mod-personal.component.html',
  styleUrls: ['./mod-personal.component.css']
})
export class ModPersonalComponent implements OnInit{

  /*
    Variables utilizadas para poder modificar correctamente a un miembro del personal. 
  */

  // Variable que almacena el rut del personal que será modificado.

  rut:any;

  // Variable de tipo FormGroup que permite trabajar el formulario para modificar al miembro del personal.

  ModPersonalForm: FormGroup;

  // Variable que almacena toda la información personal del miembro del personal que se desea modificar.

  personal$:any;
  edit_brigada: Boolean = false;
  edit_user: Boolean = false;

  password: any;
  confirmPassword: any;
  confirm = false;

   /*
    En el constructor se obtiene el rut del miembro del personal a través de la ruta, además de inicializar el formulario 
    con valores vacíos. Por otro lado, se declaran variables que serán útiles para realizar consultas a la 
    base de datos a través del server (HttpClient) y para redirigir luego de modificar el personal. Notar que el rut
    debe estar bien escrito para que pueda ser validado.
   */
 

  constructor(private rutaActiva: ActivatedRoute, private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.rut=this.rutaActiva.snapshot.paramMap.get('id');
    this.ModPersonalForm =  this.formBuilder.group({
      cargo: new FormControl('',Validators.required),
      pass: new FormControl('',Validators.required)
    });

  }

  /*
    En el OnInit se llaman los métodos necesarios para que al iniciar el formulario, este conozca todos los datos
    actuales del personal. Además, se rellenan los campos con estos datos. 
  */
  async ngOnInit() {
    this.personal$ = this.getPersonal();
    console.log(this.personal$);
  }

  EditUsuario(){
    const data_usuario = { 
      'password': this.ModPersonalForm.get('pass').value
    }
    if(this.ModPersonalForm!=null){
      this.http.put(environment.urlAddress+'update/usuario/set/password/'+this.rut, data_usuario, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Modificación exitosa de su contraseña!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['/personal']); 
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

  EditBrigada(){
    const data_brigada = { 
      'cargo': this.ModPersonalForm.get('cargo').value
    }
    if(this.ModPersonalForm.value!=null){
      this.http.put(environment.urlAddress+'update/usuario/set/cargo/'+this.rut, data_brigada, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Modificación exitosa del cargo de personal!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['/personal']);
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

  async getPersonal(){
    this.personal$ = await this.http.get(environment.urlAddress+'select/usuario/personal/'+this.rut).toPromise();
    return this.personal$;
  }


  EditInfo(group: any){
    console.log(group);
    if(group == 'brigada'){
      this.edit_brigada = true;
      console.log(this.edit_brigada);
    }else if(group == 'usuario'){
      this.edit_user = true;
      console.log(this.edit_user);
    }else{
      this.edit_brigada = false;
      this.edit_user = false;
    }
  }

  getPassword(event: Event){
    this.password = (event.target as HTMLInputElement).value;
    console.log(this.password);
  }

  getconfirmPassword(event: Event){
    this.confirmPassword = (event.target as HTMLInputElement).value;
    console.log(this.password +" = "+this.confirmPassword);
    if(this.confirmPassword==this.password){
      this.confirm=true;
    }else{
      this.confirm=false;
    }
  }

}
