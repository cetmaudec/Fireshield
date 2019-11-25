import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';  

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements  OnInit  {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  cargo:any;
  
  constructor() {  
    this.cargo=localStorage.getItem('cargo');
  }  
  ngOnInit() {  
    
    
  }  

 
}
  
  


