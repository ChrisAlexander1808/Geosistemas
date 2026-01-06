import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) { 
    console.log(this.url);
  }

  obtener_pago_vc_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_pago_vc_admin/'+id,{headers:headers});
  }

  crear_pagocompra_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'crear_pagocompra_admin',data,{headers:headers});
  }

  crear_pagoventa_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'crear_pagoventa_admin',data,{headers:headers});
  }

  crear_pagovingreso_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'crear_pagovingreso_admin',data,{headers:headers});
  }

  crear_pagogasto_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'crear_pagogasto_admin',data,{headers:headers});
  }

  obtener_pago_ig_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_pago_ig_admin/'+id,{headers:headers});
  }
}
