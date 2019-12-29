import { Component, OnInit ,NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { BrigadasComponent } from '../brigadas/brigadas.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mod-brigadista',
  templateUrl: './mod-brigadista.component.html',
  styleUrls: ['./mod-brigadista.component.css']
})
export class ModBrigadistaComponent implements OnInit {
  rut: any ;
  brigadas$: any = [];
  pulsera$:any=[];
  modBrigForm: FormGroup;
  brigadista$:any;
  pulserasNoUsadas$:any=[];
  act$:any=[];
  nombresbrigadas$: any;
  nombresbrigadas2$:any;
  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.rut=this.rutaActiva.snapshot.paramMap.get('id');
    console.log(this.rut);
    this.modBrigForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),
      nombre_brigada: new FormControl('',Validators.required),
      correo: new FormControl('',[Validators.required, Validators.email]),
      n_brigada: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      peso: new FormControl('',Validators.required),
      altura: new FormControl('',Validators.required),
      pulsera: new FormControl('',Validators.required)
      
    });
  }

  async ngOnInit() {
    const result1 =  await this.getBrigadista();
    console.log(result1);
    this.nombresbrigadas$ = await this.getNombresBrigadas();
    this.getnBrigadas(result1.nombre_brigada);
    this.modBrigForm.patchValue({
      nombre:result1.nombre,
      apellidoP:result1.apellidoP,
      apellidoM:result1.apellidoM,
      correo:result1.correo,
      nombre_brigada:result1.nombre_brigada,
      n_brigada:result1.n_brigada,
      cargo:result1.cargo,
      peso:result1.peso,
      altura:result1.altura,
      pulsera:result1.pulsera
    });

  
    await this.getPulseraActual();
    this.getPulserasNoUsadas();
    const result2 = await this.getPulserasNoUsadas();
    console.log(result2);
  }

  async getNombresBrigadas(){
    this.nombresbrigadas2$= await this.http.get('http://localhost:8000/nombresbrigadas').toPromise();
    return this.nombresbrigadas2$.data;
  }

  onChange(deviceValue) {
    console.log(deviceValue);

    this.getnBrigadas(deviceValue);


  }

  async getnBrigadas(nombre){
    this.brigadas$= await this.http.get('http://localhost:8000/brigadasPorNombre' + nombre).toPromise();
    console.log(this.brigadas$.data);
   
  }

  async getBrigadista(){
    this.brigadista$ = await this.http.get('http://localhost:8000/brigadista/'+this.rut).toPromise();
    return this.brigadista$.data[0]
  }
  onSubmit(){
    if(this.modBrigForm.value!=null){
      this.http.put('http://localhost:8000/modBrigadista/'+this.rut, this.modBrigForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificación exitosa de brigadista').then(() => {
                this.router.navigate(['/brigadistas/'+this.modBrigForm.value.n_brigada+'/'+this.modBrigForm.value.nombre_brigada]);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en modificación de brigadista',error).then(() => {
              this.router.navigate(['/brigadas']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
  }
  

    async getPulseraActual(){
      this.act$ = await this.http.get('http://localhost:8000/pulseraAct/'+this.rut).toPromise();
      return this.act$;
    }
  
  async getPulserasNoUsadas(){
    this.pulserasNoUsadas$ = await this.http.get('http://localhost:8000/pulserasnousadas').toPromise();
    return this.pulserasNoUsadas$;
  }


}