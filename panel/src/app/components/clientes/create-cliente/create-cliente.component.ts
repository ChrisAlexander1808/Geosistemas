import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
declare var $:any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {
  public cliente : any = {
    tipo:'',
  };
  public btn_registrar = false;
  public token : any = localStorage.getItem('token');

  constructor(
    //hace referencia a nuestro cliente.service.ts
    private _clienteService:ClienteService,
    private _router:Router
  ){}
  ngOnInit(): void {
    
  }

  registrar(registroForm:any){
    console.log(registroForm);
    if (!registroForm.value.nombrecomercial) {
      $.notify('Complete el nombre comercial del cliente', { 
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
      $.notify('Complete la razon social del cliente', { 
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
      $.notify('Ingrese el nit del cliente', { 
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
      $.notify('Ingrese la direccion del cliente', { 
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
    }else if (!registroForm.value.tipo) {
      $.notify('Seleccione el tipo del cliente', { 
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
      $.notify('Ingrese el correo del cliente', { 
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
      $.notify('Ingrese el telefono del cliente', { 
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
      this.cliente.asesor = localStorage.getItem('_id');
      this._clienteService.registro_cliente_admin(this.cliente,this.token).subscribe(
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
            $.notify('Se registró el nuevo cliente ', { 
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
            this._router.navigate(['/cliente']);
          }
        }
      );
    }  
  }
}
