import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  public url = GLOBAL.url;
  constructor(
    private _http:HttpClient
  ) {  }

  ingresar_proyecto_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'ingresar_proyecto_admin',data,{headers:headers});    
  }

  listar_proyectos_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_proyectos_admin',{headers:headers});    
  }

  obtener_proyecto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_proyecto_admin/'+id,{headers:headers});    
  }

  actualizar_proyecto_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_proyecto_admin/'+id,data,{headers:headers});    
  }

  eliminar_proyecto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_proyecto_admin/'+id,{headers:headers});    
  }

  obtener_datos_categorias(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_datos_categorias/'+id,{headers:headers});    
  }

  kpi_gastos_categoria(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'kpi_gastos_categoria/'+id,{headers:headers});
  }

  obtener_ingresos_proyecto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ingresos_proyecto/'+id,{headers:headers});
  }

  obtener_listado_gastos(id:any,categoria:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_listado_gastos/'+id+'/'+categoria,{headers:headers});
  }

}
