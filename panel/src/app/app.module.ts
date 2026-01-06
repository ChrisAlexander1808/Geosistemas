import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTinymceModule }  from  'ngx-tinymce' ;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { routing } from "./app.routing";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { TopComponent } from './components/top/top.component';
import { IndexColaboradorComponent } from './components/colaborador/index-colaborador/index-colaborador.component';
import { CreateColaboradorComponent } from './components/colaborador/create-colaborador/create-colaborador.component';
import { EditColaboradorComponent } from './components/colaborador/edit-colaborador/edit-colaborador.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { VerificarCuentaComponent } from './components/verificar-cuenta/verificar-cuenta.component';
import { DashboardClienteComponent } from './components/clientes/buyer/dashboard-cliente/dashboard-cliente.component';
import { ProspeccionClienteComponent } from './components/clientes/buyer/prospeccion-cliente/prospeccion-cliente.component';
import { AsideClienteComponent } from './components/clientes/buyer/aside-cliente/aside-cliente.component';
import { InteresesClienteComponent } from './components/clientes/buyer/prospeccion/intereses-cliente/intereses-cliente.component';
import { TareasClienteComponent } from './components/clientes/buyer/prospeccion/tareas-cliente/tareas-cliente.component';
import { LlamadasClienteComponent } from './components/clientes/buyer/prospeccion/llamadas-cliente/llamadas-cliente.component';
import { CorreosClienteComponent } from './components/clientes/buyer/prospeccion/correos-cliente/correos-cliente.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { EditProductoComponent } from './components/productos/edit-producto/edit-producto.component';
import { InventarioProductoComponent } from './components/productos/inventario-producto/inventario-producto.component';
import { IndexVentaComponent } from './components/ventas/index-venta/index-venta.component';
import { CreateVentaComponent } from './components/ventas/create-venta/create-venta.component';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { FzillPipe } from './pipes/fzill.pipe';
import { PagoVentaComponent } from './components/ventas/pago-venta/pago-venta.component';
import { EditVentaComponent } from './components/ventas/edit-venta/edit-venta.component';
import { IndexProveedorComponent } from './components/proveedores/index-proveedor/index-proveedor.component';
import { CreateProveedorComponent } from './components/proveedores/create-proveedor/create-proveedor.component';
import { EditProveedorComponent } from './components/proveedores/edit-proveedor/edit-proveedor.component';
import { InventarioGeneralComponent } from './components/inventario/inventario-general/inventario-general.component';
import { InventarioEntradaComponent } from './components/inventario/inventario-entrada/inventario-entrada.component';
import { InventarioSalidaComponent } from './components/inventario/inventario-salida/inventario-salida.component';
import { KpiMensualComponent } from './components/rendimiento/kpi-mensual/kpi-mensual.component';
import { IndexCompraComponent } from './components/compras/index-compra/index-compra.component';
import { CreateCompraComponent } from './components/compras/create-compra/create-compra.component';
import { PagoCompraComponent } from './components/compras/pago-compra/pago-compra.component';
import { EditCompraComponent } from './components/compras/edit-compra/edit-compra.component';
import { CuentasCobrarComponent } from './components/ventas/cuentas-cobrar/cuentas-cobrar.component';
import { CuentasPagarComponent } from './components/compras/cuentas-pagar/cuentas-pagar.component';
import { IndexProductosComponent } from './components/producto/index-productos/index-productos.component';
import { IndexProyectosComponent } from './components/proyectos/index-proyectos/index-proyectos.component';
import { IndexIngresosComponent } from './components/ingresos/index-ingresos/index-ingresos.component';
import { CreateIngresosComponent } from './components/ingresos/create-ingresos/create-ingresos.component';
import { EditIngresosComponent } from './components/ingresos/edit-ingresos/edit-ingresos.component';
import { CuentasxcobrarComponent } from './components/ingresos/cuentasxcobrar/cuentasxcobrar.component';
import { PagoIngresosComponent } from './components/ingresos/pago-ingresos/pago-ingresos.component';
import { IndexGastosComponent } from './components/gastos/index-gastos/index-gastos.component';
import { CreateGastosComponent } from './components/gastos/create-gastos/create-gastos.component';
import { EditGastosComponent } from './components/gastos/edit-gastos/edit-gastos.component';
import { PagoGastosComponent } from './components/gastos/pago-gastos/pago-gastos.component';
import { CuentasxpagarComponent } from './components/gastos/cuentasxpagar/cuentasxpagar.component';
import { BuyerComponent } from './components/proyectos/buyer/buyer.component';
import { RendimientoComponent } from './components/ventas/rendimiento/rendimiento.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    TopComponent,
    IndexColaboradorComponent,
    CreateColaboradorComponent,
    EditColaboradorComponent,
    NotfoundComponent,
    IndexClienteComponent,
    CreateClienteComponent,
    EditClienteComponent,
    VerificarCuentaComponent,
    DashboardClienteComponent,
    ProspeccionClienteComponent,
    AsideClienteComponent,
    InteresesClienteComponent,
    TareasClienteComponent,
    LlamadasClienteComponent,
    CorreosClienteComponent,
    IndexProductoComponent,
    CreateProductoComponent,
    EditProductoComponent,
    InventarioProductoComponent,
    IndexVentaComponent,
    CreateVentaComponent,
    ConfiguracionesComponent,
    FzillPipe,
    PagoVentaComponent,
    EditVentaComponent,
    IndexProveedorComponent,
    CreateProveedorComponent,
    EditProveedorComponent,
    InventarioGeneralComponent,
    InventarioEntradaComponent,
    InventarioSalidaComponent,
    KpiMensualComponent,
    IndexCompraComponent,
    CreateCompraComponent,
    PagoCompraComponent,
    EditCompraComponent,
    CuentasCobrarComponent,
    CuentasPagarComponent,
    IndexProductosComponent,
    IndexProyectosComponent,
    IndexIngresosComponent,
    CreateIngresosComponent,
    EditIngresosComponent,
    CuentasxcobrarComponent,
    PagoIngresosComponent,
    IndexGastosComponent,
    CreateGastosComponent,
    EditGastosComponent,
    PagoGastosComponent,
    CuentasxpagarComponent,
    BuyerComponent,
    RendimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    HttpClientModule,
    NgbPaginationModule,
    NgbModule,
    NgxTinymceModule.forRoot({
      baseURL: '../../../assets/tinymce/',      
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
