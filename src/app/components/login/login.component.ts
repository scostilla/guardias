import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginuserService } from 'src/app/loginuser.service';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  user:Usuario= new Usuario();

  constructor(private loginuserservice:LoginuserService,
    private router : Router
    ){}

    ngOnInit(): void {

    }
    userLogin(){
      //console.log(this.user)
      this.loginuserservice.loginUser(this.user).subscribe(data=>{
        //alert("Login successful")
        this.router.navigate(['/home-page']);
    },error=>alert("Usuario/contraseña inválido, ingrese nuevamente por favor"));
}
}
