import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { IngresoService } from 'src/app/services/ingreso.service';
declare var $:any;
declare var moment:any;
declare var printJS:any;

@Component({
  selector: 'app-index-ingresos',
  templateUrl: './index-ingresos.component.html',
  styleUrls: ['./index-ingresos.component.css']
})
export class IndexIngresosComponent implements OnInit {

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
    public pageSize = 10;

    public imprimirventa : any = {};
    public imprimirdetalle : Array<any>= [];

    constructor(
      private _route:ActivatedRoute,
      private _router:Router,
      private _ingresoServices:IngresoService
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

    init_clientes(){
      this._ingresoServices.listar_clientes_admin(this.token).subscribe(
        response=>{
          this.clientes = response.data;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 150);
        }
      );
    }

    init_ventas_hoy(){
      this.load_data = true;
      this._ingresoServices.obtener_ingresos_hoy(this.token).subscribe(
        response=>{
          this.ventas = [];
          for(var item of response.data){
            const clienteNombre = item.cliente ? item.cliente.nombrecomercial : 'Sin cliente';
            const proyecto = item.proyecto ? item.proyecto.nombre : 'Sin Proyecto';
            this.ventas.push({
              _id: item._id,
              correlativo: item.correlativo,
              proyecto: proyecto,
              cliente: clienteNombre,
              createdAt: moment(item.createdAt).format('YYYY-MM-DD'),
              monto: item.monto,
              estado: item.estado,
              factura: item.factura,
              fechafactura: item.fechafactura,
              saldo: item.saldo,
            });
          }
          this.ventas;
          this.load_data = false;
        }
      );
    }

    init_ventas_fecha(){
      this.load_data = true;
      this._ingresoServices.obtener_ingresos_fechas(this.inicio,this.hasta,this.cliente,this.token).subscribe(
        response=>{
          this.ventas = [];
          for(var item of response.data){
            const clienteNombre = item.cliente ? item.cliente.nombrecomercial : 'Sin cliente';
            const proyecto = item.proyecto ? item.proyecto.nombre : 'Sin Proyecto';
            this.ventas.push({
              _id: item._id,
              correlativo: item.correlativo,
              proyecto: proyecto,
              cliente: clienteNombre,
              createdAt: moment(item.createdAt).format('YYYY-MM-DD'),
              monto: item.monto,
              estado: item.estado,
              factura: item.factura,
              fechafactura: item.fechafactura,
              saldo: item.saldo,
            });
          }
          this.ventas;
          this.load_data = false;
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
        this._router.navigate(['/ingresos'],{queryParams: {inicio:this.inicio,hasta:this.hasta,cliente:this.cliente}})
      }
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
        {header: 'CORRELATIVO', key: 'col1', width: 15},
        {header: 'PROYECTO', key: 'col2', width: 45},
        {header: 'CLIENTE', key: 'col3', width: 35},
        {header: 'FECHA DE VENTA', key: 'col4', width: 15},
        {header: 'MONTO', key: 'col5', width: 15},
        {header: 'ESTADO', key: 'col6', width: 15},
        {header: 'No. FACTURA', key: 'col7', width: 15},
        {header: 'FECHA FACTURA', key: 'col8', width: 15},
        {header: 'SALDO', key: 'col9', width: 15},
      ]as any;

      //PREPARACION DEL ARCHIVO Y SU DESCARGA
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        fs.saveAs(blob, fname+'.xlsx');
      });
    } 

    openEditModal(idx:any) {
      $('#exampleModalLabel').modal('show');
      this._ingresoServices.obtener_ingreso_admin(idx,this.token).subscribe(
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
