import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css']
})
export class Navbar2Component implements OnInit {

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit() {
  }

  // Método que sirve para que el navbar sea responsive y que se vuelva tipo tablet/celular al achicarse mucho.

  myFunction() {
    console.log("holi")
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
    x.className += " responsive";
    } else {
    x.className = "topnav";
    }
  }
  
  // Método que permite utilizar el servicio de autentificacion para que el usuario actual pueda deslogearse.

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }

}
