import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) { 
    console.log(this.url);
  }

  obtener_variedad_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_variedad_admin',{headers:headers});
  }

  generar_venta_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'generar_venta_admin',data,{headers:headers});
  }

  obtener_ventas_hoy(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas_hoy',{headers:headers});
  }

  obtener_ventas_fechas(inicio:any,hasta:any,cliente:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas_fechas/'+inicio+'/'+hasta+'/'+cliente,{headers:headers});
  }

  listar_clientes_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_clientes_admin',{headers:headers});    
  } 

  actualizar_venta_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_venta_admin/'+id,data,{headers:headers});    
  } 

  obtener_detalle_ventas(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalle_ventas/'+id,{headers:headers});
  }

  obtener_ventas(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas/'+id,{headers:headers});
  }

  eliminar_detalle_venta_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_detalle_venta_admin/'+id,{headers:headers});
  }

  obtener_venta_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_venta_admin/'+id,{headers:headers});
  }

  ventas_por_cobrar(year:any,month:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'ventas_por_cobrar/'+year+'/'+month,{headers:headers});
  }

  obtener_rendimiento_venta(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_rendimiento_venta/'+id,{headers:headers});
  }
}
