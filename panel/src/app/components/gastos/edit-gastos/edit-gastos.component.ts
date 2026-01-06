import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GastoService } from 'src/app/services/gasto.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
declare var $:any;

@Component({
  selector: 'app-edit-gastos',
  templateUrl: './edit-gastos.component.html',
  styleUrls: ['./edit-gastos.component.css']
})
export class EditGastosComponent implements OnInit {

  public token = localStorage.getItem('token');
  public filtro_producto = '';
  public proyectos:Array<any> =[];
  public proyectos_const:Array<any> =[];
  public productos:Array<any>=[];
  public productos_const:Array<any>=[];  
  public filtro_proyecto = '';
  public proveedores:Array<any> =[];
  public load_productos = false;
  public producto_selected:any = {};
  public detalles_compras :Array<any> =[];
  public total = 0;
  editingIndex: number | null = null;
  editingField: string | null = null; 

  public load_proyectos = false;
  public load_btn = false;
  public url = GLOBAL.url;

  public gastos:any={
    tipo: '',
    categoria: '',
    estado: 'Procesando',
    proveedor: '',
  };  
  public monto = 0;
  public descuentototal = 0;
  public correlativo_compra = 0;
  public factura = '';
  public fechafactura = '';
  public observaciones = '';
  public documento = '';
  public tipo = '';
  public btn_load = false;
  
  public nombreComercial: String = '';
  public nombreProyecto: String = '';
  public compras_detalle : Array<any>=[];
  public total_detalle = 0;
  public load_delete = false;
  public id = '';
  
    constructor(
      private _ingresoService:IngresoService,
      private _proveedorService:ProveedorService,
      private cdRef:ChangeDetectorRef,
      private _gastoService:GastoService,
      private _router:Router,
      private _route:ActivatedRoute,
    ){}

    ngOnInit(): void {
      setTimeout(()=>{
        $('.selectpicker').selectpicker();
      },150);
      this.init_productos();
      this.detalles_compras;
      this.init_proyecto();
      this.init_proveedores();

      this._route.params.subscribe(
        params=>{
          this.id = params['id'];       
          this._gastoService.obtener_gasto(this.id,this.token).subscribe(
            response=>{          
              this.gastos = response.data;
              this.nombreComercial = this.gastos.proveedor?.nombrecomercial || '';
              this.nombreProyecto = this.gastos.proyecto?.nombre || '';                  
            }
          )
          this._gastoService.obtener_detalle_gasto(this.id,this.token).subscribe(
            response=>{
              this.compras_detalle = response.data;  
              this.total_detalle = 0;
  
              for (const detalle of this.compras_detalle) {
                const subtotal = detalle.precio * detalle.cantidad;
                this.total_detalle += subtotal;
              }
            }
          ); 
        }
      );
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
      this.proyectos = [];
      this._ingresoService.listar_proyectos_modal_admin(this.token).subscribe(
        response=>{
          this.proyectos = response.data;
          this.proyectos_const = this.proyectos;
          this.load_proyectos = false;
        }
      );
    }

    seleccionar_proyecto(item:any){
    
      this.gastos.proyecto = item._id;
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
        this.proyectos = this.proyectos_const.filter(item=>term.test(item.nombre)&&(item.ubicacion));
      }else{
        this.proyectos = this.proyectos_const;
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

    const nuevoDetalle = {
      producto: this.producto_selected._id,
      descripcion: this.producto_selected.descripcion,
      cantidad: this.producto_selected.cantidad_detalle,
      precio: this.producto_selected.precio,
      isNew : true,
    }
    this.compras_detalle.push(nuevoDetalle);    
    $('.fila-variedad').removeClass('.bg-gris');   
    let subtotal = this.producto_selected.precio* this.producto_selected.cantidad;
      this.cdRef.detectChanges();
      this.calcularTotal();
    
  } 

  quitar_detalle(id:any,subtotal:any){
    this.total_detalle = this.total_detalle - subtotal; 
    this.compras_detalle.splice(id,1);
  }

  calcularTotal(){
    this.total_detalle = 0;

    for(const item of this.compras_detalle){
      const descuento = item.descuento ?? 0;
      this.total_detalle += (item.precio * item.cantidad - descuento);
    }
  }

  calcularDescuento(){
    this.descuentototal = 0;

    for(const item of this.compras_detalle){
      const descuento = item.descuento ?? 0;
      this.descuentototal += descuento;
    }    
  }

  eliminar_detalle(idx:any){
    this.load_delete = true;
    this._gastoService.eliminar_detalle_gasto_admin(idx,this.token).subscribe(
      response=>{          
        if (response.data != undefined) {
          $.notify('Se elimino la variedad', {
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
            this.refrescar_detalle();
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

  refrescar_detalle(){

    this._gastoService.obtener_detalle_gasto(this.id,this.token).subscribe(
      response=>{
        this.compras_detalle = response.data;  
        this.total_detalle = 0;

        for (const detalle of this.compras_detalle) {
          const subtotal = detalle.precio * detalle.cantidad;
          this.total_detalle += subtotal;
        }
      });
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

  actualizar_compra(){
    this.gastos.compras_detalle = this.compras_detalle;
    this.gastos.monto = this.total_detalle;
    this.gastos.saldo = this.total_detalle;

  this._gastoService.actualizar_gasto_admin(this.id,this.gastos,this.token).subscribe(
    response=>{       
      $.notify('Se actualizó correctamente la Compra', {
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
