import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { subscribe } from 'diagnostics_channel';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProyectoService } from 'src/app/services/proyecto.service';
declare var ApexCharts:any;
declare var $:any;

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {

    public token = localStorage.getItem('token');
    public id = '';
    public categoria = '';
    public total = 0;
    public pendiente = 0;
    public load_data = true;
    public load_pagos = true;
    public load_listado = true;
    public categoria_gastos:any={};
    public pagos_proyecto:any[]=[];
    public listado_gastos:Array<any> = [];
    public url = GLOBAL.url;
    public proyecto :any={};
    public nombreproyecto : String = '';
    public totalgastos = 0;
    public totalingresos = 0;

    constructor(
      private _proyectoService:ProyectoService,
      private _route:ActivatedRoute
    ){}

    ngOnInit(): void {

      this._route.params.subscribe(
        params=>{
          this.id = params['id']; 
          this.categoria = params['categoria'];
          this.load_data = true;
          this.load_pagos = true;
          this._proyectoService.obtener_datos_categorias(this.id,this.token).subscribe(
            response=>{
                this.categoria_gastos = response.data;
                this.load_data = false;
            }
          );
          this.init_chart_12(this.id);
          this._proyectoService.obtener_ingresos_proyecto(this.id,this.token).subscribe(
            response=>{
              this.pagos_proyecto = response.data;              
              this.load_pagos = false;
            }
          );  
          this._proyectoService.obtener_proyecto_admin(this.id,this.token).subscribe(
            response=>{
              this.proyecto = response.data;
              this.nombreproyecto = this.proyecto?.nombre || '';
              this.totalgastos = this.proyecto.gastos;
              this.totalingresos = this.proyecto.ingresos;
            }
          );             
        }
      );
    }

    abrirPDF(nombrePDF: string){
      const link = this.url + 'get_pdf/' + nombrePDF;
      window.open(link);
    }

    init_chart_12(idx:any){
      const muro = '#9092A2';
      const geomalla = '#0F110F';
      const fletes = '#DF8C13';
      const maquinaria = '#7948D5';
      const planilla = '#F05239';
      const matextras = '#3C4EDF';
      const otros = '#DF13C1';

      this._proyectoService.kpi_gastos_categoria(idx,this.token).subscribe(
        response=>{      
          $('#chart_12').remove();
          $('#content_chart_12').html('<div id="chart_12" class="d-flex justify-content-center"></div>');
          
          const apexChart = "#chart_12";
          var options = {
            series: response.data,
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Muro', 'Geomalla','Fletes','Maquinaria','Planilla','Materiales Extras','Otros'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }],
            colors: [muro, geomalla, fletes, maquinaria, planilla, matextras, otros]
          };
          const chartElement = document.querySelector(apexChart);

          if (chartElement) {
            var chart = new ApexCharts(chartElement, options);
          }
          chart.render();
            }
      );
    }

    calcularSaldo(index:number): number{
      let saldo = 0;
      for(let i = 0; i <=index; i++){
        saldo += this.pagos_proyecto[i].monto;
      }
      return this.pagos_proyecto[index].cliente.valor - saldo;
    }

    listarDetalles(categoria:any){
      this.load_listado = true;
      this._proyectoService.obtener_listado_gastos(this.id,categoria,this.token).subscribe(
        response=>{
          this.listado_gastos = [];
          for(var item of response.data){
             const Proveedor = item.proveedor ? item.proveedor.nombrecomercial : 'Sin Proveedor';
             this.listado_gastos.push({
                proveedor: Proveedor,
                fecha: item.fechafactura,
                monto: item.monto,
                saldo: item.saldo,
             }); 
          }
          this.listado_gastos;
          this.load_listado = false;
        }
      );
    }
    
}
