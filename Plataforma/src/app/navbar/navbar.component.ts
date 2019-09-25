import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  fireEvent(e){
    console.log(e.type);
    
  }
  constructor(private router: Router) { }

  ngOnInit() {
    $(".drop").mouseover(function() {
        $(".dropdown").show(300);
    });
    $(".drop").mouseleave(function() {
        $(".dropdown").hide(300);     
    });
  }
  

}
