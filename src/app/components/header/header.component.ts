import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnDestroy , OnInit {
  private routerSubscription: Subscription;
  showNavBar: boolean = true;
  showHeader: boolean = true;

  isLogged = false;
  nombreUsuario = '';

  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private tokenService: TokenService
    ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavBar = !(event.url === '/home-page');
        this.showHeader = !(event.url === '/');
      }
    });
  }
  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserName();
    }else{
      this.isLogged = false;
      this.nombreUsuario = '';
    }
    
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onLogOut(): void{
    this.tokenService.logOut();
    //window.location.reload();
    this.router.navigate(['/']);
  }

}
