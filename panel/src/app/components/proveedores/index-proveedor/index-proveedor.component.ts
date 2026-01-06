import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor.service';
declare var $:any;

@Component({
  selector: 'app-index-proveedor',
  templateUrl: './index-proveedor.component.html',
  styleUrls: ['./index-proveedor.component.css']
})
export class IndexProveedorComponent implements OnInit{

  public token = localStorage.getItem('token');
  public proveedores : Array<any> = [];
  public proveedores_const : Array<any> = [];

  public filtro = '';
  public page = 1;
  public pageSize = 4;

  public load_estado = false;

    constructor(
      private _proveedorService: ProveedorService,
    ){}

    ngOnInit(): void {
      this.init_data();
    }

    init_data(){
   
      this._proveedorService.listar_proveedores_admin(this.token).subscribe(
        response=>{
          this.proveedores = response.data;
          this.proveedores_const = this.proveedores;
        }
      );
    }
    filtrar(){
      if(this.filtro){
        var term = new RegExp(this.filtro,'i');
        this.proveedores = this.proveedores_const.filter(item=>term.test(item.nombrecomercial)||term.test(item.razonsocial)||term.test(item.email)||term.test(item.nit));
    }else{
        this.proveedores = this.proveedores_const;
    }
    }
    set_state(id:any,estado:any){
      this.load_estado = true;
      this._proveedorService.cambiar_estado_proveedor_admin(id,{estado:estado},this.token).subscribe(
        response=>{
          this.load_estado = false;
          $('#delete-'+id).modal('hide');
          this.init_data();
        }
      );
    }
}
