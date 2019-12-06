import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
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
  brig2: any;
  brigada$: any;
  modBrigadaForm: FormGroup;
  jefes$: any = [];
  brigadas$: any = [];
  datos: any;

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
      this.brig=this.rutaActiva.snapshot.paramMap.get('id');
      console.log(this.brig);
      this.brig2 = this.rutaActiva.snapshot.paramMap.get('id2');
    
      this.datos =
        {
          "numero" : this.brig,
          "nombre" : this.brig2
        }
       



     
      
      this.modBrigadaForm =  this.formBuilder.group({

        rut: new FormControl('',Validators.required),    
      });
  }

  async ngOnInit() {
    
    console.log("hola soy datos : " + this.datos);
    const result1 =  await this.getJefeBrigada();
    console.log("hola soy result1 " + result1);
    this.modBrigadaForm = this.formBuilder.group({
      rut: [result1]
    });
    
    console.log("hola "+result1)
    
    
    this.getJefes();




    //this.getnBrigadas();

  }

  async getJefeBrigada(){
    let params = new HttpParams().set("n_brigada", this.brig).set("nombre",this.brig2);
    this.brigada$ = await this.http.get('http://localhost:8000/jefeBrigada',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
    console.log(this.brigada$.data[0].rut_jefe);
    return this.brigada$.data[0].rut_jefe;
    
  }
  onSubmit(){
    if(this.modBrigadaForm.value!=null){
      let params = new HttpParams().set("n_brigada", this.brig).set("nombre",this.brig2);
      this.http.put('http://localhost:8000/modBrigada/', this.modBrigadaForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).subscribe(
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
