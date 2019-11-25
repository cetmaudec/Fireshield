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
  brig: any ;
  brigadas$: any = [];
  pulsera$:any=[];
  modBrigForm: FormGroup;
  brigadista$:any;
  pulserasNoUsadas$:any=[];
  act$:any=[];

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) { 
    this.brig=this.rutaActiva.snapshot.paramMap.get('id');
    console.log(this.brig);
    this.modBrigForm =  this.formBuilder.group({
      nombre: new FormControl('',Validators.required),
      apellidoP: new FormControl('',Validators.required),
      apellidoM: new FormControl('',Validators.required),

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
    this.modBrigForm.patchValue({
      nombre:result1.nombre,
      apellidoP:result1.apellidoP,
      apellidoM:result1.apellidoM,
      correo:result1.correo,
      n_brigada:result1.n_brigada,
      cargo:result1.cargo,
      peso:result1.peso,
      altura:result1.altura,
      pulsera:result1.pulsera
    });

    this.getBrigadas();
    await this.getPulseraActual();
    this.getPulserasNoUsadas();
    const result2 = await this.getPulserasNoUsadas();
    console.log(result2);
  }
  async getBrigadista(){
    this.brigadista$ = await this.http.get('http://localhost:8000/brigadista/'+this.brig).toPromise();
    return this.brigadista$.data[0]
  }
  onSubmit(){
    if(this.modBrigForm.value!=null){
      this.http.put('http://localhost:8000/modBrigadista/'+this.brig, this.modBrigForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificación exitosa de brigadista').then(() => {
                this.router.navigate(['/brigadistas/'+this.modBrigForm.value.n_brigada]);
                
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
  async getBrigadas(){
    this.brigadas$ = await this.http.get('http://localhost:8000/brigadas').toPromise();
  }

    async getPulseraActual(){
      this.act$ = await this.http.get('http://localhost:8000/pulseraAct/'+this.brig).toPromise();
      return this.act$;
    }
  
  async getPulserasNoUsadas(){
    this.pulserasNoUsadas$ = await this.http.get('http://localhost:8000/pulserasnousadas').toPromise();
    return this.pulserasNoUsadas$;
  }


}