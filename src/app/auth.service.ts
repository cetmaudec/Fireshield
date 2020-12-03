import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './environment';


@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<string> {
    return this.http.post<{token: string, estado: string, cargo:string}>(environment.urlAddress+'auth', {username: username, password: password})
      .pipe(
        map(result => {
          localStorage.setItem('user', username);
          localStorage.setItem('cargo', result.cargo);
          localStorage.setItem('estado', result.estado);
          localStorage.setItem('access_token', result.token); 
          return result.estado;
        })
        
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('cargo');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}