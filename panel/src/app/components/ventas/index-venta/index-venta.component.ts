import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { VentaService } from 'src/app/services/venta.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var $:any;
declare var moment:any;
declare var printJS:any;

@Component({
  selector: 'app-index-venta',
  templateUrl: './index-venta.component.html',
  styleUrls: ['./index-venta.component.css']
})
export class IndexVentaComponent implements OnInit{

    public token = localStorage.getItem('token');
    public inicio = '';
    public hasta = '';
    public cliente = 'Todos';
    public load_data = true;
    public id = '';

    public ventas : Array<any> = [];
    public clientes : Array<any> = [];
    public total_detalle = 0;

    public page = 1;
    public pageSize = 20;

    public imprimirventa : any = {};
    public imprimirdetalle : Array<any>= [];
  

    constructor(
      private _route:ActivatedRoute,
      private _ventaService:VentaService,
      private _colaboradorService:ColaboradorService,
      private _router:Router
    ){}

    ngOnInit(): void {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 150);        
      this._route.queryParams.subscribe(
        (params:Params)=>{
          this.inicio = params['inicio'];
          this.hasta = params['hasta'];
          this.cliente = params['cliente'];          
          if (this.inicio && this.hasta && this.cliente) {
            this.init_ventas_fecha();
          }
          else {
            this.cliente = 'Todos';
            this.init_ventas_hoy();
          }
        }
      );
      this.init_clientes();
    }
    
    init_ventas_hoy(){
      this.load_data = true;
      this._ventaService.obtener_ventas_hoy(this.token).subscribe(
        response=>{
          this.ventas = [];
          for(var item of response.data){
            const clienteNombre = item.cliente ? item.cliente.nombrecomercial : 'Sin cliente';
            this.ventas.push({
              _id: item._id,
              correlativo: item.correlativo,
              cliente: clienteNombre,
              nit: item.cliente.nit,
              createdAt: moment(item.createdAt).format('YYYY-MM-DD'),
              monto: item.monto,
              estado: item.estado,
              factura: item.factura,
              fechafactura: item.fechafactura,
              saldo: item.saldo,
              empresa: item.empresa,
            });
          }
          this.ventas;
          this.load_data = false;
        }
      );
    }

    init_clientes(){
      this._ventaService.listar_clientes_admin(this.token).subscribe(
        response=>{
          this.clientes = response.data;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 150);
        }
      );
    }

    filtrar(){
        if (!this.inicio) {
          $.notify('Ingrese la fecha de inicio', { 
            type: 'danger',
            spacing: 10,                    
            timer: 2000,
            placement: {
                from: 'top', 
                align: 'right'
            },
            delay: 1000,
            animate: {
                enter: 'animated ' + 'bounce',
                exit: 'animated ' + 'bounce'
            }
          });
        }else if(!this.hasta){
          $.notify('Ingrese la fecha de fin', { 
            type: 'danger',
            spacing: 10,                    
            timer: 2000,
            placement: {
                from: 'top', 
                align: 'right'
            },
            delay: 1000,
            animate: {
                enter: 'animated ' + 'bounce',
                exit: 'animated ' + 'bounce'
            }
          });       
        }else if (!this.cliente) {
          $.notify('Seleccione el cliente', { 
            type: 'danger',
            spacing: 10,                    
            timer: 2000,
            placement: {
                from: 'top', 
                align: 'right'
            },
            delay: 1000,
            animate: {
                enter: 'animated ' + 'bounce',
                exit: 'animated ' + 'bounce'
            }
          });
        }else{
          this._router.navigate(['/ventas'],{queryParams: {inicio:this.inicio,hasta:this.hasta,cliente:this.cliente}})
        }
    }

    init_ventas_fecha(){
      this.load_data = true;
      this._ventaService.obtener_ventas_fechas(this.inicio,this.hasta,this.cliente,this.token).subscribe(
        response=>{
          this.ventas = [];
          for(var item of response.data){
            const clienteNombre = item.cliente ? item.cliente.razonsocial : 'Sin cliente';
            this.ventas.push({
              _id: item._id,
              correlativo: item.correlativo,
              cliente: clienteNombre,
              nit: item.cliente.nit,
              createdAt: moment(item.createdAt).format('YYYY-MM-DD'),
              monto: item.monto,
              estado: item.estado,
              factura: item.factura,
              fechafactura: item.fechafactura,
              saldo: item.saldo,
              empresa: item.empresa,
            });
          }
          this.ventas;
          this.load_data = false;
        }
      );
    }

    downloadExcel(){
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("Ventas");

      //CONVIRTIENDO NUESTRO ARREGLE A UN FORMATO LEGIBLE PARA EXCEL USANDO EXCELJS
      worksheet.addRow(undefined);
      for(let x1 of this.ventas){
        let x2=Object.keys(x1);

        let temp=[]
        for(let y of x2){
          temp.push(x1[y])
        }
        worksheet.addRow(temp)
      }
      //NOMBRE DEL ARCHIVO RESULTANTE
      let fname = "VENTAS";
      //ASIGNACION DE LA CABECERA DEL DOCUMENTO EXCEL
      worksheet.columns = [
        {header: 'id', key: 'col1', width: 15},
        {header: 'CORRELATIVO', key: 'col2', width: 15},
        {header: 'CLIENTE', key: 'col3', width: 35},
        {header: 'NIT', key: 'col4', width: 20},
        {header: 'FECHA DE VENTA', key: 'col5', width: 15},
        {header: 'MONTO', key: 'col6', width: 15},
        {header: 'ESTADO', key: 'col7', width: 15},
        {header: 'No. FACTURA', key: 'col8', width: 15},
        {header: 'FECHA FACTURA', key: 'col9', width: 15},
        {header: 'SALDO', key: 'col10', width: 15},
        {header: 'EMPRESA', key: 'col11', width: 15},
      ]as any;

      //PREPARACION DEL ARCHIVO Y SU DESCARGA
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        fs.saveAs(blob, fname+'.xlsx');
      });
    } 

    openEditModal(idx:any) {
      $('#exampleModalLabel').modal('show');
      this._ventaService.obtener_venta_admin(idx,this.token).subscribe(
        response=>{          
          this.imprimirventa = response.data;   
          this.imprimirdetalle = response.detalles;            
        }
      );    
    }

    imprimir_ticket(){      
      printJS({
        printable: 'contenedorticket-',
        type: 'html',
       })
    }
}
