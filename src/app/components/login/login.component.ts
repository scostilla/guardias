import { Component, OnInit } from '@angular/core';
import { LoginuserService } from 'src/app/loginuser.service';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  user:Usuario= new Usuario();
  constructor(private loginuserservice:LoginuserService){}

    ngOnInit(): void {

    }
    userLogin(){
      //console.log(this.user)
      this.loginuserservice.loginUser(this.user).subscribe(data=>{
        alert("Login successful")
    },error=>alert("perdonn"));
}
}
