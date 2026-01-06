import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) { 
    console.log(this.url);
  }

  registro_proveedor_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_proveedor_admin',data,{headers:headers});    
  }

  listar_proveedores_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_proveedores_admin',{headers:headers});    
  }

  obtener_datos_proveedor_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_datos_proveedor_admin/'+id,{headers:headers});    
  }

  editar_proveedor_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'editar_proveedor_admin/'+id,data,{headers:headers});    
  }

  cambiar_estado_proveedor_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'cambiar_estado_proveedor_admin/'+id,data,{headers:headers});    
  }

  listar_proveedores_modal_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_proveedores_modal_admin/'+id,{headers:headers});    
  }
}
