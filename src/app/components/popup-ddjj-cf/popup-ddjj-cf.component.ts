import { Component } from '@angular/core';

@Component({
  selector: 'app-popup-ddjj-cf',
  templateUrl: './popup-ddjj-cf.component.html',
  styleUrls: ['./popup-ddjj-cf.component.css']
})
export class PopupDdjjCfComponent {
  alert:any;
  
  constructor() { 
     this.alert=79990;
 } 
 esDiferente():boolean {
         
     if(this.alert!=79990) {
             return true;
     }
      else { 
         return false;
     } 
 }
}
