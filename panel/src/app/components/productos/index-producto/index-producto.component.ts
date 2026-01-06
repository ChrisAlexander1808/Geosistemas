import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { TestService } from 'src/app/services/test.service';
declare var $:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit{

    public productos:Array<any>=[];
    public productos_const:Array<any>=[];
    public categorias:Array<any>=[];
    public url = GLOBAL.url;   
    public token = localStorage.getItem('token');
    
    public filtro_categoria = 'Todos';
    public filtro_estado = 'Todos';
    public filtro_producto = '';
    public load_data = true;

    public page = 1;
    public pageSize = 10;

    public load_estado = false;
    public categoria:Array<any>=[];

    constructor(
      private _productoService:ProductoService,
      private _testService:TestService
    ){
      this.init_configuraciones();
    }

    ngOnInit(): void {
      this.init_productos();
      this.init_categorias();
    }

    init_productos(){
      this.load_data = true;
      this._productoService.listar_producto_admin(localStorage.getItem('token')).subscribe(
        response=>{
          this.productos = response.data;
          this.productos_const = this.productos;
          this.load_data = false;
        }
      )
    }

    init_categorias(){
      this._productoService.obtener_configuraciones().subscribe(
        response=>{
          this.categorias = response.categorias;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 50);
        }
      );
    }

    filtrar(){
        if (this.filtro_categoria == 'Todos') {
          if (this.filtro_estado == 'Todos') {
            var term = new RegExp(this.filtro_producto,'i');
            this.productos = this.productos_const.filter(item=>term.test(item.titulo));
          }else{
            if (this.filtro_estado == 'Disponible') {
              var term = new RegExp(this.filtro_producto,'i');
              this.productos = this.productos_const.filter(item=>term.test(item.titulo)&&item.estado);
            }else if (this.filtro_estado == 'Desactivado') {
              var term = new RegExp(this.filtro_producto,'i');
              this.productos = this.productos_const.filter(item=>term.test(item.titulo)&&!item.estado);
            }
          }
        }else{
          if (this.filtro_estado == 'Todos') {
            var term = new RegExp(this.filtro_producto,'i');
            this.productos = this.productos_const.filter(item=>term.test(item.titulo)&&item.categoria == this.filtro_categoria);
          }else{
            if (this.filtro_estado == 'Disponible') {
              var term = new RegExp(this.filtro_producto,'i');
              this.productos = this.productos_const.filter(item=>term.test(item.titulo)&&item.estado&&item.categoria == this.filtro_categoria);
            }else if (this.filtro_estado == 'Desactivado') {
              var term = new RegExp(this.filtro_producto,'i');
              this.productos = this.productos_const.filter(item=>term.test(item.titulo)&&!item.estado&&item.categoria == this.filtro_categoria);
            }
          }
        }
    }

    set_state(id:any,estado:any){
      this.load_estado = true;
      this._productoService.cambiar_estado_producto_admin(id,{estado:estado},localStorage.getItem('token')).subscribe(
        response=>{
          this.load_estado = false;
          $('#estado-'+id).modal('hide');
          this.init_productos();
        }
      );
    }

    init_configuraciones(){
      this._testService.obtener_configuracion_general(this.token).subscribe(
        response=>{
          let unidad_medida = response.data.categoria.split(',');
          for (var item of unidad_medida){
            this.categoria.push(item.trim());
          }
          this.categoria;
        }
      );
  }
}
