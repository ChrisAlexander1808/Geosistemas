import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { IngresoService } from 'src/app/services/ingreso.service';
declare var $:any;

@Component({
  selector: 'app-edit-ingresos',
  templateUrl: './edit-ingresos.component.html',
  styleUrls: ['./edit-ingresos.component.css']
})
export class EditIngresosComponent implements OnInit {

    public token = localStorage.getItem('token');
    
    public ingresos : any = {};
    public ingresos_detalle : Array<any>=[];
    public proyectos:Array<any>=[];
    public proyectos_const:Array<any>=[];
    public load_proyectos = true;
    public filtro_proyecto = '';
    public id = '';
    public total_detalle = 0;
    public filtro_producto = '';

    public productos:Array<any>=[];
    public productos_const:Array<any>=[];

    public detalles:Array<any>=[];
    public producto_selected:any = {};
    public load_delete = true;
    public correlativo = 0;
    public factura = '';
    public fechafactura = '';
    public load_productos = true;
    public load_btn = false;
    public nombreProyecto: String = '';
    public fileTmp: any;
    public archivopdf: any = undefined;
    public url = GLOBAL.url;

    editingIndex: number | null = null;
    editingField: string | null = null; 

    constructor(
      private _ingresoService:IngresoService,
      private cdRef:ChangeDetectorRef,
      private _router:Router,
      private _route:ActivatedRoute,
    ){}

    ngOnInit(): void {
      this.init_proyectos();
      this.init_productos();
      this._route.params.subscribe(
        params=>{
          this.id = params['id'];       
          this._ingresoService.obtener_ingreso(this.id,this.token).subscribe(
            response=>{          
              this.ingresos = response.data;
              this.nombreProyecto = this.ingresos.proyecto?.nombre || '';
              this.archivopdf = this.ingresos.archivoPDF || ''; 
            }
          )
          this._ingresoService.obtener_detalle_ingreso(this.id,this.token).subscribe(
            response=>{
              this.ingresos_detalle = response.data;               
              this.total_detalle = 0;
  
              for (const detalle of this.ingresos_detalle) {
                const subtotal = detalle.precio * detalle.cantidad;
                this.total_detalle += subtotal;
              }
            }
          ); 
        }
      );
    }
 
    seleccionar_proyecto(item:any){
      this.ingresos.proyecto = item._id;
      this.ingresos.cliente = item.cliente;
      $('#inp_cliente').val(item.nombre);
      $('#modalCliente').modal('hide');
    }

    init_proyectos(){
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

    fileEventChange($event: any): void {     
        const [file] = $event.target.files;
        this.fileTmp = {
          fileRaw:file,
          fileName:file.name
        } 
        this.archivopdf = file; 
        this.ingresos.archivopdf = this.archivopdf;   
        console.log(this.archivopdf);
      }

    quitar_detalle(id:any,subtotal:any){
      this.total_detalle = this.total_detalle - subtotal; 
      this.ingresos_detalle.splice(id,1);
    }

    eliminar_detalle(idx:any){   
     
      this.load_delete = true;
      this._ingresoService.eliminar_detalle_ingreso_admin(idx,this.token).subscribe(
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

    this._ingresoService.obtener_detalle_ingreso(this.id,this.token).subscribe(
      response=>{
        this.ingresos_detalle = response.data;  
        this.total_detalle = 0;

        for (const detalle of this.ingresos_detalle) {
          const subtotal = detalle.precio * detalle.cantidad;
          this.total_detalle += subtotal;
        }
      });
  }

    agregar_detalle(){

      const nuevoDetalle = {
  
        producto: this.producto_selected._id,
        descripcion: this.producto_selected.descripcion,
        cantidad: this.producto_selected.cantidad_detalle,
        precio: this.producto_selected.precio,
        isNew : true,
      }
      
      this.ingresos_detalle.push(nuevoDetalle);
      $('.fila-variedad').removeClass('.bg-gris');
      let subtotal = nuevoDetalle.precio * nuevoDetalle.cantidad;
      this.total_detalle += subtotal;
      this.cdRef.detectChanges();
      this.calcularTotal();
    }

    calcularTotal(){
      this.total_detalle = 0;
  
      for(const item of this.ingresos_detalle){
        this.total_detalle += (item.precio * item.cantidad);
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
  
      this.editingField = null;
      this.editingIndex = null;    
  
      this.calcularTotal();
  
    }
  
    isEditing(field: string, index: number): boolean {
      return this.editingField === field && this.editingIndex === index;
    }

    actualizar_venta(){
    this.ingresos.ingresos_detalle = this.ingresos_detalle;
    this.ingresos.monto = this.total_detalle;
    this.ingresos.saldo = this.total_detalle;

    this._ingresoService.actualizar_ingreso_admin(this.id,this.ingresos,this.token).subscribe(
      response=>{   
        console.log(this.ingresos);    
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
          this._router.navigate(['/ingresos']); 
      }
    ); 
        
  }
}
