import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import Swal from'sweetalert2';
import { environment } from '../environment';


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

  async ngOnInit() {
    //Método que devuelve toda la información de todos los brigadistas de la brigada en cuestión.
    this.brigadistas$= await this.getBrigadistas();
  }

  /*
    Algo que destacar de este método, es que se envían a través de parámetros, datos que son necesarios
    para poder realizar correctamente la consulta que encuentre los brigadistas asociados a cierta brigada
    de acuerdo a su nombre y numero.
  */
  async getBrigadistas(){
    let params = new HttpParams().set("n_brigada", this.n_brigada).set("nombre",this.nombre_brigada);
    this.brigadistas$ = await this.http.get(environment.urlAddress+'brigadistas',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    
    return this.brigadistas$;
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
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de querer borrar al brigadista '+id+'?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
     if (result.value) {
        this.http.delete(environment.urlAddress+'delete/brigadista/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Brigadista eliminado exitosamente!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                   location.reload();
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
        );  
      }
    });
  }
}
