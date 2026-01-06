import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
declare var $:any;

@Component({
  selector: 'app-create-venta',
  templateUrl: './create-venta.component.html',
  styleUrls: ['./create-venta.component.css']
})
export class CreateVentaComponent implements OnInit {
    public load_clientes = false;
    public clientes:Array<any>=[];
    public variedades:Array<any>=[];
    public variedades_const:Array<any>=[];
    public filtro_cliente = '';
    public token = localStorage.getItem('token');
    public venta : any = {
      canal: '',
      empresa: '',
      origen: 'Interno',
      estado: 'Procesando',
    };
    public url = GLOBAL.url;
    public load_variedades = false;
    public filtro_variedad = '';
    public detalles:Array<any>=[];
    public variedad_selected:any = {};

    public total = 0;
    public load_btn = false;

    public correlativo = 0;
    public factura = '';
    public fechafactura = '';
    public vehiculo = '';
    public placa = '';

    editingIndex: number | null = null;
    editingField: string | null = null; 

    constructor(
      private _clienteService:ClienteService,
      private _ventaService:VentaService,
      private _router:Router,
      
    ){}

    ngOnInit(): void {
      this.init_variedades();
    }

    init_clientes(){
      if (this.filtro_cliente) {
        this.load_clientes = true;
        this._clienteService.listar_clientes_modal_admin(this.filtro_cliente,this.token).subscribe(
        response=>{
          this.clientes = response.data;
          this.load_clientes = false;
        }
      );
    }
      else {
        this.clientes=[];
      }
    }

    seleccionar_cliente(item:any){
      this.venta.cliente = item._id;
      $('#inp_cliente').val(item.razonsocial);
      $('#modalCliente').modal('hide');
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

    filtrar_variedades(){
        if (this.filtro_variedad) {
          var term = new RegExp(this.filtro_variedad,'i')
          this.variedades = this.variedades_const.filter(item=>term.test(item.producto.titulo)&&(item.titulo));
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
        if (item.cantidad_detalle<= item.stock) {
            $('.fila-variedad').removeClass('.bg-gris');
            $('#variedad-'+idx).addClass('.bg-gris');
            this.variedad_selected = item;
        }else{
          $.notify('La cantidad exede al stock actual', {
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
      
      this.detalles.push({
        producto: this.variedad_selected.producto._id,
        variedad: this.variedad_selected._id,
        titulo_v: this.variedad_selected.titulo,
        titulo: this.variedad_selected.producto.titulo,
        portada: this.variedad_selected.producto.portada,
        cantidad: this.variedad_selected.cantidad_detalle,
        precio: this.variedad_selected.precio,
        precioEditable: this.variedad_selected.producto.precio,
      });
      $('.fila-variedad').removeClass('.bg-gris');      
      console.log(this.detalles);
      let subtotal = this.variedad_selected.precio* this.variedad_selected.cantidad_detalle;
      this.total = this.total + subtotal;
    }  

    calcularTotal(){
      this.total = 0;
  
      for(const item of this.detalles){
        this.total += (item.precio * item.cantidad);
      }
    }

    eliminar_detalle(idx:any,subtotal:any){
      this.total = this.total - subtotal;
      this.detalles.splice(idx,1);
    }

    ingresar_venta(){
      this.venta.detalles = this.detalles;
      this.venta.monto = this.total;
      this.venta.correlativo = this.correlativo;
      this.venta.factura = this.factura;
      this.venta.fechafactura = this.fechafactura;
      this.venta.vehiculo = this.vehiculo;
      this.venta.placa = this.placa;
      this.venta.saldo = this.total;

      if (!this.venta.cliente) {
        $.notify('Seleccione un cliente', {
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
      } else if(!this.venta.canal){
        $.notify('Seleccione un canal', {
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
      }else if (this.venta.detalles.length == 0) {
        $.notify('Agregue un producto en la venta', {
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
        this._ventaService.generar_venta_admin(this.venta,this.token).subscribe(
          response=>{
            
            this.load_btn = false;
            $.notify('Se ingreso la venta', {
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
              this._router.navigate(['/ventas']);           
            }
          );
        }      
    }

    startEditing(event: Event, field: string, index: number) {
      event.preventDefault(); // Evita cualquier comportamiento por defecto del evento
  
      this.editingField = field;
      this.editingIndex = index;    
  
      // Si deseas hacer algo adicional cuando comienza la edición, puedes hacerlo aquí
    }
  
    stopEditing(field: string, index: number) {
      // Aquí puedes agregar lógica adicional cuando la edición se detiene, si es necesario
      const item = this.detalles[index];

      if (item.cantidad > this.variedad_selected.stock) {
        $.notify('La cantidad exede al stock actual', {
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
          return;
      }     

      this.editingField = null;
      this.editingIndex = null;    
  
      this.calcularTotal();
  
    }
  
    isEditing(field: string, index: number): boolean {
      return this.editingField === field && this.editingIndex === index;
    }
}
