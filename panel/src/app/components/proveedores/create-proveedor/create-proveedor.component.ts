import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProveedorService } from 'src/app/services/proveedor.service';
declare var $:any;

@Component({
  selector: 'app-create-proveedor',
  templateUrl: './create-proveedor.component.html',
  styleUrls: ['./create-proveedor.component.css']
})
export class CreateProveedorComponent implements OnInit {

    public proveedor : any = {
      diascredito:'',
    };
    public btn_registrar = false;
    public token : any = localStorage.getItem('token');

    constructor(
      private _proveedorService: ProveedorService,
      private _router:Router,
    ){}

    ngOnInit(): void {
      
    }

    registrar(registroForm:any){
      console.log(registroForm);
      if (!registroForm.value.nombrecomercial) {
        $.notify('Complete el nombre comercial del proveedor', { 
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
        
      }else if (!registroForm.value.razonsocial) {
        $.notify('Complete la razon social del proveedor', { 
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
      }else if (!registroForm.value.nit) {
        $.notify('Ingrese el nit del proveedor', { 
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
      }else if (!registroForm.value.direccion) {
        $.notify('Ingrese la direccion del proveedor', { 
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
      }else if (!registroForm.value.diascredito) {
        $.notify('Seleccione los días de credito del proveedor', { 
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
      }else if (!registroForm.value.email) {
        $.notify('Ingrese el correo del proveedor', { 
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
      }else if (!registroForm.value.telefono) {
        $.notify('Ingrese el telefono del proveedor', { 
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
      else {
        this.btn_registrar = true;
        this.proveedor.comprador = localStorage.getItem('_id');
        this._proveedorService.registro_proveedor_admin(this.proveedor,this.token).subscribe(
          response=>{
            this.btn_registrar = false;
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
            }else{
              this.btn_registrar = false;             
              $.notify('Se registró el nuevo proveedor ', { 
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
        );
      }  
    }
}
