import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
declare var $:any;

@Component({
  selector: 'app-llamadas-cliente',
  templateUrl: './llamadas-cliente.component.html',
  styleUrls: ['./llamadas-cliente.component.css']
})
export class LlamadasClienteComponent implements OnInit{
  
  public id = '';
  public llamada:any = {
    resultado: ''
  };
  public time = { hour: 0, minute: 0 };
 
  public btn_load = false;
  public token  = localStorage.getItem('token');

  public llamadas :Array<any> = [];
  public page = 1;
  public pageSize = 25;
  public data = false;
  public load_data = true;

  constructor(    
    private _route:ActivatedRoute,
    private _clienteService:ClienteService    
  ){}

  ngOnInit(): void {
    const currentTime = new Date();
    this.time.hour = currentTime.getHours();
    this.time.minute = currentTime.getMinutes();
    
    this._route.params.subscribe(
      params=>{
        //código para obtener los datos desde el backend por el id
        this.id = params['id'];  
        this._clienteService.obtener_datos_cliente_admin(this.id,this.token).subscribe(
          response =>{
            if (response.data != undefined) {
              this.data = true;
              this.load_data = false;
              this.init_data();  
            } else {
              this.data = false;
              this.load_data = false;
            }
          }
        );                
      }
    );
  }

  init_data(){
    this._clienteService.listar_llamadas_prospeccion_admin(this.id,this.token).subscribe(
        response=>{
          this.llamadas = response.data;
        }           
    );
  }

  registrar(){
    console.log(this.time);
    
    if (this.time || this.time != undefined || this.time != null) {
      this.llamada.hora = this.time.hour + ':'+ this.time.minute;
    }

      if (!this.llamada.fecha) {
        $.notify('Ingresa la fecha correctamente', { 
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
      }else if (!this.llamada.resultado) {
        $.notify('Seleccione el resultado correctamente', { 
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
      }else if (!this.llamada.hora) {
        $.notify('Ingrese la hora correctamente', { 
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
      this.btn_load = true;
      //para inyectar los datos de otros modelos antes de hacer la inserción de los que el usuario va a llenar
      this.llamada.cliente = this.id;
      this.llamada.asesor = localStorage.getItem('_id');
      this._clienteService.crear_llamada_prospeccion_admin(this.llamada,this.token).subscribe(
        response=>{
          $('#modalLlamada').modal('hide');
          this.btn_load = false;
          this.init_data();
          this.llamada = {
            resultado: ''
          };
          $.notify('Se registro Correctamente la llamada', { 
            type: 'success',
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
        }
      );
     }
  }

}
