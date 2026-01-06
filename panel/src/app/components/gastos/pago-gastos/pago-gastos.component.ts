import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GastoService } from 'src/app/services/gasto.service';
import { PagoService } from 'src/app/services/pago.service';
declare var $:any;
declare var printJS:any;

@Component({
  selector: 'app-pago-gastos',
  templateUrl: './pago-gastos.component.html',
  styleUrls: ['./pago-gastos.component.css']
})
export class PagoGastosComponent implements OnInit {

    public id = '';
    public token = localStorage.getItem('token');
    public compra : any = {};
    public pago : any = {};
    public detalles:Array<any>=[]
    public pagos:Array<any>=[]
    public load_data = true;
    public load_pagos = true;
    public data = false;
    public url = GLOBAL.url;
    public destino_pago = '';
    public total_pagado = 0;

    constructor(
      private _pagoService:PagoService,
      private _gastoService:GastoService,
      private _route:ActivatedRoute,
    ){}

    ngOnInit(): void {
      this._route.params.subscribe(
        params=>{
          this.id = params['id'];       
          this._gastoService.obtener_gasto_admin(this.id,this.token).subscribe(
            response=>{
              if (response.data == undefined) {
                this.data
              } else {
                this.data = true;
                this.compra = response.data;  
                this.detalles = response.detalles;
                this.pagos_compras();
              }
              this.load_data = false;
            }
          )
        });
    }

    pagos_compras(){
      this.load_pagos = true;
      this._pagoService.obtener_pago_vc_admin(this.id,this.token).subscribe(
        response=>{
          this.pagos = [];
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

  generar_pago_compra(){

    this.pago.proveedor = this.compra.proveedor._id;
    this.pago.compra = this.id;
    this.pago.tipo = 'Compras';
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
      this._pagoService.crear_pagogasto_admin(this.pago,this.token).subscribe(
        response=>{
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
          this.pagos_compras();
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
