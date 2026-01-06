import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { TestService } from 'src/app/services/test.service';
declare var $ : any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto : any = {
    tipo: '',
    categoria: ''
  };
  public portada: any = undefined;
  public str_portada : any = 'assets/cargar.jpg';
  public categorias : Array<any> = [];
  public token = localStorage.getItem('token');

  public load_btn = false;
  public categoria:Array<any>=[]; 
  public ubicacion:Array<any>=[];

  constructor(
    private _productosService:ProductoService,
    private _router:Router,
    private _testService:TestService
  ){
    this.init_configuraciones();
    this.init_configuraciones2();
  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 50);
    this.init_categorias();
  }

  fileEventChange(event:any):void{

    var file : any;
      if(event.target.files && event.target.files[0]){
        file = <File>event.target.files[0];
        console.log(file);

        if(file.size <= 500000){
          if(file.type == 'image/jpeg'||file.type == 'image/png'||file.type == 'image/web'||file.type == 'image/jpg'){
            this.portada = file;
            this.producto.portada = this.portada;

            const reader = new FileReader();
            reader.onload = e => this.str_portada = reader.result;
            reader.readAsDataURL(file);

            console.log(reader);
          }else{
            $.notify('Solo se permite la seleccion de imagen.', {
              type: 'danger',
              spacing: 10,
              timer: 2000,
              placement:{
                from: 'top',
                align: 'right'              
              }
            });
            this.portada = undefined;
          }
        }else{
          $.notify('La imagen no debe superar los 5MB', {
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
            this.portada = undefined;
        }
      }
      console.log(this.producto);
  }

  init_categorias(){
      this._productosService.obtener_configuraciones().subscribe(
        response=>{
          this.categorias = response.categorias;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 50);
        }
      );
  }

  crear(){
    
    if(!this.producto.titulo){
      $.notify('Debe ingresar el nombre del producto', {
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
    }else if(!this.producto.categoria){
      $.notify('Debe seleccionar la categoria del producto', {
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
    }else if(!this.producto.tipo){
      $.notify('Debe seleccionar el tipo del producto', {
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
    }else if(!this.producto.tipo_variedad){
      $.notify('Debe ingresar el tipo de variedad del producto', {
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
    }else if(!this.producto.descripcion){
      $.notify('Debe ingresar la descripcion del producto', {
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
      console.log(this.producto);
      this.load_btn = true;
      this._productosService.crear_producto_admin(this.producto,this.token).subscribe(
        response=>{
          console.log(response);
          if (response.data != undefined) {
            $.notify('Se registro correctamente el producto', {
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
              this._router.navigate(['/productos']);   
          } else {
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
          }
          this.load_btn = false;
        }
      );
    }
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

  init_configuraciones2(){
    this._testService.obtener_configuracion_general(this.token).subscribe(
      response=>{
        let tipo = response.data.tipo.split(',');
        for (var item of tipo){
          this.ubicacion.push(item.trim());
        }
        this.ubicacion;
      }
    );
}
}
