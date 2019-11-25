import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import swal from'sweetalert2';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-combates',
  templateUrl: './combates.component.html',
  styleUrls: ['./combates.component.css']
})
export class CombatesComponent implements OnInit {
  combates$: any = [];
  cargo:any;
  CombateForm: FormGroup;
  Combat$: any = [];
  maxCombat: any;
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {
    this.cargo=localStorage.getItem('cargo');
    this.CombateForm =  this.formBuilder.group({
      id: new FormControl('',Validators.required),
      hito: new FormControl('',Validators.required),
      
    });
    
   }

  ngOnInit() {
    document.getElementById("defaultOpen").click();
    this.getCombates();
    console.log(localStorage.getItem('user'));
    this.maxCombat = 0;
    this.getMaxCombat();
  }
  getCombates(){
    this.http.get('http://localhost:8000/combates').subscribe(resp =>
      this.combates$ = resp as []
  
    )
   console.log("brigadas"+this.combates$);
  }
  delCombate(id:string){
    if(confirm("¿Estás seguro de querer finalizar el combate "+id+"?")) {
      console.log("Implement delete functionality here");
    
      this.http.put('http://localhost:8000/finCombate/'+id, { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).subscribe(
          (response ) => {
            swal.fire('Combate finalizado exitosamente').then(() => {
              location.reload();
              
            }
          );
          console.log('response from post data is ', response);
          },
          (error)=>{
            swal.fire('Error al finalizar combate', error, 'success');
            console.log('error during post is ', error)
          });
  
    }
  }
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
