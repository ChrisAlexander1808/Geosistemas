import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
declare var $:any;

@Component({
  selector: 'app-index-proyectos',
  templateUrl: './index-proyectos.component.html',
  styleUrls: ['./index-proyectos.component.css']
})

export class IndexProyectosComponent implements OnInit {

    public token = localStorage.getItem('token');
    public filtro_proyecto = '';
    public filtro_estado = 'Todos';
    public proyectos1 : any = {
      cliente : '',
      estado : ''
    };
    public proyectos2 : any = {
      cliente : '',
      estado : ''
    };
    public proyectos:Array<any>=[];
    public proyectos_const:Array<any>=[];
    public clientes:Array<any>=[];
    public load_data = true;
    public load_delete = true;
    public load_proyecto = true;
    public page = 1;
    public pageSize = 10;

    constructor(
      private _clienteService:ClienteService,
      private _proyectoService:ProyectoService,
    ){}

    ngOnInit(): void {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 150);
      this.init_clientes();
      this.init_data();
    }

    init_data(){
      this.load_data = true;
      this._proyectoService.listar_proyectos_admin(this.token).subscribe(
        response=>{
          this.proyectos = response.data;
          this.proyectos_const = this.proyectos;
          this.load_data = false;
        }
      );
    }

    filtrar(){      

        var term = new RegExp(this.filtro_proyecto, 'i');

        if (this.filtro_estado == 'Todos') {
            // Filtrar solo por nombre del proyecto
            this.proyectos = this.proyectos_const.filter(item => term.test(item.nombre));
        } else {
            // Filtrar por nombre del proyecto y estado
            this.proyectos = this.proyectos_const.filter(item => term.test(item.nombre) && item.estado == this.filtro_estado);
        }    
    }

    init_clientes(){
      this._clienteService.listar_clientes_admin(this.token).subscribe(
        response=>{
          this.clientes = response.data;
          setTimeout(()=>{
            $('.selectpicker').selectpicker('refresh');
          },150);
        }
      );
    }

    save(){
      if (!this.proyectos1.cliente) {
        $.notify('Seleccione el cliente del proyecto', {
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
      }else if (!this.proyectos1.nombre) {
        $.notify('Ingrese el nombre del proyecto', {
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
      }else if (!this.proyectos1.ubicacion) {
        $.notify('Ingrese la ubicacion del proyecto', {
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
      }else if (!this.proyectos1.fechainicio) {
        $.notify('Seleccione la fecha del proyecto', {
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
      }else if (this.proyectos1.valor <= 0) {
        $.notify('Ingrese un valor válido', {
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
      }else if (!this.proyectos1.estado) {
        $.notify('Seleccione el estado del Proyecto', {
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
      }else { 
        this.load_proyecto = true;
       this._proyectoService.ingresar_proyecto_admin(this.proyectos1,this.token).subscribe(
        response=>{
          $.notify('Se registro el nuevo producto', {
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
            $('#exampleModalCenter').modal('hide');
            this.init_data(); 
            this.load_proyecto = false;   
        }
       );
      }
    }

    openEditModal(proyecto:any){
      $('#exampleModalCenter2').modal('show');
      this._proyectoService.obtener_proyecto_admin(proyecto,this.token).subscribe(
        response=>{
          this.proyectos2 = response.data;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 50);    
        }
      );  
    }

    actualizar(){
      this._proyectoService.actualizar_proyecto_admin(this.proyectos2._id,this.proyectos2,this.token).subscribe(
        response=>{
          $.notify('Se actualizó correctamente el proyecto', {
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
            $('#exampleModalCenter2').modal('hide');
            this.init_data();  
        }
      );
    }

    eliminar_proyecto(idx:any){
      this.load_delete = true;
      this._proyectoService.eliminar_proyecto_admin(idx,this.token).subscribe(
        response=>{          
          if (response.data != undefined) {
            $.notify('Se elimino el proyecto', {
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
              $('#delete-'+idx).modal('hide');
              this.init_data();
          }else{
            $.notify(response.message, {
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
              $('#delete-'+idx).modal('hide');
          }
          this.load_delete = false;
        }
      );
    }
}
