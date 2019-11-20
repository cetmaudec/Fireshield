import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  ContactoForm: FormGroup;
  mensaje:string='';

  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {

    this.ContactoForm = this.formBuilder.group({
      nombre: new FormControl(''),
      phone: new FormControl('', [Validators.minLength(9), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,4})?$')]),
      correo: new FormControl('', [Validators.email]),
      asunto: new FormControl(''),
      mensaje: new FormControl(''),



    });

   }

  ngOnInit() {
    console.log("entro");
    

  }

  onSubmit(){ 
    if(this.ContactoForm.value!=null){
      this.http.post('http://localhost:8000/contacto', this.ContactoForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Mensaje de contacto enviado exitosamente.')
           
          },
          (error)=>{
            swal.fire('Error en envío de mensaje de contacto.', error) 
          });
          this.ngOnInit();
        }
  }
  

}
