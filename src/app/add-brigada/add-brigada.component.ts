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
  jefes$: any = [];

  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.BrigadaForm =  this.formBuilder.group({
      n_brigada: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
    });
  }

  ngOnInit() {
    this.getnBrigadas();
    this.getJefes();
  }

  async getnBrigadas(){
    this.brigadas$= await this.http.get('http://localhost:8000/maxbrigada').toPromise();
    console.log(this.brigadas$);
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
  this.jefes$=await this.http.get('http://localhost:8000/jefes').toPromise();
    
  console.log(this.jefes$);
}

}
