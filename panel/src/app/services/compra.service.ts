import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class CompraService {

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

  listar_ventas_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_ventas_admin',{headers:headers});    
  } 

  generar_compra_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.post(this.url+'generar_compra_admin',data,{headers:headers});
  }

  obtener_compras_hoy(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_compras_hoy',{headers:headers});
  }

  obtener_compras_fechas(inicio:any,hasta:any,proveedor:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_compras_fechas/'+inicio+'/'+hasta+'/'+proveedor,{headers:headers});
  }

  obtener_compra_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_compra_admin/'+id,{headers:headers});
  }

  obtener_compra(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_compra/'+id,{headers:headers});
  }

  obtener_detalle_compra(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalle_compra/'+id,{headers:headers});
  }

  eliminar_detalle_compra_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_detalle_compra_admin/'+id,{headers:headers});
  }

  actualizar_compra_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_compra_admin/'+id,data,{headers:headers});    
  } 

  compras_por_pagar(year:any,month:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'compras_por_pagar/'+year+'/'+month,{headers:headers});
  }

  obtener_detalle_vc(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalle_vc/'+id,{headers:headers});
  }

}
