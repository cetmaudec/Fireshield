import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { BrigadasComponent } from '../brigadas/brigadas.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  RegistroForm: FormGroup;
  
  mensaje:string='';

    
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.RegistroForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      usuario: new FormControl('',Validators.required),
      pass: new FormControl('',Validators.required)
    });

  }

  ngOnInit() {

    

  }

  onSubmit(){
    if(this.RegistroForm.value!=null){
      this.http.post('http://localhost:8000/addUsuario', this.RegistroForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
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
