const Ingreso = require('../models/Ingreso');
const Ingreso_detalle = require('../models/Ingreso_detalle');
const Cliente = require('../models/Cliente');
const Proyecto = require('../models/Proyecto');
const Producto = require('../models/Producto2');
const multer = require('multer');

const listar_clientes_admin = async function(req,res){
    if(req.user){
        let clientes = await Cliente.find({estado:true}).select('_id razonsocial');
        res.status(200).send({data:clientes});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const obtener_ingresos_hoy = async function(req,res){
    if (req.user) {
        let today = new Date();
        let dia = today.getDate();
        let mes = today.getMonth()+1;
        let year = today.getFullYear();

        let ingresos = await Ingreso.find({
            dia:dia,
            mes:mes,
            year:year
        }).populate('proyecto').populate('cliente').sort({createdAt:1});

        
        res.status(200).send({data:ingresos});

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_ingresos_fechas = async function (req,res) {
    if (req.user) {
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];
        let clienteId = req.params['cliente'];

        let ventas = [];      

        if (clienteId == 'Todos') {
            ventas = await Ingreso.find({
                createdAt: {
                    $gte: new Date(inicio + 'T00:00:00'),
                    $lt: new Date(hasta + 'T23:59:59')
                }
            }).populate('cliente').populate('proyecto').sort({createdAt:1});
        }else{
            ventas = await Ingreso.find({
                createdAt: {
                    $gte: new Date(inicio + 'T00:00:00'),
                    $lt: new Date(hasta + 'T23:59:59')
                },  cliente: clienteId
            }).populate('cliente').populate('proyecto').sort({createdAt:1});
        }        
        
        res.status(200).send({data:ventas});        

    } else {
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const listar_proyectos_modal_admin = async function(req,res){
    if(req.user){
        
        let proyectos = await Proyecto.find().sort({nombre:1});
        res.status(200).send({data:proyectos});
    }else{
        res.status(403).send({data:undefined,message:'Notoken'});
    }
}

const obtener_producto_admin = async function(req,res){
    if(req.user){

        let productos = await Producto.find().sort({descripcion:1});
        res.status(200).send({data:productos}); 
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/facturas'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split(".").pop();
      const fileName = Date.now();
      cb(null, `${fileName}.${ext}`); // Nombre del archivo (puedes personalizarlo según tus necesidades)
    }
  });
  
const upload = multer({
    storage: storage
  });

const generar_ingreso_admin = async (req, res) => {   
    if (!req.user) {
      return res.status(403).send({ message: 'No autorizado' });
    }
  
    const data = req.body;
    const today = new Date();
  
    try {
      // Obtener el correlativo actual
      const lastVenta = await Ingreso.findOne().sort({ correlativo: -1 });
      const correlativo = lastVenta ? lastVenta.correlativo + 1 : 1;
  
      // Archivo PDF recibido por Multer
      const archivoPDF = req.file ? req.file.filename : null;
  
      // Objeto para almacenar en la base de datos
      const ingreso = {
        cliente: data.cliente,
        proyecto: data.proyecto,
        tipo: data.tipo,
        monto: data.monto,
        saldo: data.saldo,
        estado: data.estado,
        dia: today.getDate(),
        mes: today.getMonth() + 1,
        year: today.getFullYear(),
        correlativo,
        factura: data.factura,
        fechafactura: data.fechafactura,
        archivoPDF,
      };  
      const reg_venta = await Ingreso.create(ingreso);  
      // Guardar detalles del ingreso    
      if (typeof data.detalles === 'string') {
        data.detalles = JSON.parse(data.detalles); // Deserializar antes de iterar
      }

      if (Array.isArray(data.detalles) && data.detalles.length > 0) {
        for (const item of data.detalles) {
            
            const cantidad = parseInt(item.cantidad,10);
            const descripcion = item.descripcion;
            const precio = parseFloat(item.precio);

             // Validar que los campos requeridos tengan valores válidos
            if (isNaN(cantidad) || !descripcion || isNaN(precio)) {
                console.log('Detalle inválido:', item);
                throw new Error('Detalle inválido. Verifica los valores proporcionados.');
            }
            
          const detalle = {
            cliente: reg_venta.cliente,
            proyecto: reg_venta.proyecto,
            venta: reg_venta._id,
            producto: item.producto,
            precio: item.precio,
            descripcion: item.descripcion,
            cantidad: parseInt(item.cantidad),
            dia: today.getDate(),
            mes: today.getMonth() + 1,
            year: today.getFullYear(),
            estado: data.estado,
          };
          await Ingreso_detalle.create(detalle);
        }      
    }
      res.status(200).send({ data: reg_venta });
  
    } catch (error) {
      console.error('Error al guardar el ingreso:', error);
      res.status(500).send({ message: 'Error interno del servidor' });
    }
};
  
const obtener_ingreso_admin = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let ingreso = await Ingreso.findById({_id:id}).populate('cliente').populate('proyecto');
            let detalles = await Ingreso_detalle.find({venta:id});
                res.status(200).send({data:ingreso,detalles:detalles});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_detalle_ingreso = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            let ingreso_detalle = await Ingreso_detalle.find({venta:id});
            res.status(200).send({data:ingreso_detalle});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const obtener_ingreso = async function(req,res){
    if (req.user) {   
        let id = req.params['id'];
        try {
            let ingreso = await Ingreso.findById({_id:id}).populate('proyecto');
            res.status(200).send({data:ingreso});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}

const eliminar_detalle_ingreso_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let detalle = await Ingreso_detalle.findByIdAndRemove({_id:id});
        
            await Ingreso_detalle.findById({_id:id});
            res.status(200).send({data:detalle});        
    }else{
        res.status(403).send({data:undefined,message:'NoToken'});
    }
}
/*
const actualizar_ingreso_admin = async function (req,res) {
   
    if(req.user){
     let id = req.params['id'];
     let today = new Date();
     let data = req.body;

     console.log(data);
     try {
           const nuevacargapdf = Ingreso.findById({_id:id});
           const nuevoarchivoPDF = req.file ? req.file.filename : null;


            if(nuevoarchivoPDF == nuevacargapdf.archivoPDF){
                let ventaActualizada = await Ingreso.findByIdAndUpdate({_id:id},{
                    cliente: data.cliente,
                    proyecto: data.proyecto._id,
                    tipo: data.tipo,
                    estado: data.estado,
                    monto : data.monto,
                    saldo : data.saldo,
                    factura : data.factura,
                    fechafactura : data.fechafactura,
                    });   
    
                    
                        for(let item of data.ingresos_detalle){
                           
                            if(item._id && item.proyecto){  
                                let detalle = {
                                    proyecto : ventaActualizada.proyecto,
                                    cliente : ventaActualizada.cliente,
                                    venta : ventaActualizada._id,
                                    producto : item.producto,
                                    descripcion : item.descripcion,
                                    precio : item.precio,
                                    cantidad : parseInt(item.cantidad),           
                                    estado: data.estado,
                                };                   
                                await Ingreso_detalle.findByIdAndUpdate(item._id, detalle);
                            }else{
                                let detalle2 = {
                                    cliente : ventaActualizada.cliente,
                                    proyecto : ventaActualizada.proyecto,
                                    venta : ventaActualizada._id,
                                    producto : item.producto,
                                    descripcion : item.descripcion,
                                    precio : item.precio,
                                    cantidad : parseInt(item.cantidad),                                       
                                    estado: data.estado,
                                    dia : today.getDate(),
                                    mes : today.getMonth()+1,
                                    year : today.getFullYear(),
                                }
            
                                await Ingreso_detalle.create(detalle2);
                            }  
                            
                        }                
                                            
                    res.status(200).send({data:ventaActualizada});  
                }else{
                    let ventaActualizada = await Ingreso.findByIdAndUpdate({_id:id},{
                        cliente: data.cliente,
                        proyecto: data.proyecto._id,
                        tipo: data.tipo,
                        estado: data.estado,
                        monto : data.monto,
                        saldo : data.saldo,
                        factura : data.factura,
                        fechafactura : data.fechafactura,
                        archivoPDF: nuevoarchivoPDF
                        });   
        
                        
                            for(let item of data.ingresos_detalle){
                               
                                if(item._id && item.proyecto){  
                                    let detalle = {
                                        proyecto : ventaActualizada.proyecto,
                                        cliente : ventaActualizada.cliente,
                                        venta : ventaActualizada._id,
                                        producto : item.producto,
                                        descripcion : item.descripcion,
                                        precio : item.precio,
                                        cantidad : parseInt(item.cantidad),           
                                        estado: data.estado,
                                    };                   
                                    await Ingreso_detalle.findByIdAndUpdate(item._id, detalle);
                                }else{
                                    let detalle2 = {
                                        cliente : ventaActualizada.cliente,
                                        proyecto : ventaActualizada.proyecto,
                                        venta : ventaActualizada._id,
                                        producto : item.producto,
                                        descripcion : item.descripcion,
                                        precio : item.precio,
                                        cantidad : parseInt(item.cantidad),                                       
                                        estado: data.estado,
                                        dia : today.getDate(),
                                        mes : today.getMonth()+1,
                                        year : today.getFullYear(),
                                    }
                
                                    await Ingreso_detalle.create(detalle2);
                                }  
                                
                            }                
                                                
                        res.status(200).send({data:ventaActualizada});  
                }          
                
            }       
           
         
         catch (error) {
         console.log(error);
         res.status(200).send({data:undefined,message:'Ocurrio un problema al registrar la venta.'})
         }
     }else{
     res.status(403).send({data:undefined,message:'NoToken'});
 
     }
}
*/
const actualizar_ingreso_admin = async function (req, res) {
    if (req.user) {
      let id = req.params['id'];
      let data = req.body;
      console.log('Datos recibidos para actualizar:', data);
  
      const nuevoArchivoPDF = req.file ? req.file.filename : null;
  
      try {
        let actualizacion = {
          cliente: data.cliente,
          proyecto: data.proyecto._id, // Asegúrate de usar `_id` del proyecto
          tipo: data.tipo,
          estado: data.estado,
          monto: data.monto,
          saldo: data.saldo,
          factura: data.factura,
          fechafactura: data.fechafactura,
        };
  
        if (nuevoArchivoPDF) {
          actualizacion.archivoPDF = nuevoArchivoPDF; // Agregar el nuevo archivo PDF
        }
  
        if (typeof data.ingresos_detalle === 'string') {
          data.ingresos_detalle = JSON.parse(data.ingresos_detalle); // Deserializar si es cadena
        }
  
        const ventaActualizada = await Ingreso.findByIdAndUpdate(id, actualizacion, { new: true });
  
        if (Array.isArray(data.ingresos_detalle)) {
          for (let item of data.ingresos_detalle) {
            const cantidad = parseInt(item.cantidad, 10);
            const descripcion = item.descripcion;
            const precio = parseFloat(item.precio);
  
            if (isNaN(cantidad) || !descripcion || isNaN(precio)) {
              throw new Error('Detalle inválido. Verifica los valores proporcionados.');
            }
  
            if (item._id) {
              await Ingreso_detalle.findByIdAndUpdate(item._id, {
                proyecto: ventaActualizada.proyecto,
                cliente: ventaActualizada.cliente,
                venta: ventaActualizada._id,
                producto: item.producto,
                descripcion,
                precio,
                cantidad,
                estado: data.estado,
              });
            } else {
              await Ingreso_detalle.create({
                proyecto: ventaActualizada.proyecto,
                cliente: ventaActualizada.cliente,
                venta: ventaActualizada._id,
                producto: item.producto,
                descripcion,
                precio,
                cantidad,
                estado: data.estado,
                dia: today.getDate(),
                mes: today.getMonth() + 1,
                year: today.getFullYear(),
              });
            }
          }
        }
  
        res.status(200).send({ data: ventaActualizada });
      } catch (error) {
        console.error('Error durante la actualización:', error);
        res.status(500).send({ message: 'Error durante la actualización' });
      }
    } else {
      res.status(403).send({ message: 'No autorizado' });
    }
  }

const ingresos_por_cobrar = async function (req, res) {
    if (req.user) {
        try {
            let year = req.params['year'];
            let month = req.params['month'];

            // Calcular la fecha de inicio del año y mes proporcionados
            const inicioFecha = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));

            // Consultar las ventas con saldo mayor a cero hasta el mes y año proporcionados
            const ventasConSaldo = await Ingreso.find({
                createdAt: {
                    $lte: inicioFecha,
                },
                saldo: { $gt: 0 },
            }).populate('cliente').populate('proyecto');

            res.status(200).json({ data: ventasConSaldo });

        } catch (error) {
            console.error('Error en ventas: ', error);
            res.status(500).send({ message: 'Error interno en el servidor' });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}




module.exports = {
    listar_clientes_admin,
    obtener_ingresos_hoy,
    obtener_ingresos_fechas,
    listar_proyectos_modal_admin,
    obtener_producto_admin,
    generar_ingreso_admin,
    obtener_ingreso_admin,
    obtener_detalle_ingreso,
    obtener_ingreso,
    eliminar_detalle_ingreso_admin,
    actualizar_ingreso_admin,
    ingresos_por_cobrar,
    upload
}