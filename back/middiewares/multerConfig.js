const multer = require('multer');

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

module.exports = upload;
