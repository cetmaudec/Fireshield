import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { BrigadasComponent } from '../brigadas/brigadas.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-unirse-combate',
  templateUrl: './unirse-combate.component.html',
  styleUrls: ['./unirse-combate.component.css']
})
export class UnirseCombateComponent implements OnInit {
  id_combate:any;
  rut:any;
  brigadas$: any = [];
  unirseForm: FormGroup;
  cargo:any;
  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.id_combate=this.rutaActiva.snapshot.paramMap.get('id');
    this.unirseForm =  this.formBuilder.group({
      n_brigada: new FormControl('',Validators.required),
     
      id: new FormControl('',Validators.required)
    });
    
   }

  ngOnInit() {
   
    this.getnBrigadas();
    
    this.unirseForm.patchValue({
      
      id:this.id_combate,
      
      
    })
    this.rut =localStorage.getItem('user');
    console.log(this.rut)

  }
  async getnBrigadas(){
    this.brigadas$ = await this.http.get('http://localhost:8000/nbrigadas'+localStorage.getItem('user')).toPromise();
    console.log("holaaaa "+this.brigadas$.data[2].nombre);
      
  }

  onSubmit(){
    console.log("llegueee")
    if(this.unirseForm.value!=null){
      console.log(this.unirseForm.value)
      this.http.post('http://localhost:8000/unirseCombate2', this.unirseForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log("responseeee"+response);
            swal.fire('Brigada unida a combate correctamente').then(() => {
              this.router.navigate(['/combateBrig/'+this.id_combate]);
                
              }
            );
           
          },
          (error)=>{
            console.log("errro"+error.error);
            swal.fire('Error al unir a combate', error.error).then(() => {
              this.router.navigate(['/combates']);
              
              }
            );
          
          });
          this.ngOnInit();
          
        }
       
  }

}
