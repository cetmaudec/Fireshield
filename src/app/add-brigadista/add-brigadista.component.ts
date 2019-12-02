import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { BrigadasComponent } from '../brigadas/brigadas.component';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-brigadista',
  templateUrl: './add-brigadista.component.html',
  styleUrls: ['./add-brigadista.component.css']
})
export class AddBrigadistaComponent implements OnInit {
  BrigadistaForm: FormGroup;
  brigadas$: any = [];
  mensaje:string='';
  pulsera$:any=[];
  pulserasNoUsadas$:any=[];

 
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.BrigadistaForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',[Validators.required, Validators.pattern('[0-9]+.+[0-9]+.+[0-9]+-[0-9kK]{1}$')]),
      f_nacimiento: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      n_brigada: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      peso: new FormControl('',Validators.required),
      altura: new FormControl('',Validators.required),
      pulsera: new FormControl('',Validators.required),
      
    });
  }

  ngOnInit() {
    this.getnBrigadas();
    this.getPulseras();
    this.getPulserasNoUsadas();
    console.log("hola");
  }
  onSubmit(){
    console.log("entre");
    if(this.BrigadistaForm.value!=null){
      this.http.post('http://localhost:8000/addBrigadista', this.BrigadistaForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de brigadista').then(() => {
                this.router.navigate(['/brigadistas/'+this.BrigadistaForm.value.n_brigada]);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de brigadista',error).then(() => {
              this.router.navigate(['/brigadas']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
      }
  getnBrigadas(){
      this.http.get('http://localhost:8000/nbrigadas').subscribe(resp =>
      this.brigadas$ = resp as []
  
    )
    console.log(this.brigadas$);
  }
  getPulseras(){
    this.http.get('http://localhost:8000/npulseras').subscribe(resp =>
      this.pulsera$ = resp as []
  
    )
    console.log(this.pulsera$);
  }
  getPulserasNoUsadas(){
    this.http.get('http://localhost:8000/pulserasnousadas').subscribe(resp =>
      this.pulserasNoUsadas$ = resp as []
  
    )
    console.log(this.pulsera$);
  }
  	
}