import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
@Component({
  selector: 'app-brigadas',
  templateUrl: './brigadas.component.html',
  styleUrls: ['./brigadas.component.css']
})
export class BrigadasComponent implements OnInit {
  brigadas$: any = [];
  cargo:any;
  rut_jefe:any;
  constructor(private http: HttpClient,private router: Router) { 
    this.cargo=localStorage.getItem('cargo');
    this.rut_jefe=localStorage.getItem('user');
  }
  
  ngOnInit() {
    this.getBrigadas();
    console.log("hola");
  }
  getBrigadas(){
    this.http.get('http://localhost:8000/brigadas').subscribe(resp =>
      this.brigadas$ = resp as []
  
    )
   console.log("brigadas"+this.brigadas$);
  }
  delBrigada(id:string){
    if(confirm("¿Estás seguro de querer borrar la brigada "+id+"?")) {
      console.log("Implement delete functionality here");
    
    this.http.delete('http://localhost:8000/delBrigada/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Borrado de brigada completa').then(() => {
              location.reload();
              
            }
          );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error en el borrado de brigada', error, 'success');
            console.log('error during post is ', error)
          });
  
    }
  }
}
