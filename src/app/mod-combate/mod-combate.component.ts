import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-mod-combate',
  templateUrl: './mod-combate.component.html',
  styleUrls: ['./mod-combate.component.css']
})
export class ModCombateComponent implements OnInit {
  CombateForm: FormGroup;
  Combat$: any = [];
  hito: any;
  idcombate: any;

  constructor(private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.CombateForm =  this.formBuilder.group({
      id: new FormControl('',Validators.required),
      hito: new FormControl('',Validators.required),
      
    });
    this.idcombate=this.rutaActiva.snapshot.paramMap.get('id');

   }

  async ngOnInit() {
    const result1 =  await this.getHito();
    console.log(result1);
    this.CombateForm.patchValue({
      id: this.idcombate,
      hito: result1.hito
    });


    
  }


  onSubmit(){
    console.log("entre");
    if(this.CombateForm.value!=null){
      this.http.put('http://localhost:8000/modCombate/'+this.idcombate, this.CombateForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Modificación exitosa de combate').then(() => {
                this.router.navigate(['/combates/']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en modificación de combate',error).then(() => {
              this.router.navigate(['/combates']);
              
              }
            );
          
          });
          this.ngOnInit();
    }
  
  }

  async getHito(){
    this.hito = await this.http.get('http://localhost:8000/hito/'+this.idcombate).toPromise();
    return this.hito.data[0]
  }



}