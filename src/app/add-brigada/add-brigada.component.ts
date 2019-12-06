import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
@Component({
  selector: 'app-add-brigada',
  templateUrl: './add-brigada.component.html',
  styleUrls: ['./add-brigada.component.css']
})
export class AddBrigadaComponent implements OnInit {
  BrigadaForm: FormGroup;
  brigadas$: any = [];
  brigadas2$: any =[];
  nombresbrigadas$: any=[];
  nombresbrigadas2$: any=[];
  jefes$: any = [];
  jefes2$: any = [];


  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.BrigadaForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      n_brigada: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
    });
    
  }

  async ngOnInit() {
    this.nombresbrigadas$ = await this.getBrigadas();
    this.getnBrigadas("Alerce");
    console.log(this.nombresbrigadas$);
    console.log(this.brigadas$);
    this.jefes$ = await this.getJefes();
    console.log(this.jefes$);
  }

  async getBrigadas(){
    this.nombresbrigadas2$= await this.http.get('http://localhost:8000/nombresbrigadas').toPromise();
    return this.nombresbrigadas2$.data;
    
  }

  async getnBrigadas(nombre){
    this.brigadas$= await this.http.get('http://localhost:8000/maxbrigada' + nombre).toPromise();
   
  }

  onSubmit(){
    console.log("entre");
    if(this.BrigadaForm.value!=null){
      this.http.post('http://localhost:8000/addBrigada', this.BrigadaForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de brigada').then(() => {
                this.router.navigate(['/brigadas']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de brigada',error.error).then(() => {
              this.router.navigate(['/brigadas']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
      }
    
     
  

 
async getJefes(){
  this.jefes2$=await this.http.get('http://localhost:8000/jefes').toPromise();
  return this.jefes2$.data;
  
}

onChange(deviceValue) {
  console.log(deviceValue);

  this.getnBrigadas(deviceValue);


}

}
