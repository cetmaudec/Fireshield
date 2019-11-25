import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-mod-personal',
  templateUrl: './mod-personal.component.html',
  styleUrls: ['./mod-personal.component.css']
})
export class ModPersonalComponent implements OnInit {
  rut:any;
  ModPersonalForm: FormGroup;
  personal$:any;
  mensaje:string='';


  constructor(private rutaActiva: ActivatedRoute, private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.rut=this.rutaActiva.snapshot.paramMap.get('id');
    this.ModPersonalForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      rut: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      usuario: new FormControl('',Validators.required),
      pass: new FormControl('',Validators.required)
    });

  }

  async ngOnInit() {
    const result1 =  await this.getPersonal();
    console.log(result1);
    this.ModPersonalForm.patchValue({
      nombre:result1.nombre,
      apellidoP:result1.apellidoP,
      apellidoM:result1.apellidoM,
      rut:result1.rut,
      correo:result1.correo,
      usuario:result1.usuario,
      pass:result1.pass,
      cargo:result1.cargo
    });
    console.log(this.ModPersonalForm.value.pass)


    

  }

  onSubmit(){
    if(this.ModPersonalForm.value!=null){
      
      this.http.put('http://localhost:8000/modUsuario/'+this.rut, this.ModPersonalForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificado con éxito.').then(() => {
              this.router.navigate(['/personal']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en la modificación de los datos del usuario.', error).then(() => {
              this.router.navigate(['/personal']);
              
              }
            );
          
          });
          this.ngOnInit();  
          
    }
      
  }
  async getPersonal(){
    this.personal$ = await this.http.get('http://localhost:8000/personal/'+this.rut).toPromise();
    return this.personal$.data[0];
  }

}
