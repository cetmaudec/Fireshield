import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-combates',
  templateUrl: './combates.component.html',
  styleUrls: ['./combates.component.css']
})
export class CombatesComponent implements OnInit {
  combates$: any = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCombates();
    console.log(localStorage.getItem('user'));
  }
  getCombates(){
    this.http.get('http://localhost:8000/combates').subscribe(resp =>
      this.combates$ = resp as []
  
    )
   console.log("brigadas"+this.combates$);
  }
  delCombate(id:string){
    if(confirm("¿Estás seguro de querer borrar el combate "+id+"?")) {
      console.log("Implement delete functionality here");
    
    this.http.delete('http://localhost:8000/delCombate/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Borrado de combate completo').then(() => {
              location.reload();
              
            }
          );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error en el borrado de combate', error, 'success');
            console.log('error during post is ', error)
          });
  
    }
  }

}
