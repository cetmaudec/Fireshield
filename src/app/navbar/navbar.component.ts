import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import swal from'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  espera$: any;
  num: any;
  fireEvent(e){
    console.log(e.type);
    
  }
  constructor(private router: Router, public auth: AuthService,private http: HttpClient) { }

  async ngOnInit() {
   this.num=await this.getNumEspera();
    
  }

  async getNumEspera(){
    this.espera$= await this.http.get('http://localhost:8000/nEspera').toPromise();
    return this.espera$.data[0].numero;
   console.log("espera   "+this.espera$.data[0].numero);
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
