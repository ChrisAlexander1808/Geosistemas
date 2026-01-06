import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { TestService } from 'src/app/services/test.service';
declare var spectrum:any;
declare var $:any;

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit {

    public token = localStorage.getItem('token');
    public config : any = {};
    public str_portada = 'assets/cargar.jpg';
    public logo: any = undefined;
    public url = GLOBAL.url;

    constructor(
      private _testService:TestService,
    ){}

    ngOnInit(): void {
      this.init_data();
      
    }

    init_data(){
      this._testService.obtener_configuracion_general(this.token).subscribe(
        response=>{
          this.config = response.data;
          this.str_portada = this.url + 'get_image_config/'+this.config.logo;
          setTimeout(() => {
            $('#color-picker').spectrum({
              type: "component",
              color: this.config.background
            });
          }, 150);
        }
      );
    }

    fileEventChange(event:any):void{

      var file : any;
        if(event.target.files && event.target.files[0]){
          file = <File>event.target.files[0];
          
          if(file.size <= 500000){
            if(file.type == 'image/jpeg'||file.type == 'image/png'||file.type == 'image/web'||file.type == 'image/jpg'){
              this.logo = file;
              this.config.logo = this.logo;
  
              const reader = new FileReader();
              reader.onload = e => {
                if(reader.result){
                  this.str_portada = reader.result as string;
                }
              } 
              reader.readAsDataURL(file);
  
            }else{
              $.notify('Solo se permite la seleccion de imagen.', {
                type: 'danger',
                spacing: 10,
                timer: 2000,
                placement:{
                  from: 'top',
                  align: 'right'              
                }
              });
              this.logo = undefined;
            }
          }else{
            $.notify('La imagen no debe superar los 5MB', {
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
              this.logo = undefined;
          }
        }
    }
  
    update(){
      this.config.logo = this.logo;
      this.config.background = $('#color-picker').spectrum('get').toHexString();
      if(!this.config.razon_social){
        $.notify('Debe ingresar la razon social', {
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
      }else if(!this.config.slogan){
        $.notify('Debe ingresar el slogan', {
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
      }else if(!this.config.background){
        $.notify('Debe seleccionar el background', {
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
      }else if(!this.config.categoria){
        $.notify('Debe ingresar las categorias', {
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
      }else if(!this.config.tipo){
        $.notify('Debe ingresar las ubicaciones', {
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
      }else{
        this._testService.actualizar_configuracion_general(this.config,this.token).subscribe(
          response=>{
            $.notify('Se Actualizó las configuraciones', {
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
            this.init_data();
          }
        );
      }
    }
}
