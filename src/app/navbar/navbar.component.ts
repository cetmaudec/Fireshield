import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapse = true; 
  TipoUser: any;
  cargo: any;

  constructor(private router: Router, private auth: AuthService ) {
   this.TipoUser = localStorage.getItem('tipo');
   this.cargo = localStorage.getItem('cargo');
  }

  ngOnInit() {
    console.log(this.cargo);
  }

  toggleState() { // manejador del evento
    let foo = this.isCollapse;
    console.log(this.isCollapse);
    this.isCollapse = foo === false ? true : false; 
  }


  logOut(){
     this.auth.logout();
     this.router.navigate(['']);
  }
}
