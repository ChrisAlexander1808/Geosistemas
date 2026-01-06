import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { CompraService } from 'src/app/services/compra.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { VentaService } from 'src/app/services/venta.service';
declare var $:any;

@Component({
  selector: 'app-edit-compra',
  templateUrl: './edit-compra.component.html',
  styleUrls: ['./edit-compra.component.css']
})
export class EditCompraComponent implements OnInit {

  public token = localStorage.getItem('token');
  public filtro_variedad = '';
  public variedades:Array<any>=[];
  public variedades_const:Array<any>=[];  
  public filtro_proveedor = '';
  public proveedor:Array<any> =[];
  public load_variedades = false;
  public variedad_selected:any = {};
  public detalles_compras :Array<any> =[];
  public total = 0;
  editingIndex: number | null = null;
  editingField: string | null = null; 

  public load_proveedores = false;
  public load_btn = false;
  public url = GLOBAL.url;

  public compra:any={
    tipo: '',
    documento: '',
    estado: 'Procesando',
    venta:''
  };  
  public ventas:Array<any> =[];
  public monto = 0;
  public descuentototal = 0;
  public correlativo_compra = 0;
  public factura = '';
  public fechafactura = '';
  public observaciones = '';
  public documento = '';
  public tipo = '';
  public btn_load = false;

  public compras : any = {};
  public nombreComercial: String = '';
  public nit:String = '';
  public compras_detalle : Array<any>=[];
  public total_detalle = 0;
  public load_delete = false;
  public id = '';

    constructor(
      private _proveedorService:ProveedorService,
      private _ventaService:VentaService,
      private _compraService:CompraService,
      private _router:Router,
      private _route:ActivatedRoute,
    ){}

    ngOnInit(): void {
      this.init_variedades();
      this.init_ventas();
      setTimeout(()=>{
        $('.selectpicker').selectpicker();
      },150);
      this._route.params.subscribe(
        params=>{
          this.id = params['id'];       
          this._compraService.obtener_compra(this.id,this.token).subscribe(
            response=>{          
              this.compras = response.data;
              this.nombreComercial = this.compras.proveedor?.nombrecomercial || '';
              this.nit = this.compras.proveedor?.nit || '';
            }
          )
          this._compraService.obtener_detalle_compra(this.id,this.token).subscribe(
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

    init_proveedor(){
      if (this.filtro_proveedor) {
        this.load_proveedores = true;
        this._proveedorService.listar_proveedores_modal_admin(this.filtro_proveedor,this.token).subscribe(
        response=>{
          this.proveedor = response.data;
          this.load_proveedores = false;
        }
      );
    }
      else {
        this.proveedor=[];
      }
    }

    init_ventas(){
      this._compraService.listar_ventas_admin(this.token).subscribe(
        response=>{
          setTimeout(()=>{
            $('.selectpicker').selectpicker();
          },150);
          this.ventas = response.data;
        }
      );
    }
  
    seleccionar_proveedor(item:any){
      
        this.compra.proveedor = item._id;
        this.compra.nit = item.nit;
        $('#inp_proveedor').val(item.razonsocial);
        $('#inp_nit').val(item.nit);
        $('#modalProveedor').modal('hide');
  
    }
  
    filtrar_variedades(){
      if (this.filtro_variedad) {
        var term = new RegExp(this.filtro_variedad,'i')
        this.variedades = this.variedades_const.filter(item=>term.test(item.producto.titulo));
      } else {
        this.variedades = this.variedades_const;
      }
    }
  
    aumentar_cantidad(idx:any){
      this.variedades[idx].cantidad_detalle = this.variedades[idx].cantidad_detalle+1;
    }
  
    disminuir_cantidad(idx:any){
      this.variedades[idx].cantidad_detalle = this.variedades[idx].cantidad_detalle-1;
    }
  
    seleccionar_variedad(item:any,idx:any){
      console.log('Se ha seleccionado una variedad',item);
      if (item.cantidad_detalle>=1) {      
            $('.fila-variedad').removeClass('.bg-gris');
            $('#variedad-'+idx).addClass('.bg-gris');
            this.variedad_selected = item;      
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
  
    init_variedades(){
      this.load_variedades = true;
      this.variedades = [];
      this._ventaService.obtener_variedad_admin(this.token).subscribe(
        response=>{       
          for(var item of response.data){
            item.cantidad_detalle = 0;
            if (item.producto.precio>=1) {
              this.variedades.push(item);
            }
          }
          this.variedades_const = this.variedades;
          this.load_variedades = false;
        }
      );
    }

    agregar_detalle(){
      
      const nuevoDetalle = {
        producto: this.variedad_selected.producto._id,
        variedad: this.variedad_selected._id,  
        titulo_v: this.variedad_selected.titulo,
        titulo: this.variedad_selected.producto.titulo,
        portada: this.variedad_selected.producto.portada,     
        cantidad: this.variedad_selected.cantidad_detalle,
        precio: this.variedad_selected.precio,
        descuento: this.variedad_selected.producto.descuento,
        isNew : true,
      }
      this.compras_detalle.push(nuevoDetalle);    
      $('.fila-variedad').removeClass('.bg-gris');
      let subtotal = (this.variedad_selected.precio* this.variedad_selected.cantidad_detalle);
      this.total_detalle = this.total_detalle + subtotal;  
      
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
  
    quitar_detalle(id:any,subtotal:any){
      this.total_detalle = this.total_detalle - subtotal; 
      this.compras_detalle.splice(id,1);
    }
  
    eliminar_detalle(idx:any){   
     
      this.load_delete = true;
      this._compraService.eliminar_detalle_compra_admin(idx,this.token).subscribe(
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

      this._compraService.obtener_detalle_compra(this.id,this.token).subscribe(
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

    registrar_compra(){
      this.compra.detalles_compras = this.detalles_compras;
      this.compra.monto = this.total;
      this.compra.saldo = this.total;
      this.compra.descuento = this.descuentototal;
      this.compra.correlativo = this.correlativo_compra;
      this.compra.factura = this.factura;
      this.compra.fechafactura = this.fechafactura;
      this.compra.observaciones = this.observaciones;
      this.compra.documento = this.documento;
      this.compra.tipo = this.tipo;

      if (!this.compra.proveedor) {
        $.notify('Seleccione un proveedor', {
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
      } else if(!this.compra.factura){
        $.notify('Digite el Número de Factura', {
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
      }else if(!this.compra.fechafactura){
        $.notify('Seleccione la fecha de factura', {
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
      }else if(!this.compra.documento){
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
      }else if(!this.compra.tipo){
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
      }else if (this.compra.detalles_compras.length == 0) {
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
        this._compraService.generar_compra_admin(this.compra,this.token).subscribe(
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
              this._router.navigate(['/compras']);           
            }
          );
        }     

    }  

    actualizar_compra(){

    this._compraService.actualizar_compra_admin(this.id,{...this.compras,compras_detalle:this.compras_detalle,monto:this.total_detalle,saldo:this.total_detalle},this.token).subscribe(
      response=>{       
        console.log(response);
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
          this._router.navigate(['/compras']); 
      }
    ); 
    }
}
