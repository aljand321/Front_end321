const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');

router.get('/mostrar', (req,res) => {
    res.send(data_user)
})

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
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                       esta ruta es para poder renderizar la vista del laboratorista
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
router.get('/home/:id_user',(req, res) => {
    const { id_user } = req.params
   
    var data_token = {
        token_id: {},
        personal:{},        
      }
    fetch('http://localhost:3600/api/user/'+id_user)  // esto es para sacar el token del usuario
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
        
           // console.log( resp1.length,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>hola laboratorio")
            if(datas.name.token[resp.id]){
                data_token.token_id = resp.id 
                var status
                for(var i = 0; i < resp.role.length; i++ ){
                    if(resp.role[i].name == "laboratorio"){
                        status = "tiene permiso"
                    }
                } 
                
                if(status == "tiene permiso"){
                    fetch('http://localhost:3600/api/personal/'+resp.perso_id)
                    .then(resp => resp.json())
                    .catch(error => console.error('Error',error))
                    .then(personal => {
                        
                        data_token.personal = personal 
                        fetch('http://localhost:3050/api/list_dianmic_lab/'+id_user)  // 
                        .then(resp => resp.json())
                        .catch(error => console.error('Error',error))
                        .then(lista_pacientes => {
                            if(data_user[data_token.token_id] == null){
                                user(data_token, data_token.token_id)
                                res.render('laboratorio/homeLab',{
                                    data_token,
                                    lista_pacientes: lista_pacientes.length,
                                    token:{
                                        success: datas.name.token[resp.id].data.success,
                                        token:datas.name.token[resp.id].data.token,
                                        user:{
                                            id: datas.name.token[resp.id].data.user.id,
                                            perso_id: datas.name.token[resp.id].data.user.perso_id,
                                            username: datas.name.token[resp.id].data.user.username,
                                            email:  datas.name.token[resp.id].data.user.email,
                                        } 
                                    },
                                    login:datas.name.session[resp.id]
                                })
                                status = null
                            }else{
                                remove_user( data_token.token_id)
                                user(data_token, data_token.token_id)
                                res.render('laboratorio/homeLab',{
                                    data_token,
                                    lista_pacientes: lista_pacientes.length,
                                   
                                    token:{
                                        success: datas.name.token[resp.id].data.success,
                                        token:datas.name.token[resp.id].data.token,
                                        user:{
                                            id: datas.name.token[resp.id].data.user.id,
                                            perso_id: datas.name.token[resp.id].data.user.perso_id,
                                            username: datas.name.token[resp.id].data.user.username,
                                            email:  datas.name.token[resp.id].data.user.email,
                                        } 
                                    },
                                    login:datas.name.session[resp.id]
                                })
                                status = null
                            }
                            remove_session(resp.id),{expiresIn: 10* 30}
                                function remove_session(id) {
                                delete datas.name.session[id]
                            }
                        })
                        
                       
                    })
                }else{
                    res.redirect('/')
                }
            }else{
                res.redirect('/')
            }

        
        
    })
   /*  res.render('hospitalizaciones/homeHospitalizacion',{
        especialidad //esto manda la especialdad
    }) */       
});

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        esta ruta es para poder renderizar laboratorios desde consulta externa
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
router.get('/lab_consulta_externa/:id_consulta/:token_id/:token_p', (req,res) => {
    const { id_consulta, token_id, token_p} = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_p){
        fetch('http://localhost:3000/api/OnlyConsulta/'+id_consulta)        
        .then(resp => resp.json())
        .then(ConsultaOnly =>{
            console.log(ConsultaOnly, " <<<<<<<<<<<< esto es lo que quiero ver")
            fetch('http://localhost:3000/api/onlyPaciente/'+ConsultaOnly[0].numeroHistorial)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data_paciente => {
                //console.log(data_paciente, " <<<<<<<<<<<< esto es lo que quiero ver")
                res.render('consulta_externa/O_Laboratorio',{
                    ConsultaOnly,
                    data_doc:datas.name.data_user[token_id],
                    data_paciente
                })
             })
            
        })
        .catch(error => {
            res.status(500).json({
                success:false,
                msg:"No hay coneccion que el servidor 3000",
                error
            })
        })
    }else{
        res.redirect('/')
    }
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        estas rutas son para poder listar y registrar laboratorios desde vue
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
router.post('/vue_insert_lab_consultaExterna/:id_consulta', (req,res) => {
    const { id_consulta } = req.params
    var data = req.body
    console.log(data, " z<<<")
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3050/api/create_lab_consulta/'+id_consulta,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then( data => {
        res.status(200).json(data)
    })
})

//rutas para la lista de laboratorios
router.get('/list_ecografias/:historial', (req,res) => {
    const { historial } = req.params
    fetch('http://localhost:3050/api/list_ecografia/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_rayosX/:historial', (req,res) => {
    const { historial } = req.params
    fetch('http://localhost:3050/api/list_rayosX/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_laboratorios/:historial', (req,res) => {
    const { historial } = req.params
    fetch('http://localhost:3050/api/list_lab/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

router.get('/vue_one_lab/:id_lab', (req,res) => {
    const { id_lab } = req.params
    fetch('http://localhost:3050/api/one_lab/'+id_lab)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})



/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        rutas para poder mostrar lista de laboratorios filtrado
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

 router.get('/view_list_lab/:nombre/:token_id', (req,res) => {
     const { nombre, token_id } = req.params
     if( datas.name.token[token_id] ){
        fetch('http://localhost:3050/api/list_dianmic_lab/'+nombre)
        .then(res => res.json())
        
        .then(list_true => {
            fetch('http://localhost:3050/api/list_dinamic_false/'+nombre)
            .then(res => res.json())
           
            .then(list_false => {
                fetch('http://localhost:3000/api/list_pacientes')
                .then(res => res.json())
                
                .then(list_pacientes => {
                    res.render('laboratorio/buscaPaciente',{
                        list_true,
                        data_doc: data_user[token_id],
                        list_false,
                        list_pacientes
                   })
                })
                .catch(error => {
                    res.render('laboratorio/404error',{
                     data_doc: data_user[token_id],
                     msg:"Algo paso con el servidor 3000",
                     error
                    })
                 }) 
               
            })
            .catch(error => {
                res.render('laboratorio/404error',{
                 data_doc: data_user[token_id],
                 msg:"Algo paso con el servidor 3050",
                 error
                })
             }) 
          
        })
        .catch(error => {
            res.render('laboratorio/404error',{
             data_doc: data_user[token_id],
             msg:"Algo paso con el servidor 3050",
             error
            })
         }) 
    } else{
        res.redirect('/')
    }
 })

 /* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        rutas para poder renderizar la resuesta de laboratorio
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

 router.get('/laboratorio/:id_lab/:historial/:token_id', (req,res) => {
     const { id_lab,historial,token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/onlyPaciente/'+historial)
        .then(res => res.json())    
        .then(data_paciente => {   
           fetch('http://localhost:3050/api/one_lab/'+id_lab) 
           .then(res => res.json())    
           .then(one_lab => { 
                fetch('http://localhost:3000/api/one_consulta_id/'+one_lab[0].id_consulta)
                .then(res => res.json())    
                .then(data_consulta => { 
                    console.log(data_consulta," <<<<<<<<<<<<<<<   asdasdasd    <<<<<<<<<<<<<<<<<<<<<<<<<")
                    res.render('laboratorio/IntroducirLab',{
                        data_paciente,
                        data_doc: data_user[token_id],
                        one_lab,
                        data_consulta
                    })
                })
                .catch(error => {
                    res.render('laboratorio/404error',{
                     data_doc: data_user[token_id],
                     msg:"Algo paso con el servidor 3000",
                     error
                    })
                 }) 
               
              
           })
           .catch(error => {
            res.render('laboratorio/404error',{
             data_doc: data_user[token_id],
             msg:"Algo paso con el servidor 3050",
             error
            })
         }) 
        })
        .catch(error => {
            res.render('laboratorio/404error',{
             data_doc: data_user[token_id],
             msg:"Algo paso con el servidor 3000",
             error
            })
         }) 
       
    } else {
        res.redirect('/')
    }
 })

 //ruta vue para insertar en la respuesta laboratorio
 router.post('/vue_register_respLab/:id_lab', (req,res) => {
    const { id_lab } = req.params
    var datos = req.body;
   /*  var datos1 = req.fiel;
    console.log(datos, "  <<<<<<<<<<<< < << < < < < < <  <<<<<<<<<<<<<<<<<<<<<<")
    console.log(datos1, "  <<<<<<<<<<<< < << < < < < < <  <<<<<<<<<<<<<<<<<<<<<<") */

    var esto = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json",
          'Content-Type': 'multipart/form-data'
        }
    };
    fetch('http://localhost:3050/api/registrar_espuesta_lab/'+id_lab,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
 })

 //ruta para poder actualizar el estado de resp lab
 router.post('/vue_update_estado_Lab/:id_lab', (req,res) => {
    const { id_lab } = req.params
    var datos = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3050/api/update_estado_labRespuesta/'+id_lab,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
 })

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        esta ruta es para poder renderizar laboratorios desde emergencia
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

router.get('/datas_token', (req,res) => {   
    res.send(datas)
})


router.get('/lab_emergencia/:id_consulta/:token_id/:token_p/:id_cita', (req,res) => {
    const { id_consulta, token_id, token_p, id_cita} = req.params
    console.log(id_consulta, "   <zzzzz esto es el id de la consulta")
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_p){
        fetch('http://localhost:3000/api/one_consulta_emg/'+id_consulta)        
        .then(resp => resp.json())
        .then(ConsultaOnly =>{
            console.log(ConsultaOnly, " <<<<<<<<<<<< esto es lo que quiero ver")
            fetch('http://localhost:3000/api/onlyPaciente/'+ConsultaOnly[0].Nhistorial)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data_paciente => {           
                res.render('emergencia2.0/Laboratorio_emg',{
                    ConsultaOnly,
                    data_doc:datas.name.data_user[token_id],
                    data_paciente,
                    id_cita // esto id es para poder volver una vista atras
                })
             })
            
        })
        .catch(error => {
            res.status(500).json({
                success:false,
                msg:"No hay coneccion que el servidor 3000",
                error
            })
        })
    }else{
        res.redirect('/')
    }
})

// ruta para poder insertar en consulta de emergencia
router.post('/vue_insert_lab_consulta_emg/:id_consulta', (req,res) => {
    const { id_consulta } = req.params
    var data = req.body
    console.log(data, " z<<<")
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3050/api/create_lab_consulta_emg/'+id_consulta,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then( data => {
        res.status(200).json(data)
    })
})



/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        esta ruta es para poder renderizar laboratorios desde consulta externa
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
router.get('/lab_hopitalizacion/:id_consulta/:historial/:token_id', (req,res) => {
    const { id_consulta, historial, token_id} = req.params
    if(datas.name.token[token_id]){
        fetch('http://localhost:3000/api/One_intern/'+id_consulta)
        .then(res => res.json())
        .then(one_internacion => { 
           
            fetch('http://localhost:3000/api/onlyPaciente/'+historial)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data_paciente => {
                
                res.render('hospitalizaciones/lab_hospitalizacion',{
                    one_internacion,
                    data_doc:datas.name.data_user[token_id],
                    data_paciente
                })

            })
            
        })
        .catch(error => {
            res.status(500).json({
                success:false,
                msg:"No hay coneccion que el servidor 3000",
                error
            })
        })
    }else{
        res.redirect('/')
    }
})

// ruta para poder insertar en consulta de emergencia
router.post('/vue_insert_lab_hospitalizacion/:id_hospitalizacion', (req,res) => {
    const { id_hospitalizacion } = req.params
    var data = req.body
    console.log(data, " z<<<")
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3050/api/create_lab_hospitalizacion/'+id_hospitalizacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then( data => {
        res.status(200).json(data)
    })
})
 
module.exports = router;

