import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import swal from'sweetalert2';
@Component({
  selector: 'app-brigadas',
  templateUrl: './brigadas.component.html',
  styleUrls: ['./brigadas.component.css']
})
export class BrigadasComponent implements OnInit {

  /*
    Variables utilizadas para poder desplegar correctamente todas las brigadas existentes, además de poder eliminar
    alguna en particular. 
  */

  /*
    Variable que contiene el rut, nombre, apellido paterno y apellido materno de todos los jefes de brigadas, además
    de los números y nombres de sus respectivas brigadas.
  */

  brigadas$: any = [];
  
  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  /*
    Variable que almacena el rut que posee el actual usuario que está en la sesión actual. Esto sirve para que si
    el usuario es un jefe de brigada, solo pueda ver las brigadas que tiene bajo su cargo.
  */

  rut_jefe:any;

  /*
    En el constructor se obtiene el cargo y el rut del usuario actual. Además, se declara una variable que será útil
    para realizar consultas a la base de datos a través del server (HttpClient).
  */

  constructor(private http: HttpClient) { 
    this.cargo=localStorage.getItem('cargo');
    this.rut_jefe=localStorage.getItem('user');
  }

  /*
    En el OnInit se llaman los métodos necesarios para que se muestren correctamente 
    todas las brigadas con sus respectivos jefes de brigada.
  */
  
  ngOnInit() {

    // Método que devuelve los jefes de brigada con sus brigadas asociadas.

    this.getBrigadas();

  }

  getBrigadas(){
    this.http.get('http://localhost:8000/brigadas').subscribe(resp =>
      this.brigadas$ = resp as []
  
    )
  }

  /*
    Método que se activa una vez que el Super-Administrador o el Administrador, deciden eliminar una brigada en
    particular. La variable id2 corresponde al nombre de la brigada escogida para eliminar, y la variable 
    id corresponde al número de la brigada escogida para eliminar. Con estos dos valores, se realiza una consulta
    delete al server y de acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. 
    Si el server indica que se realizó correctamente el borrado, se desplegará el mensaje "Borrado de brigada completa"
    , en caso contrario, se despliega el mensaje "Error en el borrado de brigada".
  */
  delBrigada(id:string, id2:string){
    
    if(confirm("¿Estás seguro de querer borrar la brigada "+id2 + "-" + id+"?")) {
      let params = new HttpParams().set("n_brigada", id).set("nombre",id2);
      console.log("Implement delete functionality here");
    
    this.http.delete('http://localhost:8000/delBrigada', { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).subscribe(
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
