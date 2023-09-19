import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginuserService } from 'src/app/loginuser.service';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loggedUser: Usuario = new Usuario();
  user: any;

  constructor(
    private loginuserservice: LoginuserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    /*
    this.http
      .get<any[]>('../assets/jsonFiles/usuarios.json')
      .subscribe((data) => {
        this.user = data.filter((user) => user.userName === this.loggedUser.usuario);
      });*/
  }

  userLogin() {
    console.log(this.loggedUser);
    this.http
      .get<any[]>('../assets/jsonFiles/usuarios.json')
      .subscribe((data) => {
        this.user = data.find(
          (user) => user.userName === this.loggedUser.usuario
        );
        if (this.user) {
          this.validateUser();
        } else {
          alert('Usuario inválido, ingrese nuevamente por favor');
          this.loggedUser.usuario = '';
          this.loggedUser.contrasena = '';
        }
      });
  }

  validateUser() {
    if (this.user.pass === this.loggedUser.contrasena) {
      if (this.user.estado === 1) {
        const queryParams = {
          nombre: this.user.nombre,
          apellido: this.user.apellido,
        };
        this.router.navigate(['/home-page'], { queryParams });
      } else {
        alert(
          'Usuario ' +
            this.user.userName +
            ' se encuetra dado de baja, por favor comuniquese con el administrador'
        );
        this.loggedUser.usuario = '';
        this.loggedUser.contrasena = '';
      }
    } else {
      alert('Contraseña incorrecta');
      this.loggedUser.contrasena = '';
    }
  }
}
