const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser =require('body-parser')
var cors = require('cors')

const multer = require('multer');




app.set('port', process.env.PORT || 7000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static("public")); 
app.use(express.static("node_modules")); 
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'images')))

app.use(cors());

//middlewares
app.use(express.json());
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'images'),
    filename:(req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})
app.use(multer({storage}).single('imagen'));



//routas

app.use('/', require('./routes/index'));
app.use('/paciente', require('./routes/paciente'));
app.use('/medico', require('./routes/medico'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/almacen', require('./routes/almacen'));
app.use('/farmacia', require('./routes/farmacia'));
app.use('/medicamento', require('./routes/medicamento'));
app.use('/proveedores', require('./routes/proveedores'));
app.use('/pedidos', require('./routes/pedidos'));
app.use('/emergencia', require('./routes/emergencia'));
app.use('/hospitalizacion', require('./routes/hospitalizacion'));
app.use('/cuaderno', require('./routes/cuaderno'));
app.use('/salas', require('./routes/salas'));
app.use('/papeletaInternacion', require('./routes/papeletaInternacion'));
app.use('/Internaciones', require('./routes/Internaciones'));
app.use('/distribucion', require('./routes/distribucion'));
app.use('/stock', require('./routes/stock'));
app.use('/datos_generales_paciente', require('./routes/datos_generales_paciente')); 
app.use('/datos_genPaciente_emergencia', require('./routes/datos_generales_P_emergencia')); 
app.use('/consulta_externa', require('./routes/consulta_externa'));
app.use('/emergencia2.0', require('./routes/emergencia2.0'));
app.use('/role', require('./routes/roles'));
app.use('/laboratorios', require('./routes/laboratorios'));




app.listen(app.get('port'), () => {
    console.log(`servidor en puerto ${app.get('port')}`)
 });

 