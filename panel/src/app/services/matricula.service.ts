import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) { 
    console.log(this.url);
  }

  generar_matricula_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'generar_matricula_admin',data,{headers:headers});
  }
}
