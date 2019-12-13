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

var msg= {}
function msg_data(data,id){
  let msg_data = msg[id];
    if (!msg_data) {
        msg_data = msg[id] = {
        data: data,
        qty: 0
      };
    }
    msg_data.qty++;
}

function array () {
  let arr = [];
  for (const id in msg) {
      arr.push(msg[id]);
  }
  return arr;
}
function remove(id) {
    delete msg[id];
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
router.get('/lab_consulta_externa/:id_consulta/:token_id/:token_p/:id_cita', (req,res) => {
    const { id_consulta, token_id, token_p, id_cita } = req.params
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
                    data_paciente,
                    id_cita
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
router.get('/list_ecografias/:historial/:id_consulta', (req,res) => {
    const { historial, id_consulta } = req.params
    fetch('http://localhost:3050/api/list_ecografia/'+historial+'/'+id_consulta)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_rayosX/:historial/:id_consulta', (req,res) => {
    const { historial, id_consulta } = req.params
    fetch('http://localhost:3050/api/list_rayosX/'+historial+'/'+id_consulta)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_laboratorios/:historial/:id_consulta', (req,res) => {
    const { historial, id_consulta } = req.params
    fetch('http://localhost:3050/api/list_lab/'+historial+'/'+id_consulta)
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


//lista de ecografias de hopitalizacion segun historial del paciente 
router.get('/list_ecografias_hopitalizacion/:historial/:id_hospitalizacion', (req,res) => {
    const { historial,id_hospitalizacion } = req.params
    fetch('http://localhost:3050/api/lista_Ecografia_hospitalizacion/'+historial+'/'+id_hospitalizacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

//lista de rayos x de hospitalizacion

router.get('/list_rayosX_hopitalizacion/:historial/:id_hospitalizacion', (req,res) => {
    const { historial, id_hospitalizacion} = req.params
    fetch('http://localhost:3050/api/lista_rayosX_hopitalizacion/'+historial +'/'+ id_hospitalizacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

//lista de laboratorios de hospitalizacion
router.get('/lista_lab_hospitalizacion/:historial/:id_hospitalizacion', (req,res) => {
    const { historial, id_hospitalizacion } = req.params
    fetch('http://localhost:3050/api/lista_lab_hospitalizacion/'+historial+'/'+id_hospitalizacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z
                                lista de laboratorios de emergencia
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z
*/

//rutas para la lista de laboratorios
router.get('/list_ecografias_emg/:historial/:id_emg', (req,res) => {
    const { historial, id_emg } = req.params
    console.log(req.params)
    fetch('http://localhost:3050/api/lista_Ecografia_emg/'+id_emg +'/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_rayosX_emg/:historial/:id_emg', (req,res) => {
    const { historial, id_emg } = req.params
    fetch('http://localhost:3050/api/lista_rayosX_emg/'+id_emg+'/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_laboratorios_emg/:historial/:id_emg', (req,res) => {
    const { historial, id_emg } = req.params
    fetch('http://localhost:3050/api/lista_lab_emg1/'+id_emg+'/'+historial)
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
               
                fetch('http://localhost:3050/api/one_resp_lab/'+id_lab) 
                .then(res => res.json())    
                .then(data_one_resp_lab => { 
                    res.render('laboratorio/IntroducirLab',{
                        data_paciente,
                        data_doc: data_user[token_id],
                        one_lab,
                        data_one_resp_lab,
                        msg:msg[token_id]
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
 router.post('/vue_register_respLab/:id_lab/:historial1/:token_id', (req,res) => {
    const { id_lab, historial1, token_id } = req.params;
    var msg_p
    if( datas.name.token[token_id] ){
        if( req.file == '' || req.file == null ){
            if(msg[token_id] == null){
                msg_p = {
                  success:false,
                  data_p:"selecione un archivo por favor antes de registrar"
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:false,
                  data_p:"selecione un archivo por favor antes de registrar"
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            }
            res.redirect('/laboratorios/laboratorio/'+id_lab+'/'+historial1+'/'+token_id)
        }else{
            var file = req.file.filename.split('.')[1]
            if( file == 'pdf' || file == 'jpg' || file == 'png' || file == 'JPEG'){
                const { historial,nombre_user,fecha,id_user,descripcion, hora, imagen_resp, img_id } = req.body
                var datos = {
                    fecha,
                    hora,
                    historial,
                    nombre_user,
                    imagen_resp,
                    img_id,
                    descripcion,
                    id_user,
    
                    imagen_resp:req.file.filename,
                    img_id:req.file.path,
                
                }
                var esto = {
                    method: 'POST',
                    body: JSON.stringify(datos),
                    headers:{
                      'Content-type' : "application/json"
                      //'Content-Type': 'multipart/form-data'
                    }
                };
                fetch('http://localhost:3050/api/registrar_espuesta_lab/'+id_lab,esto)
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(data => {
                    if(data.success == true){
                        if(msg[token_id] == null){
                            msg_p = {
                              success:true,
                              data_p:data.msg
                            }
                            msg_data(msg_p,token_id)
                        }else{
                            msg_p = {
                              success:true,
                              data_p:data.msg 
                            }
                            remove(token_id)
                            msg_data(msg_p,token_id)
                        }
                        update_estado(id_lab);
                        res.redirect('/laboratorios/laboratorio/'+id_lab+'/'+historial1+'/'+token_id)
                    }else{
                        if(msg[token_id] == null){
                            msg_p = {
                              success:false,
                              data_p:data.msg
                            }
                            msg_data(msg_p,token_id)
                        }else{
                            msg_p = {
                              success:false,
                              data_p:data.msg
                            }
                            remove(token_id)
                            msg_data(msg_p,token_id)
                        }
                        res.redirect('/laboratorios/laboratorio/'+id_lab+'/'+historial1+'/'+token_id)    
                    }
                }) 
                }else{
                if(msg[token_id] == null){
                    msg_p = {
                      success:false,
                      data_p:"Solo se permite archivos de tipo .PDF, .JPG, .JPEG y .PNG"
                    }
                    msg_data(msg_p,token_id)
                }else{
                    msg_p = {
                      success:false,
                      data_p:"Solo se permite archivos de tipo .PDF, .JPG, .JPEG y .PNG"
                    }
                    remove(token_id)
                    msg_data(msg_p,token_id)
                }
                res.redirect('/laboratorios/laboratorio/'+id_lab+'/'+historial1+'/'+token_id) 
    
            }
        }

    }else{
        res.redirect('/');
    }
    setTimeout(()=>{
        remove(token_id)
    },1000);
    
 })

 function update_estado (id_lab){
    var datos = {
        estado:'false'
    };
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
        console.log(data)
    })
 }

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

