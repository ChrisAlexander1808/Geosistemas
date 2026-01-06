import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Console, error } from 'console';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { IngresoService } from 'src/app/services/ingreso.service';
declare var $:any;

@Component({
  selector: 'app-create-ingresos',
  templateUrl: './create-ingresos.component.html',
  styleUrls: ['./create-ingresos.component.css']
})
export class CreateIngresosComponent implements OnInit {

    public load_proyectos = true;
    public proyectos:Array<any>=[];
    public proyectos_const:Array<any>=[];
    public filtro_proyecto = '';
    public token = localStorage.getItem('token');
    public ingreso : any = {
      cliente: '',
      tipo: '',
      estado: 'Procesando',
    };
    public url = GLOBAL.url;
    public load_productos = false;
    public filtro_producto = '';
    public productos:Array<any>=[];
    public productos_const:Array<any>=[];
    public detalles:Array<any>=[];
    public producto_selected:any = {};

    public total = 0;
    public load_btn = false;

    public correlativo = 0;
    public factura = '';
    public fechafactura = '';
    public archivopdf: any = undefined;

    pdfFile:File | undefined;

    editingIndex: number | null = null;
    editingField: string | null = null; 
    public fileTmp: any;

    constructor(
      private _ingresoService:IngresoService,
      private cdRef:ChangeDetectorRef,
      private _router:Router,
    ){}

    ngOnInit(): void {
      this.init_productos();
      this.init_proyectos();
    }

    seleccionar_proyecto(item:any){
      this.ingreso.proyecto = item._id;
      this.ingreso.cliente = item.cliente;
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
      console.log('Se ha seleccionado una variedad',item);    
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
      
        this.detalles.push({
          producto: this.producto_selected._id,
          descripcion: this.producto_selected.descripcion,
          cantidad: this.producto_selected.cantidad_detalle,
          precio: this.producto_selected.precio,
        });
        $('.fila-variedad').removeClass('.bg-gris');
        let subtotal = this.producto_selected.precio* this.producto_selected.cantidad;
        this.total = this.total + subtotal;
        this.cdRef.detectChanges();
        this.calcularTotal();
          
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

    fileEventChange($event: any): void {
    /* var file: any;
      if (event.target.files && event.target.files[0]) {
        file = <File>event.target.files[0];
        console.log(file);
        this.fileName = file.name;
    
        if (file.type == 'application/pdf') { // Corregir aquí también 'archivo/pdf' a 'application/pdf'
          this.archivopdf = file;
          this.ingreso.archivoPDF = this.archivopdf;
    
          const reader = new FileReader();
          reader.readAsDataURL(file);
        } else {
          $.notify('Solo se permite la selección de archivos PDF.', {
            type: 'danger',
            spacing: 10,
            timer: 2000,
            placement: {
              from: 'top',
              align: 'right'
            }
          });
          this.archivopdf = undefined;
        }
      }*/

      
      const [file] = $event.target.files;
      this.fileTmp = {
        fileRaw:file,
        fileName:file.name
      } 
      this.archivopdf = file; 
      this.ingreso.archivopdf = this.archivopdf;   
    }
  /*
    sendFile():void{
      const body = new FormData();
      body.append('myFile',this.fileTmp.fileRaw,this.fileTmp.fileName);     
      this._ingresoService.sendPost(body).subscribe(
        response=>{
          
          $.notify('Se guardo el archivo correctamente', {
            type: 'success',
            spacing: 10,
            timer: 2000,
            placement: {
              from: 'top',
              align: 'right'
            }
          });
          console.log(body);
        }
      )
    }
*/
    ingresar_venta(){
      this.ingreso.detalles = this.detalles;
      this.ingreso.monto = this.total;
      this.ingreso.correlativo = this.correlativo;
      this.ingreso.factura = this.factura;
      this.ingreso.fechafactura = this.fechafactura;
      this.ingreso.saldo = this.total;

      if (!this.ingreso.proyecto) {
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
      } else if(!this.ingreso.tipo){
        $.notify('Seleccione el tipo de venta', {
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
      }else if (this.ingreso.detalles.length == 0) {
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
              exit: 'animated' + 'bounce',
            }
          }); 
      }else{
        this.load_btn = true;
        this._ingresoService.generar_ingreso_admin(this.ingreso,this.token).subscribe(
            response=>{     
              console.log(this.ingreso);         
              this.load_btn = false;
              $.notify('Se ingresó la venta', {
                type: 'success',
                spacing: 10,
                timer: 2000,
                placement: {
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
}
