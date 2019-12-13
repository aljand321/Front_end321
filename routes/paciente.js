const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');

var data_token = {
  token_id: '',
  token_p: ''
}

var citas_dia = {}
function add(token,id){
  let storedItem = citas_dia[id];
    if (!storedItem) {
      storedItem = citas_dia[id] = {
        data: token,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in citas_dia) {
      arr.push(citas_dia[id]);
  }
  return arr;
}

var data_user = {}
function user(data,id){
  let storedItem = data_user[id];
    if (!storedItem) {
      storedItem = data_user[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in data_user) {
      arr.push(data_user[id]);
  }
  return arr;
}

function remove_user(id) {
  delete data_user[id];
}


/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                ruta para poder renderizar home citas 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
var msg_false;
router.get('/home/:id/:token_part', (req,res) => {
  const { id,token_part } = req.params
  var data_token1 = {
    token_id: {},
    token_p:{},
    personal:{},        
  }
    fetch('http://localhost:3600/api/user/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      data_token.token_id = resp.id     // esto manda el el id para el token
      data_token1.token_id = resp.id
        if(datas.name.token[resp.id] && datas.name.token[resp.id].data.token.split(" ")[1].split(".")[2] == token_part ){
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "fichaje"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
              data_token.token_p = token_part
              data_token1.token_p = token_part
                fetch('http://localhost:3600/api/personal/'+resp.perso_id)
                .then(resp => resp.json())
                .catch(error => console.error('Error',error))
                .then(personal => {
                  fetch('http://localhost:3600/api/Only_Medicos')
                  .then(resp => resp.json())
                  .then(medi => {
                    
                    fetch('http://localhost:4600/api/especialidad')
                    .then(resp => resp.json())
                    .then(epe => {
                      fetch('http://localhost:3000/api/pacientes')
                      .then(resp => resp.json())
                      .then( paci =>{
                          //res.send(resp)
                        data_token1.personal = personal
                        if(data_user[data_token.token_id] == null){
                          user(data_token1, data_token.token_id)
                          res.render('Fichas/homec',{
                            resp:personal,
                            data_token: data_token1,
                            med:medi.length,
                            espe: epe.length,
                            pacien:paci.length
                          })
                          status = null
                        }else{
                          remove_user( data_token1.token_id)                        
                          user(data_token1, data_token1.token_id)
                          res.render('Fichas/homec',{
                            resp:personal,
                            data_token: data_token1,
                            resp:personal,
                            med:medi.length,
                            espe: epe.length,
                            pacien:paci.length
                          })
                          status = null
                        }
                      })
                    
                    })
                  })
                })
                    
            }else{
              res.redirect('/')
            }
        }else{
          res.redirect('/')
        }
        
    })
});

router.get('/citas/:id/:token_part',(req, res) => {
  const { id, token_part } = req.params
  if(datas.name.token[id] && datas.name.token[id].data.token.split(" ")[1].split(".")[2] == token_part){
      fetch('http://localhost:3000/api/pacientes/')
      .then(resp => resp.json())
      .then(resp =>{
        res.render('Fichas/citas',{         //aqui esta la ruta
          resp,
          data_token,
          msg:msg_Consulta_Externa[id],
          data_doc: data_user[id],
        });    
      })
      .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
      }) 
   
  }else{
    res.redirect('/')
  }
 
});



/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
var msg_Consulta_Externa = {}
function msg_data(data,id){
  let msg_data = msg_Consulta_Externa[id];
    if (!msg_data) {
        msg_data = msg_Consulta_Externa[id] = {
        data: data,
        qty: 0
      };
    }
    msg_data.qty++;
}

function array () {
  let arr = [];
  for (const id in msg_Consulta_Externa) {
      arr.push(msg_Consulta_Externa[id]);
  }
  return arr;
}
function remove(id) {
    delete msg_Consulta_Externa[id];
}

var url = require('./url/export');

router.get('/reg_paciente',(req, res) => {
    res.render('reg_paciente')
  });
 
  
router.post('/postPaciente/:token_id/:token_part', (req,res) => {
  const { token_id, token_part } = req.params
  var msg_p
  var aleatorio = Math.floor(Math.random()*(9000-1000))+1000
  var paciente = {
    numeroHistorial : aleatorio,
    nombre: req.body.nombre,
    apellidop: req.body.apellidop,
    apellidom: req.body.apellidom,
    ci: req.body.ci,
    fechanacimiento: req.body.fechanacimiento,
    direccion : req.body.direccion,
    sexo: req.body.sexo,
    id_user:token_id
  };
  //console.log(paciente);
  var esto = {
    method: 'POST',
    body: JSON.stringify(paciente),
    headers:{
      'Content-type' : "application/json"
    }
};
fetch('http://localhost:3000/api/pacientes',esto)
.then(res => res.json())
.catch(error => console.error('Error:', error))
.then(data => {
  //console.log(data, " esto es la respuesta del post <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<")
  if (data.success == true){

    if(msg_Consulta_Externa[token_id] == null){
      msg_p = {
        success:true,
        msg:data.msg
      }
      msg_data(msg_p,token_id)
    }else{
      msg_p = {
        success:true,
        msg:data.msg
      }
      remove(token_id)
      msg_data(msg_p,token_id)
    }
    res.redirect('/paciente/citaPAciente/'+data.pacienteData.id+"/"+token_id + '/' + token_part+'/'+data.pacienteData.numeroHistorial);
  }else{
    if(msg_Consulta_Externa[token_id] == null){
      msg_p = {
        success:false,
        msg:data.msg
      }
      msg_data(msg_p,token_id)
    }else{
      msg_p = {
        success:false,
        msg:data.msg
      }
      remove(token_id)
      msg_data(msg_p,token_id)
    }
    res.redirect('/paciente/citas/'+token_id+'/'+token_part);
  } 
})
});

//cita medica o ficha que se le va a dar al paciente

function sacar(id){
  //console.log(id, "<z<zzzzzzzzzzzzzzzzzzzzzzzzzzz")
  fetch('http://localhost:3000/api/OneCita/'+id)
  .then(resp => resp.json())
  .then(resp =>{

    add(resp,resp[0].id)
    console.log(citas_dia, '>>>>>>>>>>>>>>>>>>>>>>>)')
  });
}

var datos , data_imprecion;
router.post('/cita_medica/:id/:token_id/:token_part', (req,res) => {
  const { id, token_id, token_part } = req.params
  var data1;
   datos = {
    id_user:req.body.id_user,
    codigo_p:req.body.codigo_p,
    saldo_total:req.body.saldo_total,
    especialidad:req.body.especialidad,
    turno:req.body.turno,
    medico:req.body.medico.split("/")[0],
    hora:req.body.hora,
    id_medico:req.body.medico.split("/")[1]
  };
  
  var esto = {
    method: 'POST',
    body: JSON.stringify(datos),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:3000/api/reg_cita/'+id,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(resp => {
    
    if(resp.success == true){ 
      if(data_imprimir[token_id] == null){
        data1 = resp.cita_pData
                 
        
        one_impimir(data1,token_id)
      }else{
        data1 = resp.cita_pData
        remove_imprimir(token_id)
        one_impimir(data1,token_id)
      }
      

      sacar(resp.cita_pData.id) //esto saca el id para poder mandar a la funcion id

      cambiarEstadoHOra(datos.hora.split("/")[1]);

      function cambiarEstadoHOra(id){
        var estado = {
          estado: "reservado"
        }
        var esto = {
          method: 'POST',
          body: JSON.stringify(estado),
          headers:{
            'Content-type' : "application/json"
          }
        };
        fetch('http://localhost:4600/api/Update_Hora/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(resp => {
          //console.log(resp, "  <<<<")
          res.redirect('/paciente/imprimirNuevaConsulta/'+token_id + "/" + token_part)
          //res.redirect('/paciente/citas/'+data_token.token_id + '/' + data_token.token_p);
          msg_false = null
        })
      }
    }else{
      msg_false = resp.msg
      res.redirect('/paciente/citaPAciente/'+token_id + "/" + token_part);      
    }    
  }) 
});

// esta funcion es para poder mandar un usrio para que sea actualizado mediante usario
var data_imprimir = {}   // esto falta usar
function one_impimir(data,id){
  let storedItem = data_imprimir[id];
    if (!storedItem) {
      storedItem = data_imprimir[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in data_imprimir) {
      arr.push(data_imprimir[id]);
  }
  return arr;
}

function remove_imprimir(id) {
  delete data_imprimir[id];
}

//IMPRIMIR CITAS
router.get('/imprimirNuevaConsulta/:token_id/:token_part', (req,res) => {
  const { token_id, token_part } = req.params;
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
   
    fetch('http://localhost:3000/api/onlyPaciente/'+data_imprimir[token_id].data.codigo_p)
    .then(resp => resp.json())
    .then(paciente =>{
    
      //console.log(paciente, "    zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzssssssssssssssss")
      res.render('Fichas/imprimirNuevaConsulta',{   
        data_imprecion: data_imprimir[token_id],
        paciente,
        data_doc: data_user[token_id]
      })
    
    }) 
  }else{
    res.redirect('/');
  }
});

// ruta para poder imprimir la cita actualizada
router.get('/imprimir_2/:id/:token_id/:token_part/:historial/:id_cita', (req,res) => {
  const { id, token_id, token_part, historial, id_cita } = req.params;

  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
    fetch('http://localhost:3000/api/OneCita/'+id)
    .then(resp => resp.json())
    .then(One_cita =>{

      fetch('http://localhost:3000/api/onlyPaciente/'+historial)
      .then(resp => resp.json())
      .then(paciente =>{
        res.render('Fichas/imprimir_ficha_update',{
          paciente,
          One_cita,
          data_doc: data_user[token_id],
          id_cita
        })

      })
    })
  }else{
    res.redirect('/');
  }
})

router.get('/voler/:token_id/:token_part', (req,res) => {
  const { token_id, token_part } = req.params
  res.redirect('/paciente/citas/'+token_id+'/'+token_part);
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            ruta para dar citas
<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><
<<<>><<<>><<<><>>><<<><<<>><<>><<>>>>><<<<
*/


router.get('/clean/:id/:token_id/:token_part/:historial', (req,res) => {
  const { id, token_id, token_part, historial } = req.params
  remove_cita(token_id)
  res.redirect('/paciente/citaPAciente/'+id + "/" + token_id + '/'+ token_part+'/'+ historial);
})

 //ruta para sacar todas las citas de un paciente
 router.get('/citaPAciente/:id/:token_id/:token_part/:historial',(req,res) => {
   const { id,token_id, token_part, historial } = req.params;
  /* var id = req.params;  
  idH = id; */
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
    fetch('http://localhost:3000/api/citasPaciente/'+id)
    .then(resp => resp.json())
    .then(pacienteCita =>{
      //console.log(update_cita[id], "   rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")   
      fetch('http://localhost:3000/api/onlyPaciente/'+historial)
      .then(resp => resp.json())
      .then(paciente =>{
        res.render('Fichas/citas_fichas',{          //aqui esta la ruta
          paciente,
          id,
          pacienteCita, // esto contiene las citas de un paciente
          citaUpdate:update_cita[token_id],
          data_token,
          msg_false,
          citas_dia,
          data_doc: data_user[token_id]
        });
      })  
      

    });
  }else{
    res.redirect('/');
  }
 })

 var update_cita = {}
function cita(data,id){
  let storedItem = update_cita[id];
    if (!storedItem) {
      storedItem = update_cita[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array1 () {
  let arr = [];
  for (const id in update_cita) {
      arr.push(update_cita[id]);
  }
  return arr;
}

function remove_cita(id) {
  delete update_cita[id];
}

 //RUTA PARA PODER MODIFICAR UNA CITA 
 let citaUpdate;
 router.get('/onliCita/:id/:token_id/:token_part', (req,res) => {
   console.log(req.params.token_id, " esto es el token ZZZZZ>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
   const { id, token_id, token_part } = req.params;
   if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
    fetch('http://localhost:3000/api/OneCita/'+id)
    .then(resp => resp.json())
    .then(resp =>{
      if(update_cita[token_id] == null){
        cita(resp, token_id)
        res.redirect('/paciente/citaPAciente/'+resp[0].id_Paciente +'/'+token_id+'/'+token_part+ "/" + resp[0].codigo_p );
      }else{
        remove_cita(token_id)
        cita(resp, token_id)
        res.redirect('/paciente/citaPAciente/'+resp[0].id_Paciente +'/'+token_id+'/'+token_part+ "/" + resp[0].codigo_p );
      }
     
    });
   }else{
    res.redirect('/');
   }
  
 })
 
 

router.post('/updateCita/:id/:token_id/:token_part',(req,res) => {
  const { id, token_id, token_part } = req.params;
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
    if(req.body.especialidad == null){
      console.log("por favor selecione especialidad")
    }else if(req.body.medico == null){
      console.log("por favor selecione medico")

    }else{

      var update = {
        estado_update:'false',
        id_user:req.body.id_user,
        codigo_p:req.body.codigo_p,
        saldo_total:req.body.saldo_total,
        especialidad:req.body.especialidad,
        turno:req.body.turno,
        medico:req.body.medico.split("/")[0],
        hora:req.body.hora,
        id_medico:req.body.medico.split("/")[1]
      };
      var esto = {
        method: 'POST',
        body: JSON.stringify(update),
        headers:{
          'Content-type' : "application/json"
        }
      };
        fetch('http://localhost:3000/api/updateCita/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {
          liberar(update_cita[token_id].data[0].hora.split("/")[1])
          reservar(update.hora.split("/")[1])
          res.redirect('/paciente/onliCita/'+id+'/'+token_id+'/'+token_part);
      })
    }
  }else{
    res.redirect('/')
  }
})

function liberar (id){
  var estado = {
    estado: "libre"
  }
  var esto = {
    method: 'POST',
    body: JSON.stringify(estado),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:4600/api/Update_Hora/'+id,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(resp => {
    console.log(resp, "  liverado")
  })
}

function reservar(id){
  var estado = {
    estado: "reservado"
  }
  var esto = {
    method: 'POST',
    body: JSON.stringify(estado),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:4600/api/Update_Hora/'+id,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(resp => {
    console.log(resp, " reservado")
  })
}

router.post('/Vue_estado_libre_horas/:id', (req,res) => {
  const { id } = req.params;
  var estado = {
    estado: "libre"
  }
  var esto = {
    method: 'POST',
    body: JSON.stringify(estado),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:4600/api/Update_Hora/'+id,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(resp => {
    console.log(resp, " <<<<<<<<<<<<<")
    res.status(200).json({
      msg: true,
      resp      
    })
  })
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                      Vue rutas para cita medica
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/


router.get('/vueListTurnos/:dia/:turno', (req,res) => {
  var data = req.params
  fetch(url.name.cuadernos+'/api/ListAll/'+data.dia+"/"+data.turno)
  .then(resp => resp.json())
  .then(resp =>{
   res.status(200).json({
     msg: "Lista de turnos segun dia que incluye doctores",
     resp
   });
  });
})

//ruta para poder sacar de los doctores sus turnos
router.get('/doctorTurno/:id', (req,res) => {
  const { id } = req.params;
  fetch(url.name.cuadernos+'/api/doctTurnos/'+id)
  .then(resp => resp.json())
  .then(resp =>{
   res.status(200).json(resp);
  });
})

//ruta para mostrar especialidades
router.get('/vueEspecialidades_consulta', (req,res) => {
  fetch(url.name.cuadernos+'/api/list_consEsp')
  .then(resp => resp.json())
  .then(resp =>{
   res.status(200).json(resp);
  });
})

//ruta para mostrar docotres
router.get('/vueDoctores/:esp/:dia/:turno', (req,res) => {
  var data = req.params
  fetch(url.name.cuadernos+'/api/Esp_Turnos/'+data.esp+"/"+data.dia+"/"+data.turno)
  .then(resp => resp.json())
  .then(resp =>{
   res.status(200).json(resp);
  });
})

//ruta para poder mostrar reportes de citas mediacas
router.get('/ReporConsultorio/:token_id/:token_part', (req,res) => {
  const { token_id, token_part } = req.params;
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
    fetch('http://localhost:3000/api/reg_citas') // esta ruta es la que muestra todas las citas de todos loa pacientes
    .then(res => res.json()) 
    .catch(error => console.error('Error:', error))
    .then(list_citas => {

      fetch('http://localhost:4600/api/list_consEsp') //esta ruta muestra los consultorios
      .then(res => res.json()) 
      .catch(error => console.error('Error:', error))
      .then(consultorios => {
        res.render('Fichas/ReporConsultorio', {
          list_citas,
          data_doc: data_user[token_id],
          consultorios
        })
      })

      
    })    
  }else{
    res.redirect('/')
  }
});

router.get('/Vue_list_doctores/:id_consultorio', (req,res) => {
  const { id_consultorio } = req.params
  fetch('http://localhost:4600/api/list_cons_doc/'+id_consultorio) // esta ruta es la que muestra todas las citas de todos loa pacientes
    .then(res => res.json()) 
    .catch(error => console.error('Error:', error))
    .then(data => {
      res.status(200).json(data)
    })
})

// esta ruta es para poder buscar el reporte que quiero ver
router.post('/vue_repot_buscar/:id_medico', (req,res) => {
  const { id_medico } = req.params;
  var estado = req.body
  var esto = {
    method: 'POST',
    body: JSON.stringify(estado),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:3000/api/report_citas/'+id_medico,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(resp => {
    res.status(200).json(resp)
  })
})

//imprimir receta
router.get('/imprimirLaboratorio', (req,res) => {
  res.render('consulta_externa/imprimirLaboratorio')
});

//rutas de vacunas
router.get('/vacunas', (req,res) => {
  res.render('consulta_externa/vacunas')
});

//ruta de examenes complementario
router.get('/O_Laboratorio', (req,res) => {
  res.render('consulta_externa/O_Laboratorio')
});

 
//reporte fichas



router.get('/ReporCita', (req,res) =>{
  res.render('Fichas/ReporCita')
});
router.get('/ReporPaciente',(req,res)=>{
  res.render('Fichas/ReporPaciente')
});

router.get('/DatoPacienReport',(req,res)=>{
  res.render('Fichas/DatoPacienReport')
});
//reporte de citas

router.get('/ReporPacenA', (req,res) =>{
  res.render('consulta_externa/ReporPacenA')
});
router.get('/ReporEnfermedades',(req,res)=>{
  res.render('consulta_externa/ReporEnfermedades')
});



//RECONSULTA
router.get('/citas_reconsulta', (req,res) => {
  res.render('Fichas/citas_reconsulta')
});

//Radiografia
router.get('/radiografia', (req,res) => {
  res.render('Radiografia/homeRa')
});
router.get('/listaPR', (req,res) => {
  res.render('Radiografia/listaPR')
});
router.get('/IntroducePR', (req,res) => {
  res.render('Radiografia/IntroducirPR')
});

//ECOGRAFIA
router.get('/ecografia', (req,res) => {
res.render('Ecografia/homeec')
});
router.get('/listaEC', (req,res) => {
  res.render('Ecografia/listaEC')
});
router.get('/IntroduceEC', (req,res) => {
  res.render('Ecografia/IntroducirEC')
});

//laboratorio
router.get('/laboratorio', (req,res) => {
  res.render('laboratorio/homeLab')
});
router.get('/buscaPaciente', (req,res) => {
  res.render('laboratorio/buscaPaciente')
});
router.get('/IntroducirLab', (req,res) => {
  res.render('laboratorio/IntroducirLab')
});

//HISTORIAL CLINICO REPORTES

router.get('/HistorialGeneral', (req,res) => {
  res.render('consulta_externa/HistorialGeneral')
});
router.get('/H_hospitalizacion', (req,res) => {
  res.render('consulta_externa/H_hospitalizacion')
});
router.get('/H_Emergencia', (req,res) => {
  res.render('consulta_externa/H_Emergencia')
});
router.get('/H_Consulta', (req,res) => {
  res.render('consulta_externa/H_Consulta')
});

router.get('/ultimaCOnsultaH',(req,res) =>{
  res.render('consulta_externa/ultimaCOnsultaH')
});


/**home citas medicas */

///** */
module.exports = router;