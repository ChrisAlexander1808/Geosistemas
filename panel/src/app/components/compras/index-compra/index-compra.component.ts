import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CompraService } from 'src/app/services/compra.service';
declare var $:any;
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var printJS:any;

@Component({
  selector: 'app-index-compra',
  templateUrl: './index-compra.component.html',
  styleUrls: ['./index-compra.component.css']
})
export class IndexCompraComponent implements OnInit{

  public load_data = true;
  public token = localStorage.getItem('token');
  public compras : Array<any> = [];
  public proveedores : Array<any> = [];
  public inicio = '';
  public hasta = '';
  public proveedor = 'Todos';

  public page = 1;
  public pageSize = 20;

  public imprimircompra : any = {};
  public imprimirdetalle : Array<any>= [];

    constructor(
      private _route:ActivatedRoute,
      private _compraService:CompraService,
      private _router:Router
    ){}

    ngOnInit(): void {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 150); 
      this._route.queryParams.subscribe(
        (params:Params)=>{
          console.log(params);
          this.inicio = params['inicio'];
          this.hasta = params['hasta'];
          this.proveedor = params['proveedor'];          
          if (this.inicio && this.hasta && this.proveedor) {
            this.init_compras_fecha();
          }
          else {
            this.proveedor = 'Todos';
            this.init_compras_hoy();
          }
        }
      );
      this.init_proveedores(); 
    }

    init_compras_hoy(){
      this.load_data = true;
      this._compraService.obtener_compras_hoy(this.token).subscribe(
        response=>{
          this.compras = [];
            for(var item of response.data){
              const proveedorNombre = item.proveedor ? item.proveedor.razonsocial : 'Sin proveedor';
                this.compras.push({
                  _id: item._id,
                  correlativo: item.correlativo,
                  proveedor: proveedorNombre,
                  nit: item.proveedor.nit,
                  factura: item.factura,
                  createdAt: item.fechafactura,
                  monto: item.monto,
                  estado: item.estado,
                  saldo: item.saldo
              })
            }
          this.compras;
          this.load_data = false;        
        }
      );
    }

    init_proveedores(){
      this._compraService.listar_proveedores_admin(this.token).subscribe(
        response=>{
          this.proveedores = response.data;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 150);
        }
      );
    }

    init_compras_fecha(){
      this.load_data = true;
      this._compraService.obtener_compras_fechas(this.inicio,this.hasta,this.proveedor,this.token).subscribe(
        response=>{
          this.compras = [];
            for(var item of response.data){
              const proveedorNombre = item.proveedor ? item.proveedor.razonsocial : 'Sin proveedor';
                this.compras.push({
                  _id: item._id,
                  correlativo: item.correlativo,
                  proveedor: proveedorNombre,
                  nit: item.proveedor.nit,
                  factura: item.factura,
                  createdAt: item.fechafactura,
                  monto: item.monto,
                  estado: item.estado,
                  saldo: item.saldo
              })
            }
          this.compras;
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
      }else if (!this.proveedor) {
        $.notify('Seleccione el proveedor', { 
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
        this._router.navigate(['/compras'],{queryParams: {inicio:this.inicio,hasta:this.hasta,proveedor:this.proveedor}});
      }
    }

    downloadExcel(){
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("Compras");

      //CONVIRTIENDO NUESTRO ARREGLE A UN FORMATO LEGIBLE PARA EXCEL USANDO EXCELJS
      worksheet.addRow(undefined);
      for(let x1 of this.compras){
        let x2=Object.keys(x1);

        let temp=[]
        for(let y of x2){
          temp.push(x1[y])
        }
        worksheet.addRow(temp)
      }
      //NOMBRE DEL ARCHIVO RESULTANTE
      let fname = "COMPRAS";
      //ASIGNACION DE LA CABECERA DEL DOCUMENTO EXCEL
      worksheet.columns = [
        {header: 'id', key: 'col1', width: 15},
        {header: 'CORRELATIVO', key: 'col1', width: 15},
        {header: 'PROVEEDOR', key: 'col2', width: 35},
        {header: 'NIT', key: 'col3', width: 20},
        {header: 'No. FACTURA', key: 'col7', width: 15},
        {header: 'FECHA DE COMPRA', key: 'col4', width: 15},
        {header: 'MONTO', key: 'col5', width: 15},
        {header: 'ESTADO', key: 'col6', width: 15},
        {header: 'SALDO', key: 'col5', width: 15},
      ]as any;

      //PREPARACION DEL ARCHIVO Y SU DESCARGA
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        fs.saveAs(blob, fname+'.xlsx');
      });
    } 

    openEditModal(idx:any) {
      $('#exampleModalLabel').modal('show');
      this._compraService.obtener_compra_admin(idx,this.token).subscribe(
        response=>{          
          this.imprimircompra = response.data;   
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
