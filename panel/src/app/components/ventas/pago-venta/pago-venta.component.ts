import { Component, OnInit } from '@angular/core';
import { CompraService } from 'src/app/services/compra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PagoService } from 'src/app/services/pago.service';
import { VentaService } from 'src/app/services/venta.service';
declare var $:any;
declare var printJS:any;

@Component({
  selector: 'app-pago-venta',
  templateUrl: './pago-venta.component.html',
  styleUrls: ['./pago-venta.component.css']
})
export class PagoVentaComponent implements OnInit {

  public id = '';
  public token = localStorage.getItem('token');
  public venta : any = {};
  public pago : any = {};
  public detalles:Array<any>=[]
  public pagos:Array<any>=[]
  public load_data = true;
  public load_pagos = true;
  public load_pago = true;
  public data = false;
  public url = GLOBAL.url;
  public destino_pago = '';
  public total_pagado = 0;

    constructor(
      private _route:ActivatedRoute,
      private _ventaService:VentaService,
      private _pagoService:PagoService
    ){}

    ngOnInit(): void {
      this._route.params.subscribe(
        params=>{
          this.id = params['id'];       
          this._ventaService.obtener_venta_admin(this.id,this.token).subscribe(
            response=>{
              if (response.data == undefined) {
                this.data
              } else {
                this.data = true;
                this.venta = response.data;  
                this.detalles = response.detalles;
                this.pagos_ventas();
              }
              this.load_data = false;
            }
          )
        });
    }

    pagos_ventas(){
      this.load_pagos = true;
      this._pagoService.obtener_pago_vc_admin(this.id,this.token).subscribe(
        response=>{
          this.pagos = response.data;    
          for(var item of this.pagos){
            this.total_pagado = this.total_pagado + item.monto;
          } 
          this.load_pagos = false;
        }
      );
    }

    seleccionar_metodo(item:any){
      $('#dropdownMetodo').text(item);
      this.pago.metodo = item;
    }
  
    seleccionar_banco(item:any){
      $('#dropdownBanco').text(item);
      this.pago.banco = item;
    }
  
    generar_pago_venta(){
      
      this.pago.cliente = this.venta.cliente._id;
      this.pago.venta = this.id;  
      this.pago.tipo = 'Ventas';
      this.pago.destino_pago = this.destino_pago;
  
      if (!this.pago.metodo) {
        $.notify('Seleccione médoto de Pago', {
          type: 'danger',
          spacing: 10,
            timer: 2000,
            placement:{
              from: 'top',
              align: 'right'              
            },
            delay: 1000,
            animate: {
              enter: 'animated' + 'bounce',
              exit: 'animated' + 'bounce'
            }
          }); 
      } else if(!this.pago.banco){
        $.notify('Seleccione un banco', {
          type: 'danger',
          spacing: 10,
            timer: 2000,
            placement:{
              from: 'top',
              align: 'right'              
            },
            delay: 1000,
            animate: {
              enter: 'animated' + 'bounce',
              exit: 'animated' + 'bounce'
            }
          }); 
      }else if(!this.pago.fecha){
        $.notify('Seleccione la fecha de pago', {
          type: 'danger',
          spacing: 10,
            timer: 2000,
            placement:{
              from: 'top',
              align: 'right'              
            },
            delay: 1000,
            animate: {
              enter: 'animated' + 'bounce',
              exit: 'animated' + 'bounce'
            }
          }); 
      }else if(!this.pago.transaccion){
        $.notify('Ingrese el número de transaccion', {
          type: 'danger',
          spacing: 10,
            timer: 2000,
            placement:{
              from: 'top',
              align: 'right'              
            },
            delay: 1000,
            animate: {
              enter: 'animated' + 'bounce',
              exit: 'animated' + 'bounce'
            }
          }); 
      }else if(!this.pago.monto){
        $.notify('Ingrese el monto del pago', {
          type: 'danger',
          spacing: 10,
            timer: 2000,
            placement:{
              from: 'top',
              align: 'right'              
            },
            delay: 1000,
            animate: {
              enter: 'animated' + 'bounce',
              exit: 'animated' + 'bounce'
            }
          }); 
      }else if(!this.pago.destino_pago){
        $.notify('Seleccione detalle de Compra', {
          type: 'danger',
          spacing: 10,
            timer: 2000,
            placement:{
              from: 'top',
              align: 'right'              
            },
            delay: 1000,
            animate: {
              enter: 'animated' + 'bounce',
              exit: 'animated' + 'bounce'
            }
          }); 
      }
      else {
        this.load_pago = true;
        this._pagoService.crear_pagoventa_admin(this.pago,this.token).subscribe(
          response=>{
            this.load_pago = false;
            $('#modalPago').modal('hide');
            $.notify('Se registro el pago', {
              type: 'success',
              spacing: 10,
                timer: 2000,
                placement:{
                  from: 'top',
                  align: 'right'              
                },
                delay: 1000,
                animate: {
                  enter: 'animated' + 'bounce',
                  exit: 'animated' + 'bounce'
                }
              }); 
            this.pagos_ventas();
          }
        );
      }
    }
  
    imprimir_ticket(id:any){
      printJS({
        printable: 'contenedorticket-'+id,
        type: 'html',
       })
    }
}
