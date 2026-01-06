import { Component, OnInit } from '@angular/core';
import { KpiService } from 'src/app/services/kpi.service';
declare var ApexCharts:any;
declare var $:any;

@Component({
  selector: 'app-kpi-mensual',
  templateUrl: './kpi-mensual.component.html',
  styleUrls: ['./kpi-mensual.component.css']
})
export class KpiMensualComponent implements OnInit {

    public month = '';
    public year = '';
    public token = localStorage.getItem('token');

    constructor(
      private _kpiService:KpiService
    ){}

    ngOnInit(): void {
      const primary = '#6993FF';
      const success = '#4EA64E';
      const info = '#8950FC';
      const warning = '#EA6351';
      const danger = '#F64E60';

      const apexChart = "#chart_12";
          var options = {
            series: [0,0],
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Pagos por Ventas', 'Pagos por Compras'],
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
            colors: [success, warning]
          };
          const chartElement = document.querySelector(apexChart);

          if (chartElement) {
            var chart = new ApexCharts(chartElement, options);
          }
          chart.render();
      this.init_chart_1();
    }
    search(){
      this.init_chart_12();
    }

    refresh(){
      this.year = '';
      this.month = '';
    }

    init_chart_12(){
      const primary = '#6993FF';
      const success = '#4EA64E';
      const info = '#8950FC';
      const warning = '#EA6351';
      const danger = '#F64E60';

      this._kpiService.kpi_pagos_tipo(this.year,this.month,this.token).subscribe(
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
            labels: ['Ventas', 'Compras'],
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
            colors: [success, warning]
          };
          const chartElement = document.querySelector(apexChart);

          if (chartElement) {
            var chart = new ApexCharts(chartElement, options);
          }
          chart.render();
            }
          );
        
    }

    init_chart_1(){
      this._kpiService.kpi_compras_mensuales(this.token).subscribe(
        response=>{
          const apexChart = "#chart_1";
          var options = {
            series: [
              {
                name: "Gran Total Q.",
              data: response.data
              },            
              {
                name: "Total Crédito Q.",
                data: response.meses_credito
              },
              {
                name: "Total Contado Q.",
                data: response.meses_contado
              },
            ],
              chart: {
                  height: 300,
                  type: "line",
                  zoom: {
                      enabled: false
                  }
              },
              dataLabels: {
                  enabled: false
              },
              stroke: {
                  curve: 'straight'
              },
              grid: {
                  row : {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.4
                }
              },
              xaxis: {
                  categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May','Jun', 'Jul', 'Au','Sep','Oct','Nov','Dic']
              },
              colors: ['#1866F7','#F9D407','#2DD3CB']
            }
        const chartElement = document.querySelector(apexChart);
  
        if (chartElement) {
          var chart = new ApexCharts(chartElement, options);
          
        }
        chart.render();
          }
        );
      
    }
}
