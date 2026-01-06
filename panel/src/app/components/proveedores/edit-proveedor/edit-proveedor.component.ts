import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from 'src/app/services/proveedor.service';
declare var $:any;

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.css']
})
export class EditProveedorComponent implements OnInit {

    public proveedor : any = {
      tipo:''
    };
    public btn_actualizar = false;
    public token : any = localStorage.getItem('token');
    public id = '';
    public load_data = true;
    public data = false;
    
    constructor(
        private _route:ActivatedRoute,
        private _proveedorService:ProveedorService,
        private _router:Router
    ){}

    ngOnInit(): void {
      this._route.params.subscribe(
        params=>{
          //código para obtener los datos desde el backend
          this.id = params['id'];
          this.load_data = true;
          this._proveedorService.obtener_datos_proveedor_admin(this.id,this.token).subscribe(
            response =>{
              if (response.data != undefined) {
                this.proveedor = response.data;
                this.data = true;
                this.load_data = false;
              } else {
                this.data = false;
                this.load_data = false;
              }
            }
          );
        }
      );
    }

    actualizar(actualizarForm:any){
      if (actualizarForm.valid) {
        this.btn_actualizar = true;
        //mandamos a llamar el método declarado en colaborador.service.ts
        this._proveedorService.editar_proveedor_admin(this.id,this.proveedor,this.token).subscribe(
          response=>{
            if (response.data == undefined) {
              $.notify(response.message, { 
                type: 'danger',
                spacing: 10,                    
                timer: 2000,
                placement: {
                    from: 'top', 
                    align: 'right'
                },
                delay: 1000,
                animate: {
                    enter: 'animated ' + 'bounce',
                    exit: 'animated ' + 'bounce'
                }
              });  
              this.btn_actualizar = false;            
            }else{
              this.btn_actualizar = false;             
              $.notify('Se actualizó el nuevo cliente ', { 
                type: 'success',
                spacing: 10,                    
                timer: 2000,
                placement: {
                    from: 'top', 
                    align: 'right'
                },
                delay: 1000,
                animate: {
                    enter: 'animated ' + 'bounce',
                    exit: 'animated ' + 'bounce'
                }
              }); 
              this._router.navigate(['/proveedor']);
            }
          }
        )
      }else{
        $.notify('Complete correctamente el formulario', { 
          type: 'danger',
          spacing: 10,                    
          timer: 2000,
          placement: {
              from: 'top', 
              align: 'right'
          },
          delay: 1000,
          animate: {
              enter: 'animated ' + 'bounce',
              exit: 'animated ' + 'bounce'
          }
        });
      }
    }
}
