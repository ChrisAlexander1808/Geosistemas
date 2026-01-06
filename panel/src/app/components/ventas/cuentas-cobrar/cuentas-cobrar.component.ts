import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { VentaService } from 'src/app/services/venta.service';
declare var $:any;
declare var moment:any;

@Component({
  selector: 'app-cuentas-cobrar',
  templateUrl: './cuentas-cobrar.component.html',
  styleUrls: ['./cuentas-cobrar.component.css']
})
export class CuentasCobrarComponent implements OnInit {

  public filtro_year = '';
  public filtro_month = '';
  public load_data = false;
  public ventascxc : Array<any>=[];
  public page = 1;
  public pageSize = 25;
  public token = localStorage.getItem('token');

    constructor(
      private _ventaService:VentaService
    ){}

    ngOnInit(): void {
      
    }

    search(){
      
      if (!this.filtro_year) {
        $.notify('Seleccione el año', { 
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
      }else if (!this.filtro_month) {
        $.notify('Seleccione el mes', { 
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
      } else{
        this.load_data = true;
        this._ventaService.ventas_por_cobrar(this.filtro_year,this.filtro_month,this.token).subscribe(
          response=>{
            this.ventascxc = [];
            for(var item of response.data){
              const clienteNombre = item.cliente ? item.cliente.nombrecomercial : 'Sin cliente';
              this.ventascxc.push({
                correlativo: item.correlativo,
                cliente: clienteNombre.toUpperCase(),
                nit: item.cliente.nit.toUpperCase(),
                fecha: moment(item.createdAt).format('YYYY-MM-DD'),
                factura: item.factura,
                fechafactura: item.fechafactura,
                saldo: item.saldo,
              });
            }
            this.ventascxc;
            this.load_data = false;
          }
        );
      }
      
    }

    refresh(){
      this.filtro_year = '';
      this.filtro_month = '';
  
      this.ventascxc = [];
    }
  
    downloadExcel(){
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("Cuentas por Cobrar");
  
      //CONVIRTIENDO NUESTRO ARREGLE A UN FORMATO LEGIBLE PARA EXCEL USANDO EXCELJS
      worksheet.addRow(undefined);
      for(let x1 of this.ventascxc){
        let x2=Object.keys(x1);
  
        let temp=[]
        for(let y of x2){
          temp.push(x1[y])
        }
        worksheet.addRow(temp)
      }
      //NOMBRE DEL ARCHIVO RESULTANTE
      let fname = "CUENTAS POR COBRAR";
      //ASIGNACION DE LA CABECERA DEL DOCUMENTO EXCEL
      worksheet.columns = [
        {header: 'CORRELATIVO', key: 'col1', width: 20},
        {header: 'CLIENTE', key: 'col2', width: 35},
        {header: 'NIT', key: 'col3', width: 20},
        {header: 'FECHA DE VENTA', key: 'col4', width: 35},
        {header: 'FACTURA', key: 'col5', width: 25},
        {header: 'FECHA FACTURA', key: 'col6', width: 15},
        {header: 'SALDO', key: 'col7', width: 20},
      ]as any;
  
      //PREPARACION DEL ARCHIVO Y SU DESCARGA
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        fs.saveAs(blob, fname+'.xlsx');
      });
    }
}
