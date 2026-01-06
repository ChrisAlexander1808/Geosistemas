import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Console } from 'console';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GastoService } from 'src/app/services/gasto.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
declare var $:any;


@Component({
  selector: 'app-create-gastos',
  templateUrl: './create-gastos.component.html',
  styleUrls: ['./create-gastos.component.css']
})
export class CreateGastosComponent implements OnInit {

    public filtro_proyecto = '';
    public proyecto:Array<any> =[];
    public proyecto_const:Array<any> =[];
    public token = localStorage.getItem('token');
    public filtro_producto = '';
    public productos:Array<any>=[];
    public productos_const:Array<any>=[];  
    public load_productos = false;
    public producto_selected:any = {};
    public detalles_compras :Array<any> =[];
    public total = 0;
    public proveedores:Array<any>=[];

    editingIndex: number | null = null;
    editingField: string | null = null; 

    public load_proyectos = false;
    public load_btn = false;
    public url = GLOBAL.url;

    public gasto:any={
      proveedor: '',
      estado: 'Procesando',
    };
    
    public monto = 0;
    public descuentototal = 0;
    public correlativo_compra = 0;
    public factura = '';
    public fechafactura = '';
    public tipo = '';
    public categoria = ''

    public btn_load = false;

    constructor(
      private _ingresoService:IngresoService,
      private _proveedorService:ProveedorService,
      private cdRef:ChangeDetectorRef,
      private _gastoService:GastoService,
      private _router:Router,
    ){}

    ngOnInit(): void {
      setTimeout(()=>{
        $('.selectpicker').selectpicker();
      },150);
      this.init_productos();
      this.detalles_compras;
      this.init_proyecto();
      this.init_proveedores();
    }
    init_proveedores(){
      this._proveedorService.listar_proveedores_admin(this.token).subscribe(
        response=>{
          this.proveedores = response.data;
          setTimeout(()=>{
            $('.selectpicker').selectpicker('refresh');
          },150);
        }
      );
    }

    init_proyecto(){
      this.load_proyectos = true;
      this.proyecto = [];
      this._ingresoService.listar_proyectos_modal_admin(this.token).subscribe(
        response=>{
          this.proyecto = response.data;
          this.proyecto_const = this.proyecto;
          this.load_proyectos = false;
          console.log(this.proyecto);
        }
      );
    }

    seleccionar_proyecto(item:any){
    
      this.gasto.proyecto = item._id;
      $('#inp_proyecto').val(item.nombre);
      $('#modalProyecto').modal('hide');

    }

    init_productos(){
      this.load_productos = true;
      this.productos = [];
      this._ingresoService.obtener_producto_admin(this.token).subscribe(
        response=>{       
          for(var item of response.data){
            item.cantidad_detalle = 0;
            if (item.precio>=1) {
              this.productos.push(item);
            }
          }
          this.productos_const = this.productos;
          this.load_productos = false;
        }
      );
    }

    filtrar_productos(){
      if (this.filtro_producto) {
        var term = new RegExp(this.filtro_producto,'i')
        this.productos = this.productos_const.filter(item=>term.test(item.descripcion));
      } else {
        this.productos = this.productos_const;
      }
    }

    filtrar_proyecto(){
      if (this.filtro_proyecto) {
        var term = new RegExp(this.filtro_proyecto,'i')
        this.proyecto = this.proyecto_const.filter(item=>term.test(item.nombre)&&(item.ubicacion));
      }else{
        this.proyecto = this.proyecto_const;
      }
    }

    aumentar_cantidad(idx:any){
      this.productos[idx].cantidad_detalle = this.productos[idx].cantidad_detalle+1;
    }

    disminuir_cantidad(idx:any){
      this.productos[idx].cantidad_detalle = this.productos[idx].cantidad_detalle-1;
    }

    seleccionar_variedad(item:any,idx:any){
    if (item.cantidad_detalle>=1) {      
          $('.fila-variedad').removeClass('.bg-gris');
          $('#variedad-'+idx).addClass('.bg-gris');
          this.producto_selected = item;      
    }else{
      $.notify('La cantidad no puede ser 0', {
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
    }
  }

  agregar_detalle(){
      
    this.detalles_compras.push({
      producto: this.producto_selected._id,
      descripcion: this.producto_selected.descripcion,
      cantidad: this.producto_selected.cantidad_detalle,
      precio: this.producto_selected.precio,
    });
    
    $('.fila-variedad').removeClass('.bg-gris');
    $('#modalProducto').modal('hide');
    let subtotal = this.producto_selected.precio* this.producto_selected.cantidad;
      this.total = this.total + subtotal;
      this.cdRef.detectChanges();
      this.calcularTotal();
    
  } 

  calcularTotal(){
    this.total = 0;

    for(const item of this.detalles_compras){
      const descuento = item.descuento ?? 0;
      this.total += (item.precio * item.cantidad - descuento);
    }
  }

  calcularDescuento(){
    this.descuentototal = 0;

    for(const item of this.detalles_compras){
      const descuento = item.descuento ?? 0;
      this.descuentototal += descuento;
    }    
  }

  eliminar_detalle(idx:any,subtotal:any,descuento:any){
    this.total = this.total - subtotal;

    if(descuento !== null && descuento !== undefined){
      this.descuentototal = this.descuentototal - descuento;
    }    
    this.detalles_compras.splice(idx,1);
    this.calcularTotal();
    this.calcularDescuento();
    
  }
  
  startEditing(event: Event, field: string, index: number) {
    event.preventDefault(); // Evita cualquier comportamiento por defecto del evento

    this.editingField = field;
    this.editingIndex = index;    

    // Si deseas hacer algo adicional cuando comienza la edición, puedes hacerlo aquí
  }

  stopEditing(field: string, index: number) {
    // Aquí puedes agregar lógica adicional cuando la edición se detiene, si es necesario

    this.editingField = null;
    this.editingIndex = null;    

    this.calcularTotal();
    this.calcularDescuento();

  }

  isEditing(field: string, index: number): boolean {
    return this.editingField === field && this.editingIndex === index;
  }

  registrar_compra(){
      this.gasto.detalles_compras = this.detalles_compras;
      this.gasto.monto = this.total;
      this.gasto.saldo = this.total;
      this.gasto.descuento = this.descuentototal;
      this.gasto.correlativo = this.correlativo_compra;
      this.gasto.factura = this.factura;
      this.gasto.fechafactura = this.fechafactura;
      this.gasto.categoria = this.categoria;
      this.gasto.tipo = this.tipo;

      if (!this.gasto.proyecto) {
        $.notify('Seleccione un proyecto', {
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
      } else if(!this.gasto.proveedor){
        $.notify('Seleccione el tipo de documento', {
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
      }else if(!this.gasto.tipo){
        $.notify('Seleccione el tipo de compra', {
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
      }else if (this.gasto.detalles_compras.length == 0) {
        $.notify('Agregue un detalle en la compra', {
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
        this.load_btn = true;
        this._gastoService.generar_gasto_admin(this.gasto,this.token).subscribe(
          response=>{            
            this.load_btn = false;
            console.log(response);
            $.notify('Se ingreso la compra', {
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
              this._router.navigate(['/gastos']);           
            }
          );
        }      
  }
}
