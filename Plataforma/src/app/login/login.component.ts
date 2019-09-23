import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("Hola")
    
  }


  login(){
    //window.location.replace("principal.html");
    this.router.navigate(['/home']);
  }

}
