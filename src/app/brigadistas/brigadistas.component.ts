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
  brig: any ;
  brig2: any;
  brigadistas$: any = [];
  cargo:any;
  
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    this.brig=this.rutaActiva.snapshot.paramMap.get('id');
    this.brig2=this.rutaActiva.snapshot.paramMap.get('id2');
    console.log(this.brig2);
    this.cargo=localStorage.getItem('cargo');
    
   }

   ngOnInit() {
    this.getBrigadistas();
    
    
  }
  getBrigadistas(){
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('id', this.brig);


    console.log(this.brig);
    this.http.get('http://localhost:8000/brigadistas/'+this.brig).subscribe(resp =>
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
