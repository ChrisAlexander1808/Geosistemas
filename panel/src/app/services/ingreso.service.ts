import { Injectable } from '@angular/core';
import { Observable, forkJoin } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  public url = GLOBAL.url;
  public token = localStorage.getItem('item');

  constructor(
    private _http:HttpClient
  ) { }

  sendPost(body:any):Observable<any>{
    return this._http.post(this.url+'upload',body);
  }

  listar_clientes_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_clientes_admin',{headers:headers});    
  } 

  obtener_ingresos_hoy(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ingresos_hoy',{headers:headers});    
  } 

  obtener_ingresos_fechas(inicio:any,hasta:any,cliente:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ingresos_fechas/'+inicio+'/'+hasta+'/'+cliente,{headers:headers});
  }

  listar_proyectos_modal_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_proyectos_modal_admin',{headers:headers});    
  }

  obtener_producto_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_producto_admin',{headers:headers});
  } 
  
  generar_ingreso_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();
    fd.append('cliente',data.cliente);
    fd.append('proyecto',data.proyecto);
    fd.append('tipo',data.tipo);
    fd.append('monto',data.monto);
    fd.append('saldo',data.saldo);
    fd.append('estado',data.estado);
    fd.append('factura',data.factura);
    fd.append('fechafactura',data.fechafactura);
    fd.append('correlativo',data.correlativo);

    fd.append('detalles',JSON.stringify(data.detalles));

    fd.append('archivopdf',data.archivopdf);
    return this._http.post(this.url+'generar_ingreso_admin',fd,{headers:headers});
  }

  obtener_ingreso_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ingreso_admin/'+id,{headers:headers});
  }

  obtener_detalle_ingreso(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalle_ingreso/'+id,{headers:headers});
  }

  obtener_ingreso(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ingreso/'+id,{headers:headers});
  }

  eliminar_detalle_ingreso_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_detalle_ingreso_admin/'+id,{headers:headers});
  }

  actualizar_ingreso_admin(id:any,data:any,token:any):Observable<any>{     

      let headers = new HttpHeaders({'Authorization':token});
      const formData = new FormData();

      // Agregar campos de texto
      formData.append('cliente', data.cliente);
      formData.append('proyecto', data.proyecto._id || '');
      formData.append('tipo', data.tipo);
      formData.append('monto', data.monto);
      formData.append('saldo', data.saldo);
      formData.append('estado', data.estado);
      formData.append('factura', data.factura);
      formData.append('fechafactura', data.fechafactura);

      // Agregar array de detalles como JSON
      const detallesJSON = JSON.stringify(data.ingresos_detalle);
      formData.append('ingresos_detalle', detallesJSON);

      // Si hay un archivo PDF, agregarlo a FormData
      if (data.archivopdf) {
        formData.append('archivopdf', data.archivopdf); // Asegurarse de agregar solo si se cambia el PDF
      }
      return this._http.put(this.url+'actualizar_ingreso_admin/'+id,formData,{headers:headers});    
  } 

/*
 actualizar_ingreso_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_ingreso_admin/'+id,data,{headers:headers});    
  } 
*/

  ingresos_por_cobrar(year:any,month:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-type':'application/json','Authorization':token});
    return this._http.get(this.url+'ingresos_por_cobrar/'+year+'/'+month,{headers:headers});
  }
}
