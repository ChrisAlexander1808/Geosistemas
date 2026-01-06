import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var $:any;
declare var moment:any;

@Component({
  selector: 'app-inventario-entrada',
  templateUrl: './inventario-entrada.component.html',
  styleUrls: ['./inventario-entrada.component.css']
})
export class InventarioEntradaComponent implements OnInit {

  public filtro_year = '';
  public filtro_month = '';
  public load_data = false;
  public inventario : Array<any>=[];
  public page = 1;
  public pageSize = 25;
  public token = localStorage.getItem('token');

  constructor(
    private _productoService:ProductoService
  ){}

  ngOnInit(): void {
    
  }

  search(){
    this.load_data = true;
    this._productoService.obtener_inventario_entrada_admin(this.filtro_year,this.filtro_month,this.token).subscribe(
      response=>{
        this.inventario = [];
        for(var item of response.data){
          this.inventario.push({
            sku: item.variedad.sku.toUpperCase(),
            producto: item.producto.titulo.toUpperCase(),
            variedad: item.variedad.titulo.toUpperCase(),
            proveedor: item.proveedor,
            cantidad: item.cantidad,
            precio: item.costo_unitario,
            fecha: moment(item.createdAt).format('YYYY-MM-DD')
          });
        }
        this.inventario;
        this.load_data = false;
      }
    );
  }

  refresh(){
    this.filtro_year = '';
    this.filtro_month = '';

    this.inventario = [];
  }

  downloadExcel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Inventario");

    //CONVIRTIENDO NUESTRO ARREGLE A UN FORMATO LEGIBLE PARA EXCEL USANDO EXCELJS
    worksheet.addRow(undefined);
    for(let x1 of this.inventario){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }
    //NOMBRE DEL ARCHIVO RESULTANTE
    let fname = "INVENTARIO DE ENTRADA";
    //ASIGNACION DE LA CABECERA DEL DOCUMENTO EXCEL
    worksheet.columns = [
      {header: 'SKU', key: 'col1', width: 20},
      {header: 'PRODUCTO', key: 'col2', width: 35},
      {header: 'VARIEDAD', key: 'col3', width: 20},
      {header: 'PROVEEDOR', key: 'col4', width: 35},
      {header: 'CANTIDAD', key: 'col5', width: 25},
      {header: 'PRECIO', key: 'col6', width: 15},
      {header: 'FECHA INGRESO', key: 'col7', width: 15},
    ]as any;

    //PREPARACION DEL ARCHIVO Y SU DESCARGA
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname+'.xlsx');
    });
  }
}
