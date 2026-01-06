import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) { 
    console.log(this.url);
  }

  listar_proveedores_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_proveedores_admin',{headers:headers});    
  } 

  obtener_gastos_hoy(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_gastos_hoy',{headers:headers});
  }

  obtener_gastos_fechas(inicio:any,hasta:any,proveedor:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_gastos_fechas/'+inicio+'/'+hasta+'/'+proveedor,{headers:headers});
  }
  
  obtener_gasto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_gasto_admin/'+id,{headers:headers});
  }

  generar_gasto_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'generar_gasto_admin',data,{headers:headers});
  }

  obtener_gasto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_gasto/'+id,{headers:headers});
  }

  obtener_detalle_gasto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalle_gasto/'+id,{headers:headers});
  }

  compras_por_pagar_gastos(year:any,month:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'compras_por_pagar_gastos/'+year+'/'+month,{headers:headers});
  }

  eliminar_detalle_gasto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_detalle_gasto_admin/'+id,{headers:headers});
  }

  actualizar_gasto_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_gasto_admin/'+id,data,{headers:headers});    
  } 

}
