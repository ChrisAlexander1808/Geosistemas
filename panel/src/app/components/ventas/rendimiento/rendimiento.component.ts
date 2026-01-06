import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraService } from 'src/app/services/compra.service';
import { VentaService } from 'src/app/services/venta.service';
declare var ApexCharts:any;
declare var $:any;

@Component({
  selector: 'app-rendimiento',
  templateUrl: './rendimiento.component.html',
  styleUrls: ['./rendimiento.component.css']
})
export class RendimientoComponent implements OnInit {

  public token = localStorage.getItem('token');
  public id = '';
  public ventas_detalle : Array<any>=[];
  public compras_detalle : Array<any>=[];
  public categoria = '';
  public total_ventas = 0;
  public total_compras = 0;
  public pendiente = 0;
  public load_detalles = true;
  public load_compras = true;

    constructor(
      private _ventaService:VentaService,
      private _compraService:CompraService,
      private _route:ActivatedRoute
    ){}

    ngOnInit(): void {
      this._route.params.subscribe(
          params=>{
            this.id = params['id'];
            this.load_detalles = true;
            this.load_compras = true;
            this._ventaService.obtener_detalle_ventas(this.id,this.token).subscribe(
              response=>{
                this.ventas_detalle = response.data;  
                this.total_ventas = 0;
    
                for (const detalle of this.ventas_detalle) {
                  const subtotal = detalle.precio * detalle.cantidad;
                  this.total_ventas += subtotal;
          
                }
                this.load_detalles = false;
              }
            ); 
            this._compraService.obtener_detalle_vc(this.id,this.token).subscribe(
              response=>{
                this.compras_detalle = response.data;                  
                
                for (const detalle of this.compras_detalle) {
                  const subtotal = detalle.precio * detalle.cantidad;
                  this.total_compras += subtotal;
          
                }
                this.load_compras = false;
              }
            );
          }
      );
    }

}
