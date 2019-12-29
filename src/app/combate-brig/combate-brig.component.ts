import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';

import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-combate-brig',
  templateUrl: './combate-brig.component.html',
  styleUrls: ['./combate-brig.component.css']
})
export class CombateBrigComponent implements OnInit {
  combatesBrig$: any = [];
  id: any ;
  brigadas$: any = [];
  addForm: FormGroup;
  cargo:any;
  
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private rutaActiva: ActivatedRoute,private router: Router) { 
    this.id=this.rutaActiva.snapshot.paramMap.get('id');
    this.cargo=localStorage.getItem('cargo');
  }

  async ngOnInit() {
    this.getCombates();
   this.getnBrigadas();
    this.addForm=this.formBuilder.group({
      n_brigada: ['', Validators.required],
      id:['', Validators.required]
    });
  }
  getCombates(){
    this.http.get('http://localhost:8000/combatesBrig'+this.id).subscribe(resp =>
      this.combatesBrig$ = resp as []
  
    )
   console.log("brasasasasdas"+this.combatesBrig$);
  }
   getnBrigadas(){
    this.http.get('http://localhost:8000/nbrigadas'+localStorage.getItem('user')).subscribe(resp =>
      this.brigadas$ = resp as []
    )
    console.log("hola   "+this.brigadas$)
  }
  
  retirar(n_brigada:string,nombre:string){
    console.log("me retiro")
    console.log(n_brigada)
    if(confirm("¿Estás seguro de querer retirarse del combate "+this.id+"?")) {
      console.log("Implement delete functionality here");

      let params = new HttpParams().set("n_brigada",n_brigada).set("id", this.id).set("nombre_brigada",nombre);
      
      
      this.http.delete('http://localhost:8000/updCombateBrig', { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).subscribe(
          (response ) => {
            swal.fire('Brigada retirada de combate correctamente').then(
              function(){ 
                location.reload();
              }
            );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error al retirarse de combate', error, 'success');
            console.log('error during post is ', error)
          });
  
    }
  }
  unir(id:string,n_brigada:string,nombre:string){
    console.log("unir "+id+" "+n_brigada);
    
    console.log("nombre "+nombre)
    let params = new HttpParams().set("n_brigada",n_brigada).set("id", id).set("nombre_brigada",nombre);
  
    let data = {
      n_brigada: n_brigada,
      id: id,
      nombre_brigada: nombre,
    };
      this.http.post('http://localhost:8000/unirseCombate',data, {headers: new HttpHeaders({'Content-Type':'application/json'})}).subscribe(
          (response ) => {
            console.log("responseeee"+response);
            swal.fire('Brigada unida a combate correctamente').then(() => {
              location.reload();
                
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
