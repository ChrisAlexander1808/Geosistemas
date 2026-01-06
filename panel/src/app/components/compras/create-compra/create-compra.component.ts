import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { CompraService } from 'src/app/services/compra.service';
import { CursoService } from 'src/app/services/curso.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { MatriculaService } from 'src/app/services/matricula.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { VentaService } from 'src/app/services/venta.service';
declare var $:any;

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.css']
})
export class CreateCompraComponent implements OnInit {
  
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
    documento: '',
    tipo: '',
    estado: 'Procesando',
    venta: ''
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

  constructor(
    private _proveedorService:ProveedorService,
    private _compraService:CompraService,
    private _router:Router,
    private _ventaService:VentaService,
  ) { }

  ngOnInit(): void {
   // this.init_cursosbase();
   setTimeout(()=>{
    $('.selectpicker').selectpicker('refresh');
  },150);
    this.init_variedades();
    this.init_ventas();
    this.detalles_compras;
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
        console.log(response.data);
        this.ventas = response.data;
        setTimeout(()=>{
          $('.selectpicker').selectpicker('refresh');
        },150);       
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
      
    this.detalles_compras.push({
      producto: this.variedad_selected.producto._id,
      variedad: this.variedad_selected._id,
      titulo_v: this.variedad_selected.titulo,
      titulo: this.variedad_selected.producto.titulo,
      portada: this.variedad_selected.producto.portada,
      cantidad: this.variedad_selected.cantidad_detalle,
      precio: this.variedad_selected.precio,
      descuento: this.variedad_selected.producto.descuento,
    });
    
    $('.fila-variedad').removeClass('.bg-gris');
    console.log('Antes de editar',this.detalles_compras);
    let subtotal = (this.variedad_selected.precio* this.variedad_selected.cantidad_detalle);
    this.total = this.total + subtotal;  
    
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
      this.compra.detalles_compras = this.detalles_compras;
      this.compra.monto = this.total;
      this.compra.saldo = this.total;
      this.compra.descuento = this.descuentototal;
      this.compra.correlativo = this.correlativo_compra;

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
  
}
