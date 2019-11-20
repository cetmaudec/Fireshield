import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-add-combate',
  templateUrl: './add-combate.component.html',
  styleUrls: ['./add-combate.component.css']
})
export class AddCombateComponent implements OnInit {
  CombateForm: FormGroup;
  Combat$: any = [];
  maxCombat: any;
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.CombateForm =  this.formBuilder.group({
      id: new FormControl('',Validators.required),
      hito: new FormControl('',Validators.required),
      
    });
   }

  ngOnInit() {
    this.maxCombat = 0;
    this.getMaxCombat();
  }
  onSubmit(){
    console.log("entre");
    if(this.CombateForm.value!=null){
      this.http.post('http://localhost:8000/addCombate', this.CombateForm.value, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            console.log(response);
            swal.fire('Registro exitoso de combate').then(() => {
                this.router.navigate(['/combates']);
                
              }
            );
           
          },
          (error)=>{
            swal.fire('Error en el registro de combate',error).then(() => {
              this.router.navigate(['/combates']);
              
              }
            );
          
          });
          this.ngOnInit();
        }
  }
    
  async getMaxCombat(){

    this.Combat$ = await this.http.get('http://localhost:8000/maxCombat').toPromise();
    console.log(this.Combat$.data[0].combate);
    this.Combat$.data[0].combate++;

    this.maxCombat = this.Combat$.data[0].combate + 1;
    
    
  }


  }