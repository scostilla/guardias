import { HttpClient  } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cronograma-p-hos',
  templateUrl: './cronograma-p-hos.component.html',
  styleUrls: ['./cronograma-p-hos.component.css']
})
export class CronogramaPHosComponent {
  profesionales: any[] = [];
  profesionalesTemp: any[] = [];
  hospitales: any[] = [];
  profesionalesLunes: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarProfesionales(); 

  }
  
  cargarProfesionales(){
    this.http.get<any[]>('../assets/jsonFiles/profesionalesPasivas.json').subscribe(data => {
      this.profesionales = data;

      this.cargarProfesionalLunes();
    });
  }

  cargarProfesionalLunes(){
    this.http.get<any[]>('../assets/jsonFiles/profesionalesPasivas.json').subscribe(data => {
      this.profesionalesTemp = data;
    
      this.profesionalesTemp.forEach(elemento => {
        if (elemento.id <=4 ) {
          this.profesionalesLunes.push(this.profesionales[elemento]) ;
          console.log("nombree "+ this.profesionalesLunes[1].id);
          //console.log(`Se encontró un elemento con el valor ${valorComparar}`);
        }
      });

     /*  for(let i = 0 ; i <= this.profesionalesTemp.length; i++){
        console.log("nombree "+ this.profesionalesLunes[0].nombre);
        if(this.profesionalesTemp[i].id  >2)
        this.profesionalesLunes.push(this.profesionales[i]) ;
      } */
      //console.log("pasear el json  "+ this.profesionalesLunes[0].nombre);
      
      console.log("faf  "+ this.profesionalesLunes.length);
    });
    
  }
  

}
