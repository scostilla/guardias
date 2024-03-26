import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit{

  isLogged = false;
  constructor(
    private router: Router,
    private tokenService: TokenService
    ) {}

  ngOnInit(): void {
    if(this.tokenService.getToken()){
    this.isLogged = true;
    }else {
      this.isLogged = false;
    }
  }

  goToProfessionalForm() {
    console.log('redirecting to professional form');
    this.router.navigateByUrl('/professional-form');
  }

  onLogOut(): void{
    this.tokenService.logOut();
    window.location.reload();
  }
}
