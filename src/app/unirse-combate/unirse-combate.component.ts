import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import Swal from'sweetalert2';
import { environment } from '../environment';

@Component({
  selector: 'app-unirse-combate',
  templateUrl: './unirse-combate.component.html',
  styleUrls: ['./unirse-combate.component.css']
})
export class UnirseCombateComponent implements OnInit {

  /*
    Variables utilizadas para que los jefes de brigada puedan unir alguna de sus brigadas a un combate en especifico. 
  */

  // Variable que almacena el id de combate al cual el jefe de brigada desea unir alguna de sus brigadas. Se obtiene por ruta.

  id_combate:any;

  // Variable que obtiene el rut del usuario actual.

  rut:any;

  /*
    Variable que almacena la informacion de todas las brigadas que están a cargo del usuario. Solo corresponde para jefes de 
    brigada.
  */
  
  brigadas$: any = [];
  
  // Variable de tipo FormGroup que permite trabajar el formulario para unirse a cierto combate.

  unirseForm: FormGroup;

  // Variable que almacena el cargo del usuario de la sesión actual.
  
  cargo:any;

  cantidad_brigadistas: any = 0;

  /*
    En el constructor se obtiene el cargo del usuario actual, además de inicializar el formulario con valores vacíos. 
    Por otro lado, se declaran variables que serán útiles para realizar consultas a la base de datos a través 
    del server (HttpClient) y para redirigir luego de unirse al combate.
  */

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.rut =localStorage.getItem('user');
    this.id_combate=this.rutaActiva.snapshot.paramMap.get('id');

    this.unirseForm =  this.formBuilder.group({
      n_brigada: new FormControl('',Validators.required),
      id: new FormControl('',Validators.required)
    });
    
   }

  // En el OnInit, se obtienen todas las brigadas pertenecientes al usuario de la sesión actual. 

  ngOnInit() {
    this.getnBrigadas();
    this.unirseForm.patchValue({
      id:this.id_combate,
    }) 
  }

  async getnBrigadas(){
    this.brigadas$ = await this.http.get(environment.urlAddress+'select/brigadainactiva'+this.rut).toPromise();   
  }

  async getnBrigadistas(numero: any, nombre: any){
    let params = new HttpParams().set("numero", numero).set("nombre",nombre);
    let cont_brigada$ = await this.http.get(environment.urlAddress+'count/brigadista', { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params:params}).toPromise();
    return cont_brigada$;
  }

  /*
    Método que es llamado cuando se oprime el botón de unirse. Se realiza un post en el server y de
    acuerdo a la respuesta que este mismo entrege, se despliega una pop-up en la pantalla. Si el server indica
    que se realizó correctamente la inserción, se desplegará el mensaje "Brigada unida a combate correctamente", en caso
    contrario, se despliega el mensaje "Error al unir a combate". Además, se redirige al usuario a
    la pantalla en donde se muestran todos los combates por brigada.
  */

  onSubmit(){
    if(this.unirseForm.value!=null){
      if(this.cantidad_brigadistas.data[0].cantidad>=1){
        this.http.post(environment.urlAddress+'insert/combate/brigada', this.unirseForm.value, 
          {headers: new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(
          response =>  
            this.insert_fatiga(this.id_combate, this.unirseForm.value.n_brigada.numero,this.unirseForm.value.n_brigada.nombre),
          err => 
            console.log(err)
        )
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Oops!',
          text: 'La brigada que desea añadir al combate no tiene brigadistas asociados'
        })
      } 
    }
  }


  async selectBrigada(event: Event) {
    let nombre = this.unirseForm.value.n_brigada.nombre;
    let numero = this.unirseForm.value.n_brigada.numero;
    this.cantidad_brigadistas =  await this.getnBrigadistas(numero, nombre);
  }
  
  insert_fatiga(id:string, n_brigada:string, nombre:string){
    let data = {
      'n_brigada': n_brigada,
      'id': id,
      'nombre_brigada': nombre,
    };
    this.http.post(environment.urlAddress+'insert/fatiga', data, 
        {headers: new HttpHeaders({'Content-Type':'application/json'})}).subscribe(
          response =>  Swal.fire({
                icon: 'success',
                title: 'Brigada unida a combate correctamente!',
                confirmButtonText: 'Ok!'
                }).then((result) => {
                  console.log("prueba");
                  this.router.navigate(['/combate/brigada/'+this.id_combate]);
                }) ,
          err => Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Ha ocurrido un error, vuelva a intentarlo'
          })
        );
  }

}
