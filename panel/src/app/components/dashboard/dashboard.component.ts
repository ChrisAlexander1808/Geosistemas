import { Component, OnInit } from '@angular/core';
import { KpiService } from 'src/app/services/kpi.service';
import { TestService } from "src/app/services/test.service";
declare var ApexCharts:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  public month = '';
  public year = '';
  public token = localStorage.getItem('token');
  public total_ventas = 0;
  public total_ventas_credito = 0;
  public total_ventas_contado = 0;

  constructor(
    private _kpiService:KpiService
  ){}

  ngOnInit(): void {
    this.init_chart_1();
    this.total_venta();
  }
 
  init_chart_1(){
    this._kpiService.kpi_ventas_mensuales(this.token).subscribe(
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

  total_venta(){
    this._kpiService.kpi_total_ventas(this.token).subscribe(
      response=>{
        this.total_ventas = response.data;
        this.total_ventas_credito = response.total_venta_credito;
        this.total_ventas_contado = response.total_venta_contado;
      }
    );
  }
}
