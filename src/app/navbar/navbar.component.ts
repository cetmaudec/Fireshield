import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  fireEvent(e){
    console.log(e.type);
    
  }
  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit() {
   
    
  }
  myFunction() {
    console.log("holi")
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
    x.className += " responsive";
    } else {
    x.className = "topnav";
    }
  }
  
  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
  

}
