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

  /*
    Variables utilizadas para poder desplegar correctamente todos los brigadistas de una brigada en particular correctamente.
    Además de poder eliminar a un brigadista en particular.

  */

  // Variable que almacena el número de la brigada del que se desean conocer sus brigadistas. Esto se obtiene de la ruta.

  n_brigada: any ;

  // Variable que almacena el nombre de la brigada de la que se desean conocer sus brigadistas. Esto se obtiene de la ruta.

  nombre_brigada: any;

  /* 
    Variable que contiene toda la información asociada a cada uno de los brigadistas de la brigada de la que se desea
    conocer a sus integrantes. 
  */ 

  brigadistas$: any = [];

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  /*
    En el constructor se obtiene el número de brigada y el nombre de la misma a través de la ruta,
    además cargo del usuario actual. Por otro lado, se declaran variables que serán útiles para realizar 
    consultas a la base de datos a través del server (HttpClient) y para obtener los valores de la ruta.
  */
  
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
    
    // Se obtiene el número de la brigada de la que se desean conocer sus brigadistas.

    this.n_brigada=this.rutaActiva.snapshot.paramMap.get('id');

    // Se obtiene el nombre de la brigada de la que se desean conocer sus brigadistas.

    this.nombre_brigada=this.rutaActiva.snapshot.paramMap.get('id2');
    
    // Se obtiene el cargo del usuario que está en la sesión actual.

    this.cargo=localStorage.getItem('cargo');
    
   }

    /*
      En el OnInit se llaman los métodos necesarios para que se muestren correctamente 
      todos los brigadistas y sus datos de la brigada en cuestión.
    */

   ngOnInit() {

    //Método que devuelve toda la información de todos los brigadistas de la brigada en cuestión.

    this.getBrigadistas();
    
    
  }

  /*
    Algo que destacar de este método, es que se envían a través de parámetros, datos que son necesarios
    para poder realizar correctamente la consulta que encuentre los brigadistas asociados a cierta brigada
    de acuerdo a su nombre y numero.
  */

  getBrigadistas(){
    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);
    

    this.http.get('http://3.13.114.248:8000/brigadistas',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.brigadistas$ = resp as []
    )

  }

  /*
    Método que se activa una vez que el Super-Administrador o el Administrador, deciden eliminar un brigadista en
    particular. La variable id corresponde al rut del brigadista escogido para eliminar. 
    Con este rut, se realiza una consulta delete al server y de acuerdo a la respuesta que este mismo entrege, 
    se despliega una pop-up en la pantalla. Si el server indica que se realizó correctamente el borrado, 
    se desplegará el mensaje "Borrado de brigadista completo", en caso contrario, se despliega el mensaje 
    "Error en el borrado de brigadista".
  */

  delBrig(id:string){
    

    if(confirm("¿Estás seguro de querer borrar al brigadista "+id+"?")) {

    
    this.http.delete('http://3.13.114.248:8000/delBrigadista/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Borrado de brigadista completo').then(
              function(){ 
                location.reload();
              }
            );

          },
          (error)=>{
            swal.fire('Error en el borrado de brigadista', error, 'success');

          });
  
    }
  }
}
