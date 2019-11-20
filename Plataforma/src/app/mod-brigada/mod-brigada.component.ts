import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { from } from 'rxjs';

@Component({
  selector: 'app-mod-brigada',
  templateUrl: './mod-brigada.component.html',
  styleUrls: ['./mod-brigada.component.css']
})
export class ModBrigadaComponent implements OnInit {
  brig: any ;
  brigada$: any;
  modBrigadaForm: FormGroup;
  jefes$: any = [];
  brigadas$: any = [];
  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
      this.brig=this.rutaActiva.snapshot.paramMap.get('id');
      this.modBrigadaForm =  this.formBuilder.group({
        n_brigada: new FormControl('',Validators.required),
        rut: new FormControl('',Validators.required),    
      });
  }

  async ngOnInit() {
    const result1 =  await this.getJefeBrigada();
    console.log("hola "+result1)
    this.modBrigadaForm.patchValue({
      n_brigada: this.brig,
     
     
    })
    
    this.getJefes();
    this.getnBrigadas();
  }

  async getJefeBrigada(){
    this.brigada$ = await this.http.get('http://localhost:8000/jefeBrigada/'+this.brig).toPromise();
    return this.brigada$.data[0];
    
  }
  onSubmit(){
    if(this.modBrigadaForm.value!=null){
      this.http.put('http://localhost:8000/modBrigada/'+this.brig, this.modBrigadaForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificación exitosa de brigada').then(() => {
                this.router.navigate(['/brigadas']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en modificación de brigada',error).then(() => {
              this.router.navigate(['/brigadas']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
  }
  
  async getJefes(){
    this.jefes$ = await this.http.get('http://localhost:8000/jefes').toPromise();
    return this.jefes$;
  }
  async getnBrigadas(){
    this.brigadas$ = await this.http.get('http://localhost:8000/nbrigadas').toPromise();
    console.log(this.brigadas$)
        
      
  }

}
