import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';  

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements  OnInit  {

  /*
    Variables utilizadas para poder desplegar el home de manera correcta.
  */

  /*
    Variable que almacena el cargo que posee el actual usuario que está en la sesión actual. Esto sirve para que se
    distingan las funciones de Super-Administrador, Administrador y Jefe de Brigada.
  */

  cargo:any;

  // En el constructor, se obtiene el cargo que posee el usuario actual.
  
  constructor() {  
    this.cargo=localStorage.getItem('cargo');
  }  
  ngOnInit() {  
    
    
  }  

 
}
  
  


