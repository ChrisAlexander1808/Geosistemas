import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
declare var $:any;

@Component({
  selector: 'app-edit-venta',
  templateUrl: './edit-venta.component.html',
  styleUrls: ['./edit-venta.component.css']
})
export class EditVentaComponent implements OnInit {

  public id = '';
  public load_data = true;
  public load_delete = false;
  public data = false;
  public str_portada : any = '';
  public ventas : any = {};
  public nombreComercial: String = '';
  public ventas_detalle : Array<any>=[];
  public filtro_cliente = '';
  public token = localStorage.getItem('token');
  public load_clientes = false;
  public clientes:Array<any>=[];
  public variedades:Array<any>=[];
  public variedades_const:Array<any>=[];
  public venta : any = {
    canal: '',
    origen: 'Interno',
    estado: 'Procesando',
  };
  public url = GLOBAL.url;
  public load_variedades = false;
  public filtro_variedad = '';
  public variedad_selected:any = {};
  public producto : any = {};
  public total = 0;
  public total_detalle = 0;
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
      private _route:ActivatedRoute,
    ){}
  ngOnInit(): void { 
    this.init_variedades(); 
     
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];       
        this._ventaService.obtener_ventas(this.id,this.token).subscribe(
          response=>{          
            this.ventas = response.data;
            this.nombreComercial = this.ventas.cliente?.nombrecomercial || '';
          }
        )
        this._ventaService.obtener_detalle_ventas(this.id,this.token).subscribe(
          response=>{
            this.ventas_detalle = response.data;  
            this.total_detalle = 0;

            for (const detalle of this.ventas_detalle) {
              const subtotal = detalle.precio * detalle.cantidad;
              this.total_detalle += subtotal;
            }
          }
        ); 
      }
    );
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

    const nuevoDetalle = {

       producto: this.variedad_selected.producto._id,
       variedad: this.variedad_selected._id,  
       titulo_v: this.variedad_selected.titulo,
       titulo: this.variedad_selected.producto.titulo,
       portada: this.variedad_selected.producto.portada,     
       cantidad: this.variedad_selected.cantidad_detalle,
       precio: this.variedad_selected.precio,
       isNew : true,
    }
    
    this.ventas_detalle.push(nuevoDetalle);
    $('.fila-variedad').removeClass('.bg-gris');
    console.log(this.ventas_detalle);
    let subtotal = nuevoDetalle.precio * nuevoDetalle.cantidad;
    this.total_detalle += subtotal;

  }

  calcularTotal(){
    this.total_detalle = 0;

    for(const item of this.ventas_detalle){
      this.total_detalle += (item.precio * item.cantidad);
    }
  }

  refrescar_detalle(){

    this._ventaService.obtener_detalle_ventas(this.id,this.token).subscribe(
      response=>{
        this.ventas_detalle = response.data;  
        this.total_detalle = 0;

        for (const detalle of this.ventas_detalle) {
          const subtotal = detalle.precio * detalle.cantidad;
          this.total_detalle += subtotal;
        }
      });
  }

  quitar_detalle(id:any,subtotal:any){
    this.total_detalle = this.total_detalle - subtotal; 
    this.ventas_detalle.splice(id,1);
  }

  eliminar_detalle(idx:any){   
     
      this.load_delete = true;
      this._ventaService.eliminar_detalle_venta_admin(idx,this.token).subscribe(
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

  actualizar_venta(){
      this.venta.ventas_detalle = this.ventas_detalle,
      this.venta.monto = this.total_detalle,
      this.venta.saldo = this.total_detalle,
      this.venta.factura = this.factura;
      this.venta.fechafactura = this.fechafactura;
      this.venta.vehiculo = this.vehiculo;
      this.venta.placa = this.placa;

    this._ventaService.actualizar_venta_admin(this.id,{...this.ventas,ventas_detalle:this.ventas_detalle,monto:this.total_detalle,saldo:this.total_detalle},this.token).subscribe(
      response=>{       
        console.log(response);
        $.notify('Se actualizó correctamente la Venta', {
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

  startEditing(event: Event, field: string, index: number) {
    event.preventDefault(); // Evita cualquier comportamiento por defecto del evento

    this.editingField = field;
    this.editingIndex = index;    

    // Si deseas hacer algo adicional cuando comienza la edición, puedes hacerlo aquí
  }

  stopEditing(field: string, index: number) {
    // Aquí puedes agregar lógica adicional cuando la edición se detiene, si es necesario
    const item = this.ventas_detalle[index];

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
