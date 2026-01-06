import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { subscribe } from 'diagnostics_channel';
import { ProductoService } from 'src/app/services/producto.service';
declare var $:any;

@Component({
  selector: 'app-index-productos',
  templateUrl: './index-productos.component.html',
  styleUrls: ['./index-productos.component.css']
})
export class IndexProductosComponent implements OnInit {

    public token = localStorage.getItem('token');
    public filtro_producto = '';
    public productos : any = {
        tipo : '',
        unidad : ''
    };
    public productos2 : any = {
      tipo : '',
      unidad : '',
    };
    public producto : Array<any> = [];
    public producto_const : Array<any> = [];
    public load_data = true;
    public load_delete = true;
    public load_ingresar = true;
    public page = 1;
    public pageSize = 10;

    constructor(
      private _productoService:ProductoService,
      private _router:Router
    ){}

    ngOnInit(): void {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 150); 
      this.init_data();
    }

    init_data(){
      this.load_data = true;
      this._productoService.listar_producto2_admin(this.token).subscribe(
        response=>{
          this.producto = response.data;
          this.producto_const = this.producto;
          this.load_data = false;
        }
      );
    }

    filtrar_data(){
      
      if(this.filtro_producto){
        var term = new RegExp(this.filtro_producto,'i');
        this.producto = this.producto_const.filter(item=>term.test(item.descripcion)||term.test(item.codigo));
      }else{
          this.producto = this.producto_const;
      }
    }

    save(){
      if (!this.productos.codigo) {
        $.notify('Ingrese el codigo del producto', {
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
      }else if (!this.productos.descripcion) {
        $.notify('Ingrese la descripcion del producto', {
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
      }else if (this.productos.precio <=0) {
        $.notify('Ingrese un costo valido', {
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
      }else if (!this.productos.tipo) {
        $.notify('Seleccione el tipo de producto', {
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
      }else if (!this.productos.unidad) {
        $.notify('Seleccione la unidad de medida', {
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
        this.load_ingresar = true;
       this._productoService.registrar_producto2_admin(this.productos,this.token).subscribe(
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
            this.load_ingresar = false;       
        }
       );
      }
    }

    actualizar(){
        this._productoService.actualizar_producto2_admin(this.productos2._id,this.productos2,this.token).subscribe(
          response=>{
            $.notify('Se actualizó correctamente el producto', {
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

    openEditModal(producto:any) {
      
      $('#exampleModalCenter2').modal('show');
      this._productoService.obtener_producto2_admin(producto,this.token).subscribe(
          response=>{
            this.productos2 = response.data;
            setTimeout(() => {
              $('.selectpicker').selectpicker('refresh');
            }, 50);  
          }
      );      
    }
    
    eliminar_producto(idx:any){
      this.load_delete = true;
      this._productoService.eliminar_producto_admin(idx,this.token).subscribe(
        response=>{          
          if (response.data != undefined) {
            $.notify('Se elimino el producto', {
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
