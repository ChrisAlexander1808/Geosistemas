import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { IndexColaboradorComponent } from "./components/colaborador/index-colaborador/index-colaborador.component";
import { CreateColaboradorComponent } from "./components/colaborador/create-colaborador/create-colaborador.component";
import { EditColaboradorComponent } from "./components/colaborador/edit-colaborador/edit-colaborador.component";
import { IndexClienteComponent } from "./components/clientes/index-cliente/index-cliente.component";
import { CreateClienteComponent } from "./components/clientes/create-cliente/create-cliente.component";
import { EditClienteComponent } from "./components/clientes/edit-cliente/edit-cliente.component";
import { VerificarCuentaComponent } from "./components/verificar-cuenta/verificar-cuenta.component";
import { DashboardClienteComponent } from "./components/clientes/buyer/dashboard-cliente/dashboard-cliente.component";
import { ProspeccionClienteComponent } from "./components/clientes/buyer/prospeccion-cliente/prospeccion-cliente.component";
import { InteresesClienteComponent } from "./components/clientes/buyer/prospeccion/intereses-cliente/intereses-cliente.component";
import { CorreosClienteComponent } from "./components/clientes/buyer/prospeccion/correos-cliente/correos-cliente.component";
import { LlamadasClienteComponent } from "./components/clientes/buyer/prospeccion/llamadas-cliente/llamadas-cliente.component";
import { TareasClienteComponent } from "./components/clientes/buyer/prospeccion/tareas-cliente/tareas-cliente.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { CreateProductoComponent } from "./components/productos/create-producto/create-producto.component";
import { EditProductoComponent } from "./components/productos/edit-producto/edit-producto.component";
import { InventarioProductoComponent } from "./components/productos/inventario-producto/inventario-producto.component";
import { IndexVentaComponent } from "./components/ventas/index-venta/index-venta.component";
import { CreateVentaComponent } from "./components/ventas/create-venta/create-venta.component";
import { ConfiguracionesComponent } from "./components/configuraciones/configuraciones.component";
import { PagoVentaComponent } from "./components/ventas/pago-venta/pago-venta.component";
import { EditVentaComponent } from "./components/ventas/edit-venta/edit-venta.component";
import { IndexProveedorComponent } from "./components/proveedores/index-proveedor/index-proveedor.component";
import { CreateProveedorComponent } from "./components/proveedores/create-proveedor/create-proveedor.component";
import { EditProveedorComponent } from "./components/proveedores/edit-proveedor/edit-proveedor.component";
import { InventarioGeneralComponent } from "./components/inventario/inventario-general/inventario-general.component";
import { AuthGuard } from "./guards/auth.guard";
import { InventarioEntradaComponent } from "./components/inventario/inventario-entrada/inventario-entrada.component";
import { InventarioSalidaComponent } from "./components/inventario/inventario-salida/inventario-salida.component";
import { KpiMensualComponent } from "./components/rendimiento/kpi-mensual/kpi-mensual.component";
import { IndexCompraComponent } from "./components/compras/index-compra/index-compra.component";
import { CreateCompraComponent } from "./components/compras/create-compra/create-compra.component";
import { PagoCompraComponent } from "./components/compras/pago-compra/pago-compra.component";
import { CuentasCobrarComponent } from "./components/ventas/cuentas-cobrar/cuentas-cobrar.component";
import { EditCompraComponent } from "./components/compras/edit-compra/edit-compra.component";
import { CuentasPagarComponent } from "./components/compras/cuentas-pagar/cuentas-pagar.component";
import { IndexProductosComponent } from "./components/producto/index-productos/index-productos.component";
import { IndexProyectosComponent } from "./components/proyectos/index-proyectos/index-proyectos.component";
import { IndexIngresosComponent } from "./components/ingresos/index-ingresos/index-ingresos.component";
import { CuentasxcobrarComponent } from "./components/ingresos/cuentasxcobrar/cuentasxcobrar.component";
import { CreateIngresosComponent } from "./components/ingresos/create-ingresos/create-ingresos.component";
import { EditIngresosComponent } from "./components/ingresos/edit-ingresos/edit-ingresos.component";
import { PagoIngresosComponent } from "./components/ingresos/pago-ingresos/pago-ingresos.component";
import { IndexGastosComponent } from "./components/gastos/index-gastos/index-gastos.component";
import { CuentasxpagarComponent } from "./components/gastos/cuentasxpagar/cuentasxpagar.component";
import { CreateGastosComponent } from "./components/gastos/create-gastos/create-gastos.component";
import { EditGastosComponent } from "./components/gastos/edit-gastos/edit-gastos.component";
import { PagoGastosComponent } from "./components/gastos/pago-gastos/pago-gastos.component";
import { BuyerComponent } from "./components/proyectos/buyer/buyer.component";
import { RendimientoComponent } from "./components/ventas/rendimiento/rendimiento.component";

const appRoutes : Routes = [
     //el path hace referencia al nombre de la clase que se encuentra en los archivos /components/colaborador/create.ts - edit.ts - index.ts
     {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},

     {path: 'colaborador', component: IndexColaboradorComponent,canActivate: [AuthGuard]},
     {path: 'colaborador/create', component:CreateColaboradorComponent, canActivate: [AuthGuard]},
     {path: 'colaborador/:id', component:EditColaboradorComponent, canActivate: [AuthGuard]},
     //el path hace referencia al nombre de la clase que se encuentra en los archivos /components/cliente/create.ts - edit.ts - index.ts
     {path: 'cliente', component:IndexClienteComponent, canActivate: [AuthGuard]},
     {path: 'cliente/create', component:CreateClienteComponent, canActivate: [AuthGuard]},
     {path: 'cliente/:id', component:EditClienteComponent, canActivate: [AuthGuard]},

     {path: 'proveedor', component:IndexProveedorComponent, canActivate: [AuthGuard]},
     {path: 'proveedor/create', component:CreateProveedorComponent, canActivate: [AuthGuard]},
     {path: 'proveedor/:id', component:EditProveedorComponent, canActivate: [AuthGuard]},

     {path: 'cliente/buyer/:id/dashboard', component:DashboardClienteComponent, canActivate: [AuthGuard]},
     {path: 'cliente/buyer/:id/prospeccion', component:ProspeccionClienteComponent, canActivate: [AuthGuard]},

     {path: 'cliente/buyer/:id/prospeccion/intereses', component:InteresesClienteComponent, canActivate: [AuthGuard]},
     {path: 'cliente/buyer/:id/prospeccion/correos', component:CorreosClienteComponent, canActivate: [AuthGuard]},
     {path: 'cliente/buyer/:id/prospeccion/llamadas', component:LlamadasClienteComponent, canActivate: [AuthGuard]},
     {path: 'cliente/buyer/:id/prospeccion/tareas', component:TareasClienteComponent, canActivate: [AuthGuard]},

     {path: 'compras', component:IndexCompraComponent, canActivate: [AuthGuard]},
     {path: 'compras/create', component:CreateCompraComponent, canActivate: [AuthGuard]},
     {path: 'compras/cuentasporpagar', component:CuentasPagarComponent, canActivate: [AuthGuard]},
     {path: 'compras/edit/:id', component:EditCompraComponent, canActivate: [AuthGuard]},
     {path: 'compras/pagos/:id', component:PagoCompraComponent, canActivate: [AuthGuard]},

     {path: 'gastos', component:IndexGastosComponent, canActivate: [AuthGuard]},
     {path: 'gastos/cuentasporpagar', component:CuentasxpagarComponent, canActivate: [AuthGuard]},
     {path: 'gastos/create', component:CreateGastosComponent, canActivate: [AuthGuard]},
     {path: 'gastos/edit/:id', component:EditGastosComponent, canActivate: [AuthGuard]},
     {path: 'gastos/pagos/:id', component:PagoGastosComponent, canActivate: [AuthGuard]},

     {path: 'producto', component:IndexProductosComponent, canActivate: [AuthGuard]},
     {path: 'proyectos', component:IndexProyectosComponent, canActivate: [AuthGuard]},
     {path: 'proyectos/buyer/:id', component:BuyerComponent, canActivate: [AuthGuard]},
     

     {path: 'productos', component:IndexProductoComponent, canActivate: [AuthGuard]},
     {path: 'productos/create', component:CreateProductoComponent, canActivate: [AuthGuard]},
     {path: 'productos/edit/:id', component:EditProductoComponent, canActivate: [AuthGuard]},
     {path: 'productos/inventario', component:InventarioProductoComponent, canActivate: [AuthGuard]},

     {path: 'ingresos', component:IndexIngresosComponent, canActivate: [AuthGuard]},
     {path: 'ingresos/cuentasporcobrar', component:CuentasxcobrarComponent, canActivate: [AuthGuard]},
     {path: 'ingresos/create', component:CreateIngresosComponent, canActivate: [AuthGuard]},
     {path: 'ingresos/edit/:id', component:EditIngresosComponent, canActivate: [AuthGuard]},
     {path: 'ingresos/pagos/:id', component:PagoIngresosComponent, canActivate: [AuthGuard]},

     {path: 'ventas', component:IndexVentaComponent, canActivate: [AuthGuard]},
     {path: 'ventas/cuentasporcobrar', component:CuentasCobrarComponent, canActivate: [AuthGuard]},
     {path: 'ventas/create', component:CreateVentaComponent, canActivate: [AuthGuard]},
     {path: 'ventas/rendimiento/:id', component:RendimientoComponent, canActivate:[AuthGuard]},
     {path: 'ventas/edit/:id', component:EditVentaComponent, canActivate: [AuthGuard]},
     {path: 'ventas/pagos/:id', component:PagoVentaComponent, canActivate: [AuthGuard]},

     {path: 'configuraciones', component:ConfiguracionesComponent, canActivate: [AuthGuard]},
     {path: 'inventario', component:InventarioGeneralComponent, canActivate: [AuthGuard]},
     {path: 'inventario/entrada', component:InventarioEntradaComponent, canActivate: [AuthGuard]},
     {path: 'inventario/salida', component:InventarioSalidaComponent, canActivate: [AuthGuard]},
     {path: 'rendimiento/kpi-mensual', component:KpiMensualComponent, canActivate: [AuthGuard]},     

     ///////////////////////////////
     {path: 'verification/:token', component:VerificarCuentaComponent},
     
     {path: '', component: LoginComponent},
]

export const appRoutingProvides : any[] = [];
export const routing : ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);