// idle-timeout.service.ts
import { Injectable, NgZone } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeout {
  private timeoutInMs = 15 * 60 * 1000; // 15 minutos
  private warningTime = 14 * 60 * 1000; // 14 minutos (muestra aviso)
  private warningShown = false;
  private timeoutId: any;
  private warningId: any;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  startWatching(): void {
    this.resetTimer();
    this.listenToUserEvents();
  }

  private listenToUserEvents(): void {
    ['mousemove', 'keydown', 'click'].forEach(event =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  private resetTimer(): void {
    clearTimeout(this.timeoutId);
    clearTimeout(this.warningId);
    this.warningShown = false;

    this.warningId = setTimeout(() => {
      this.showWarning(); // Aquí podrías usar un modal o toast
    }, this.warningTime);

    this.timeoutId = setTimeout(() => {
      this.logOut();
    }, this.timeoutInMs);
  }

  private showWarning(): void {
    if (!this.warningShown) {
      this.warningShown = true;
      alert('Tu sesión expirará en 1 minuto por inactividad.');
    }
  }

  private logOut(): void {
    this.tokenService.logOut();
    this.router.navigate(['/login']);
    alert('Sesión cerrada por inactividad.');
  }
}
