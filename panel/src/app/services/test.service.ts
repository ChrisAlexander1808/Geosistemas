import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class TestService {
  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) { 
    console.log(this.url);
  }

  prueba_test():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'prueba_test',{headers:headers});
    
  }

  isAuthenticate(){
    const token : any = localStorage.getItem('token');

    try {
      const helper = new JwtHelperService();

      var decodedToken = helper.decodeToken(token);

      if (!token) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }

    } catch (error) {
      localStorage.clear();
      return false;
    }
    return true;
  }

  obtener_configuracion_general(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_configuracion_general',{headers:headers});
  }

  actualizar_configuracion_general(data:any,token:any):Observable<any>{
    if (data.logo != undefined) {

      let headers = new HttpHeaders({'Authorization':token});
      const fd = new FormData();
      fd.append('logo',data.logo);
      fd.append('razon_social',data.razon_social);
      fd.append('slogan',data.slogan);
      fd.append('backgroud',data.backgroud);
      fd.append('categoria',data.categoria);
      fd.append('tipo',data.tipo);
      return this._http.put(this.url+'actualizar_configuracion_general',fd,{headers:headers});
    } else {   
      
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_configuracion_general',data,{headers:headers});
    }
  }
}
