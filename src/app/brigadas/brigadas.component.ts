import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import Swal from'sweetalert2';
import { environment } from '../environment';


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
  brigadasJefe$: any = [];
  
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
    console.log(this.cargo);
  }

  /*
    En el OnInit se llaman los métodos necesarios para que se muestren correctamente 
    todas las brigadas con sus respectivos jefes de brigada.
  */
  
  async ngOnInit() {
    // Método que devuelve los jefes de brigada con sus brigadas asociadas.
    this.brigadas$ = await this.getBrigadas();
    this.brigadasJefe$ = await this.getBrigadasJefe();
  }

  async getBrigadas(){
    this.brigadas$ = await this.http.get(environment.urlAddress+'select/brigadas/usuario').toPromise();
    return this.brigadas$;
  }

  async getBrigadasJefe(){
    this.brigadasJefe$ = await this.http.get(environment.urlAddress+'select/brigada/'+this.rut_jefe).toPromise();
    return this.brigadasJefe$;
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
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de querer borrar la brigada '+id2 + '-' + id+'?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      let params = new HttpParams().set("n_brigada", id).set("nombre",id2);
      console.log(result);
    /* Read more about isConfirmed, isDenied below */
     if (result.value) {
        this.http.delete(environment.urlAddress+'delete/brigada', { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params: params}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Brigada borrada exitosamente!',
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


  // Método que permite que el usuario pueda acceder a las diferentes opciones del menú de combate (Activos, Todos y Añadir).
  openCity(cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
  }

}
