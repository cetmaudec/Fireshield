import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';



import swal from'sweetalert2';
@Component({
  selector: 'app-brigadistas',
  templateUrl: './brigadistas.component.html',
  styleUrls: ['./brigadistas.component.css']
})
export class BrigadistasComponent implements OnInit {
  n_brigada: any ;
  nombre_brigada: any;
  brigadistas$: any = [];
  cargo:any;
  
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre_brigada=this.rutaActiva.snapshot.paramMap.get('id2');
    
    this.cargo=localStorage.getItem('cargo');
    
   }

   ngOnInit() {
    this.getBrigadistas();
    
    
  }
  getBrigadistas(){
    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);
    
    console.log(this.n_brigada);
    console.log(this.nombre_brigada);
    this.http.get('http://localhost:8000/brigadistas',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.brigadistas$ = resp as []
    )
   console.log(URL);
  }
  delBrig(id:string){
    

    if(confirm("¿Estás seguro de querer borrar al brigadista "+id+"?")) {
      console.log("Implement delete functionality here");
    
    this.http.delete('http://localhost:8000/delBrigadista/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Borrado de brigadista completo').then(
              function(){ 
                location.reload();
              }
            );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error en el borrado de brigadista', error, 'success');
            console.log('error during post is ', error)
          });
  
    }
  }
}
