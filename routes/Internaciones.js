const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

var url = require('./url/export');

const datas = require('./url/export');

router.get('/data_user', (req,res) => {
    res.send(data_user);
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


// esta funcion manda los mensajes del post segun el usuario
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var msg_Consulta_hospitalizacion = {}
function msg_data(data,id){
  let msg_data = msg_Consulta_hospitalizacion[id];
    if (!msg_data) {
        msg_data = msg_Consulta_hospitalizacion[id] = {
        data: data,
        qty: 0
      };
    }
    msg_data.qty++;
}

function array () {
  let arr = [];
  for (const id in msg_Consulta_hospitalizacion) {
      arr.push(msg_Consulta_hospitalizacion[id]);
  }
  return arr;
}
function remove(id) {
    delete msg_Consulta_hospitalizacion[id];
}

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                rutas con vue
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
//listar las salas disponibles de una especialidad
router.get('/Vue_list_salas/:especialidad', (req,res) => {
    const { especialidad } = req.params
    fetch(url.name.url+'/api/ServSalasN/'+especialidad) 
    .then(resp => resp.json())
    .then(resp =>{
        res.status(200).json(resp)
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })    
})

//listar las camas segun la sala
router.get('/VUe_list_camas/:id_Sala', (req,res) => {
    const { id_Sala } = req.params
    fetch(url.name.url+'/api/camaSala/'+id_Sala) 
    .then(resp => resp.json())
    .then(resp =>{
        res.status(200).json(resp)
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
//para renderizar una vista de botones donde esta doctor y enfermera temporalmente
router.get('/viewTemporal', (req,res) => {
    fetch(url.name.cuadernos+'/api/especialidad')
    .then(resp => resp.json())
    .then(resp =>{
        res.render('hospitalizaciones/viewFirst',{
            resp
        })
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })    
});
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                    //serv para mostrar home hospitalizacion o internacion

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

router.get('/home/:id_user',(req, res) => {
    const { id_user } = req.params
   
    var data_token = {
        token_id: {},
        medico:{},
        area_esp:{}
      }
    fetch('http://localhost:3600/api/user/'+id_user)  // esto es para sacar el token del usuario
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
        fetch('http://localhost:3000/api/PinterFalse/'+id_user)  // 
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))  
        .then(lista_paciente => {

            console.log( resp.length,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>hola hospitalizacion")
               if(datas.name.token[resp.id]){
            data_token.token_id = resp.id 
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "hospitalizacion"){
                    status = "tiene permiso"
                }
            } 
            
            if(status == "tiene permiso"){
                fetch('http://localhost:3600/api/personal/'+resp.perso_id)
                .then(resp => resp.json())
                .catch(error => console.error('Error',error))
                .then(personal => {
                    data_token.medico = personal 
                    fetch('http://localhost:4600/api/doctor_area/'+resp.perso_id)
                    .then(resp => resp.json())
                    .catch(error => console.error('Error',error))
                    .then(doctor_area => {
                        if (doctor_area == ""){
                            res.send("El doctor no esta registrado en una especialidad")
                        }else{
                            data_token.area_esp = doctor_area[0].Especialidade;
                        
                            if(data_user[data_token.token_id] == null){
                                user(data_token, data_token.token_id)
                                res.render('hospitalizaciones/homeHospitalizacion',{
                                    data_token,
                                    lista_paciente:lista_paciente.length,
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
                                    especialidad:doctor_area[0].Especialidade,
                                    login:datas.name.session[resp.id]
    
                                })
                                status = null
                            }else{
                                remove_user( data_token.token_id)
                                user(data_token, data_token.token_id)
                                res.render('hospitalizaciones/homeHospitalizacion',{
                                    data_token,
                                    lista_paciente:lista_paciente.length,
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
                                    especialidad:doctor_area[0].Especialidade,
                                    login:datas.name.session[resp.id]  
                                })
                                status = null
                            }
                            remove_session(resp.id),{expiresIn: 10* 30}
                            function remove_session(id) {
                                delete datas.name.session[id]
                            }
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
        

    })
   /*  res.render('hospitalizaciones/homeHospitalizacion',{
        especialidad //esto manda la especialdad
    }) */       
});
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                    //ser para renderizar lista hospitalizacion mostrando 

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// esta ruta es para traer la lista de internacion de tipo false
router.get('/ListaInternacionF/:id_especialidad/:token_id', (req,res) => {
    const { id_especialidad, token_id } = req.params;
    if( datas.name.token[token_id] ){
        fetch(url.name.url+'/api/PinterFalse/'+id_especialidad) // esta ruta solo trae los datos de tipo true
        .then(resp => resp.json())
        .then(listFalse =>{

            fetch(url.name.url+'/api/PinterTrue/'+id_especialidad) // esta ruta solo trae los datos de tipo true
            .then(resp => resp.json())
            .then(resp =>{

                res.render('hospitalizaciones/listasHospitalizacion',{
                    resp,
                    listFalse,// lleva la lista de tipo false
                    data_doc: data_user[token_id],
                })
            })
        })        
        .catch(error => {
           res.render('hospitalizaciones/404error',{
            data_doc: data_user[token_id],
            msg:"Algo paso con el servidor 3000",
            error
           })
        }) 
    }else{
        res.redirect('/')

    }
    
    
});





/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<
            regsitro de internacion
>>>>>>><<<<<<<<<<>>>>>>>>>><<<<>>><>>><<>>><<>>><
<<<<<<<>><<<<><<<>><<<><<<>><<>>><<>>><<>>>><<<>>
*/
/* 
//ruta para renderizar el form de internacion
router.get('/renderInternacion', (req,res) => {
    res.render('hospitalizaciones/reg_internacion',{
        Pint,
        formUpdate_internacion,
        paciente_internacion
    });
});

var paciente_internacion
router.get('/list_internacion_paciente', (req,res) => {
    fetch(url.name.url+'/api/list_internacion_paciente/'+idTipoConsulta.id+"/"+idTipoConsulta.historial) 
    .then(resp => resp.json())
    .then(resp =>{
        paciente_internacion = resp;
        res.redirect('/internaciones/renderInternacion');
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})

//ruta para poder el formulario de internacion segun su papeleta de internacion
var formUpdate_internacion
router.get('/One_form_Internacion/:id_Pinternacion', (req,res) => {
    const { id_Pinternacion } = req.params;
    fetch(url.name.url+'/api/one_Form_internacion/'+id_Pinternacion) 
    .then(resp => resp.json())
    .then(resp =>{
        //console.log(resp, "  <<<<<<<<<<<<<<<<<<<<  esto es la respuesta que quiero")
        formUpdate_internacion = resp;
        res.redirect('/internaciones/list_internacion_paciente');
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
}) */
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//esta ruta es para poder traer una papeleta de internacion

router.get('/only_pInternacion/:id/:id_especialidad/:tipoCons/:historial/:token_id', (req,res) => {
    const { id,id_especialidad, tipoCons, historial, token_id } = req.params;
    
    if( datas.name.token[token_id] ){
        fetch(url.name.url+'/api/one_Pinternacion/'+id+"/"+tipoCons) 
        .then(resp => resp.json())
        .then(Pint =>{
            
            fetch(url.name.url+'/api/one_Form_internacion/'+id) 
            .then(resp => resp.json())
            .then(formUpdate_internacion =>{
               
                fetch(url.name.url+'/api/list_internacion_paciente/'+id_especialidad+"/"+historial) 
                .then(resp => resp.json())
                .then(paciente_internacion =>{                  
                    
                    res.render('hospitalizaciones/reg_internacion',{
                        Pint,
                        formUpdate_internacion,
                        paciente_internacion,
                        data_doc: data_user[token_id],
                        msg:msg_Consulta_hospitalizacion[token_id],
                        data_post:data_post[token_id]
                    });
                    remove_msg()
                    function remove_msg(){
                      if(msg_Consulta_hospitalizacion[token_id] != null){
                        if(msg_Consulta_hospitalizacion[token_id].data.success == true){
                          remove(token_id),{expiresIn: 10* 30}
                         }
                      }
                     
                    }
                })
                .catch(error => {
                    res.render('hospitalizaciones/404error',{
                        data_doc: data_user[token_id],
                        msg:"Algo paso con el servidor 3000",
                        error
                    })
                }) 

            })
            .catch(error => {
                res.render('hospitalizaciones/404error',{
                    data_doc: data_user[token_id],
                    msg:"Algo paso con el servidor 3000",
                    error
                })
            }) 
        })        
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        }) 
    }else{
        res.redirect('/')
    }

});


var data_post = {}
function data_p(data,id){
  let storedItem = data_post[id];
    if (!storedItem) {
      storedItem = data_post[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_post () {
  let arr = [];
  for (const id in data_post) {
      arr.push(data_post[id]);
  }
  return arr;
}

function remove_post(id) {
  delete data_post[id];
}

//ROUTA PARA INSERTAR

router.post('/internacion/:idPinternacion/:id_especialidad/:token_id', (req,res) => {
    const { idPinternacion,id_especialidad, token_id } = req.params;
    
    var msg_p
    var data_body = req.body
    if(data_body.cama == "" || data_body.cama == null){
        if(msg_Consulta_hospitalizacion[token_id] == null){
            msg_p = {
              success:false,
              data_p:"Selecione cama por favor"
            }
            msg_data(msg_p,token_id)
        }else{
            msg_p = {
              success:false,
              data_p:"Selecione cama por favor"
            }
            remove(token_id)
            msg_data(msg_p,token_id)
        }
        if(data_post[token_id] == null){
            data_p(data_body,token_id)
        }else{
            remove_post(token_id)
            data_p(data_body,token_id)
        }
        res.redirect( '/internaciones/only_pInternacion/'+idPinternacion+"/"+id_especialidad+"/"+data_body.provieneDE+"/"+data_body.historial+"/"+token_id );
    }else {
        var esto = {
            method: 'POST',
            body: JSON.stringify(data_body),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch('http://localhost:3000/api/internaciones/'+idPinternacion+"/"+data_body.cama,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            
            if(data.success == true){
    
                if(msg_Consulta_hospitalizacion[token_id] == null){
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
    
                fetch(url.name.url+'/api/updateEstadoCama/'+data_body.cama+"/"+data_body.historial) 
                .then(resp => resp.json())
                .then(resp =>{
    
                    if(resp.success == true){
    
                        fetch(url.name.url+'/api/estado_p_internacion/'+idPinternacion) 
                        .then(resp => resp.json())
                        .then(resp =>{
    
                            if(resp.success == true){
                                remove_post(token_id)
                                res.redirect( '/internaciones/only_pInternacion/'+idPinternacion+"/"+id_especialidad+"/"+data_body.provieneDE+"/"+data_body.historial+"/"+token_id );
                            }else{
                                if(msg_Consulta_hospitalizacion[token_id] == null){
                                    msg_p = {
                                      success:false,
                                      data_p:"error, no se actualizo el estado de este formulario"
                                    }
                                    msg_data(msg_p,token_id)
                                }else{
                                    msg_p = {
                                      success:false,
                                      data_p:"error, no se actualizo el estado de este formulario"
                                    }
                                    remove(token_id)
                                    msg_data(msg_p,token_id)
                                }
                            }
                        })
                        .catch(error => {
                            res.render('hospitalizaciones/500error',{
                                data_doc: data_user[token_id],
                                
                                error
                            })
                        }) 
                    }else{
                        if(msg_Consulta_hospitalizacion[token_id] == null){
                            msg_p = {
                              success:false,
                              data_p:"No se pude registrar al paciente en esa cama"
                            }
                            msg_data(msg_p,token_id)
                        }else{
                            msg_p = {
                              success:false,
                              data_p:"No se pude registrar al paciente en esa cama"
                            }
                            remove(token_id)
                            msg_data(msg_p,token_id)
                        }
                        res.redirect( '/internaciones/only_pInternacion/'+idPinternacion+"/"+id_especialidad+"/"+data_body.provieneDE+"/"+data_body.historial+"/"+token_id );
                    }
    
                })
                .catch(error => {
                    res.render('hospitalizaciones/500error',{
                        data_doc: data_user[token_id],
                        
                        error
                    })
                }) 
            }else{
                if(msg_Consulta_hospitalizacion[token_id] == null){
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
                if(data_post[token_id] == null){
                    data_p(data_body,token_id)
                }else{
                    remove_post(token_id)
                    data_p(data_body,token_id)
                }
                res.redirect( '/internaciones/only_pInternacion/'+idPinternacion+"/"+id_especialidad+"/"+data_body.provieneDE+"/"+data_body.historial+"/"+token_id ); 
            }
            
        }) 
    }    
});

/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<
        Actualizar papeleta de internacion
>>>>>>><<<<<<<<<<>>>>>>>>>><<<<>>><>>><<>>><<>>><
<<<<<<<>><<<<><<<>><<<><<<>><<>>><<>>><<>>>><<<>>
*/

//esta ruta cambia el estado de la cama a false que es ocupado y ademas que añade al paciente
router.get('/estadoCama1/:idCama/:historial/:token_id/:idPinternacion/:provieneDE/:id_especialidad', (req,res) => {
    var data = req.params;
    fetch(url.name.url+'/api/updateEstadoCama/'+data.idCama+"/"+data.historial) 
    .then(resp => resp.json())
    .then(resp =>{
        console.log(resp, " estado 1")
        res.redirect( '/internaciones/only_pInternacion/'+data.idPinternacion+"/"+data.id_especialidad+"/"+data.provieneDE+"/"+data.historial+"/"+data.token_id); 
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})

router.get('/update_estado_cama/:idCama/:newIDcama/:historial/:token_id/:idPinternacion/:provieneDE/:id_especialidad', (req,res) => {
    const { idCama, newIDcama, historial, token_id,idPinternacion,provieneDE, id_especialidad} = req.params;
     var data = {
        estado: "true",
        historial: "0"
    }
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.url+'/api/updateCama_estado/'+idCama,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        console.log(data ," <<<< estado")
        res.redirect('/internaciones/estadoCama1/'+newIDcama+"/"+historial+'/'+token_id+'/'+idPinternacion+'/'+provieneDE+"/"+id_especialidad);
    }) 
})

//ruta para poder actualizar form internacion
router.post('/update_Form_internacion/:id/:id_especialidad/:id_cama/:token_id', (req,res) => {
    const { id,id_especialidad, id_cama,token_id } = req.params;
    var data_update = req.body;
    
     var msg_p
    var esto = {
        method: 'POST',
        body: JSON.stringify(data_update),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/update_form_internacion/'+id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        if (data.success == true){

            if(msg_Consulta_hospitalizacion[token_id] == null){
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
            
            res.redirect('/internaciones/update_estado_cama/'+id_cama+'/'+data_update.cama+'/'+ data_update.historial+'/'+token_id+'/'+data_update.idPinternacion+"/"+data_update.provieneDE+"/"+id_especialidad)
            
            
        }else{

            if(msg_Consulta_hospitalizacion[token_id] == null){
                msg_p = {
                  success:false,
                  data_p:"No se pudo actualizar los datos"
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:false,
                  data_p:"No se pudo actualizar los datos"
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            }
            res.redirect( '/internaciones/only_pInternacion/'+data_update.idPinternacion+"/"+id_especialidad+"/"+data_update.provieneDE+"/"+data_update.historial+"/"+token_id ); 
        }    
    }) 
})

/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<
            Recetas de internacion
>>>>>>><<<<<<<<<<>>>>>>>>>><<<<>>><>>><<>>><<>>><
<<<<<<<>><<<<><<<>><<<><<<>><<>>><<>>><<>>>><<<>>
*/

router.get('/receta_internacion', (req,res) => {
    if(especialidad1 == null){
        res.redirect('/internaciones/viewTemporal')
    }else{
        res.render('hospitalizaciones/receta',{
            especialidad:especialidad1,
            data_internacion,
            One_paciente
        })
    }    
})

var One_paciente
router.get('/paciente_One',(req,res) => {
    fetch('http://localhost:3000/api/onlyPaciente/'+data_internacion[0].historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        One_paciente = data;
        res.redirect('/internaciones/receta_internacion')        
    }) 
})

var data_internacion;
router.get('/traerInternacion/:id_internacion', (req,res) => {
    const { id_internacion } = req.params;
    fetch('http://localhost:3000/api/One_Internacion/'+id_internacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        data_internacion = data;
        res.redirect('/internaciones/paciente_One')        
    }) 
})

/*router.post('/receta/:id_internacion', (req,res) => {
    const { id_internacion } = req.params
    var med = req.body.medicamentos;
    var data = {
        receta_de:req.body.receta_de,
        historial:req.body.historial,
        fechaEmicion: req.body.fechaEmicion,
        nombre_doctor:req.body.nombre_doctor,
        medicamentos : JSON.stringify(med),
    }

    res.send(data)
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/receta_interncaion/'+id_internacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.send(data)   
    }) 
})*/

///ruta para enviar receta
router.post('/vuePOstReceta/:id', (req,res) => {
    const { id } = req.params;
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/receta_interncaion/'+id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        console.log(data)
        res.status(200).json(data)
    })
})


/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<
            lista de Internados
>>>>>>><<<<<<<<<<>>>>>>>>>><<<<>>><>>><<>>><<>>><
<<<<<<<>><<<<><<<>><<<><<<>><<>>><<>>><<>>>><<<>>
*/

router.get('/list_internadios/:id_especialidad/:token_id', (req,res) => {
    const { id_especialidad,token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/list_internacion_especialidad/'+id_especialidad)
        .then(res => res.json())

        .then(list_internacion => { 
            res.render('hospitalizaciones/pacientes_de_internacion',{
                list_internacion,
                data_doc: data_user[token_id]
            })        
        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        })  
    }else{
        res.redirect('/')
    }
    
})


router.get('/list_internados_alta/:id_especialidad/:token_id', (req,res) => {
    const { id_especialidad,token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/list_internacion_especialidad_false/'+id_especialidad)
        .then(res => res.json())
        .then(list_internacion => { 
            console.log(list_internacion, "  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            res.render('hospitalizaciones/list_pacientes_alta',{
                list_internacion,
                data_doc: data_user[token_id]
            })        
        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        })  
    }else{
        res.redirect('/')
    }
    
})

router.get('/paciente_internacion/:id/:token_id', (req,res) => {
    const { id,token_id } = req.params;
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/One_intern/'+id)
        .then(res => res.json())
        .then(one_internacion => { 
            console.log(one_internacion, "   <<<<<<<<<<<<<    11111  <<<<<<<<<<<<<<<<<<")
            paciente(one_internacion[0].historial)
            function paciente(data){

                fetch('http://localhost:3000/api/onlyPaciente/'+data)
                .then(res => res.json())
                .then(data => { 
                    
                    res.render('hospitalizaciones/paciente_internacion',{
                        data_doc: data_user[token_id],
                        one_internacion,
                        data_paciente:data

                    })    
                }) 
                .catch(error => {
                    res.render('hospitalizaciones/404error',{
                        data_doc: data_user[token_id],
                        msg:"Algo paso con el servidor 3000",
                        error
                    })
                }) 
            }   
        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        })     
    }else{
        res.redirect('/')
    }
    
})

router.get('/one_epicrisis/:id_internacion', (req,res) => {
    const { id_internacion } = req.params;
    fetch('http://localhost:3000/api/one_epicrisis/'+id_internacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 
})

router.post('/Vue_reg_epicrisis/:id_paciente', (req,res) => {
    const { id_paciente } = req.params;
    console.log(id_paciente)
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/epicrisis/'+id_paciente,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data)
    })
})

//ruta para poder actulziar epicrisis con vue
router.post('/update_epicrisis/:id' , (req,res) => {
    const { id } = req.params;
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/update_epicrisis/'+id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data)
    })
})

router.post('/vue_update_estado_alta/:id_internacion', (req,res) => {
    const { id_internacion } = req.params
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/update_estado_alta/'+id_internacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        console.log (data, " esto es el estado alta")
        res.status(200).json(data)
    })
})

router.post('/vue_update_cama_estado/:id_cama', (req,res) => {
    const { id_cama } = req.params
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/updateCama_estado/'+id_cama,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        console.log(data, " esto es el estado cama")
        res.status(200).json(data)
    })
})


/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                rutas para orden de intervencion con vue
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
router.post('/Vue_regOrden_Intervencion/:id_internacion' , (req,res) => {
    const { id_internacion } = req.params;
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/reg_ordenIntervencion/'+id_internacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        console.log(data);
        res.status(200).json(data)
    })
})

//ruta para poder traer la lista de intervenciones del paciente 
router.get('/Vue_list_ord_intervencion/:id_internacion', (req,res) => {
    const { id_internacion } = req.params;
    fetch('http://localhost:3000/api/List_Orden_intenrvencion/'+id_internacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 
})

//ruta para poder sacar una orden de intervencion 
router.get('/vueOne_ordintervencion/:id', (req,res) => {
    const { id } = req.params;
    fetch('http://localhost:3000/api/One_Orden_intenrvencion/'+id)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 
})

//esta ruta es para poder insertar en nota de evolucion
router.post('/Vue_regNotaEvolucion/:id_internacion', (req,res) => {
    const { id_internacion } = req.params;
    var data  = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/reg_notaEvolucion/'+id_internacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data)
    })

})

router.get('/vue_listEvolucion/:id_internacion', (req,res) => {
    const { id_internacion } = req.params;
    fetch('http://localhost:3000/api/list_notaEvolucion/'+id_internacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 

})

router.get('/vue_one_notaEvolucion/:id_nota', (req,res) => {
    const { id_nota } = req.params;
    fetch('http://localhost:3000/api/one_notaEvolucion/'+id_nota)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 
})


/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            Ruta para poder insertar en diagnostico
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.post('/Vue_reg_diagnostico/:id_internacion', (req,res) => {
    const { id_internacion } = req.params;
    var data  = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/reg_diagTratameinto/'+id_internacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data)
    })
})

router.get('/Vue_list_diagnostico/:id_internacion' , (req,res) => {
    const { id_internacion } = req.params; 
    fetch('http://localhost:3000/api/list_DiagnosticoTratameinto/'+id_internacion)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 
})

router.get('/Vue_oneTratamiento/:id', (req,res) => {
    const { id } = req.params;
    fetch('http://localhost:3000/api/One_DiagTratamiento/'+id)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
       res.status(200).json(data);      
    }) 
})

//prueba
router.get('/alergiasvis', (req,res) => {
    res.render('hospitalizaciones/alergias')
});


/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            ruta para traslados del paciente
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
router.get('/traslado_interno/:id_internacion/:token_id',(req,res) =>{
    var one_traslado
    const { id_internacion,token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/One_intern/'+id_internacion)
        .then(res => res.json())
        .then(one_internacion => { 
            console.log(one_internacion, "   <<<<<<<<<<<<<    22222  <<<<<<<<<<<<<<<<<<")
            fetch('http://localhost:3000/api/onlyPaciente/'+one_internacion[0].historial)
            .then(res => res.json())
            .then(data_paciente => {

                fetch('http://localhost:4600/api/especialidad')
                .then(resp => resp.json())
                .then(especialidad =>{
                    res.render('hospitalizaciones/traslados',{
                        data_doc: data_user[token_id],
                        data_paciente,
                        one_internacion,
                        especialidad,
                        one_traslado
                    })
                })
                .catch(error => {
                    res.render('hospitalizaciones/404error',{
                        data_doc: data_user[token_id],
                        msg:"Algo paso con el servidor 4600",
                        error
                    })
                }) 

               
            })
            .catch(error => {
                res.render('hospitalizaciones/404error',{
                    data_doc: data_user[token_id],
                    msg:"Algo paso con el servidor 3000",
                    error
                })
            }) 
        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        }) 
    }else{
        res.redirect('/')
    }
    
});


// ruta traslado interno 2 
router.get('/traslado_interno2/:id_internacion/:token_id',(req,res) =>{
    const { id_internacion,token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/One_intern/'+id_internacion)
        .then(res => res.json())
        .then(one_internacion => { 
            console.log(one_internacion, "   <<<<<<<<<<<<<    22222  <<<<<<<<<<<<<<<<<<")
            fetch('http://localhost:3000/api/onlyPaciente/'+one_internacion[0].historial)
            .then(res => res.json())
            .then(data_paciente => {

                fetch('http://localhost:4600/api/especialidad')
                .then(resp => resp.json())
                .then(especialidad =>{    

                    fetch('http://localhost:3000/api/one_traslado/'+one_internacion[0].id_traslado)
                    .then(resp => resp.json())
                    .then(one_traslado =>{
                        res.render('hospitalizaciones/traslados',{
                            data_doc: data_user[token_id],
                            data_paciente,
                            one_internacion,
                            especialidad,
                            one_traslado
                        })
                    })

                   
                })
                .catch(error => {
                    res.render('hospitalizaciones/404error',{
                        data_doc: data_user[token_id],
                        msg:"Algo paso con el servidor 4600",
                        error
                    })
                }) 

               
            })
            .catch(error => {
                res.render('hospitalizaciones/404error',{
                    data_doc: data_user[token_id],
                    msg:"Algo paso con el servidor 3000",
                    error
                })
            }) 
        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        }) 
    }else{
        res.redirect('/')
    }
    
});

router.post('/vue_register_traslado/:id_paleta_internacion', (req,res) => {
    const { id_paleta_internacion } = req.params
    var data  = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/create_traslado/'+id_paleta_internacion,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
    
})

router.get('/vue_traslado_int/:id_internacion', (req,res) => {
    const { id_internacion } = req.params
    fetch('http://localhost:3000/api/traslados_id_internacion/'+id_internacion,)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

//para ver las especialidades
router.get('/vue_ver_especialidades', (req,res) => {
    fetch('http://localhost:4600/api/especialidad')
    .then(resp => resp.json())
    .then(especialidad =>{
        res.status(200).json(especialidad)
    })
})

router.get('/vue_ver_operaciones_internacion/:id_internacion', (req,res) => {
    const { id_internacion } = req.params
    
    fetch('http://localhost:3000/api/List_Orden_intenrvencion/'+ id_internacion)
    .then(resp => resp.json())
    .then(especialidad =>{
        res.status(200).json(especialidad)
        console.log(especialidad)
    })
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    lista de traslados
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

router.get('/lista_traslados/:id_especialidad/:token_id', (req,res) => {
    const { id_especialidad, token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/list_traslados_esp/'+ id_especialidad)
        .then(resp => resp.json())
        .then(traslados_true =>{
           
            fetch('http://localhost:3000/api/list_traslados_esp_flase/'+ id_especialidad)
            .then(resp => resp.json())
            .then(traslados_false =>{

                res.render('hospitalizaciones/lista_traslados',{
                    data_doc: data_user[token_id],
                    traslados_true,
                    traslados_false
                })
            })

        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        })
    }else{
        res.redirect('/')
    }
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                   Registrar internacion que proviene de traslado
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

router.get('/internacion_traslado/:id_traslado/:historial/:id_especialidad/:token_id', (req,res) => {
    const { id_traslado, historial, id_especialidad, token_id } = req.params;
    if( datas.name.token[token_id] ){
        fetch('http://localhost:3000/api/one_traslado/'+ id_traslado)
        .then(resp => resp.json())
        .then(one_traslado =>{
            
            
            fetch('http://localhost:3000/api/onlyPaciente/'+ historial)
            .then(resp => resp.json())
            .then(paciente_data =>{
            
                fetch(url.name.url+'/api/list_internacion_paciente/'+id_especialidad+"/"+historial) 
                .then(resp => resp.json())
                .then(paciente_internacion =>{ 
                    console.log(paciente_internacion, " <zxzxzx<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<zxczx  paciente_internacion  sdfsdf")
                    fetch(url.name.url+'/api/one_intern_of_traslado/'+id_traslado) 
                    .then(resp => resp.json())
                    .then(update =>{

                        res.render('hospitalizaciones/reg_traslado_internacion', {
                            data_doc: data_user[token_id],
                            msg:msg_Consulta_hospitalizacion[token_id],
                            one_traslado,
                            paciente_data,
                            paciente_internacion,
                            update,
                            data_post:traslado_post[token_id]
                        })
                    })
                    .catch(error => {
                        res.render('hospitalizaciones/404error',{
                            data_doc: data_user[token_id],
                            msg:"Algo paso con el servidor 3000",
                            error
                        })
                    })                   
                })
                .catch(error => {
                    res.render('hospitalizaciones/404error',{
                        data_doc: data_user[token_id],
                        msg:"Algo paso con el servidor 3000",
                        error
                    })
                })
            })
            .catch(error => {
                res.render('hospitalizaciones/404error',{
                    data_doc: data_user[token_id],
                    msg:"Algo paso con el servidor 3000",
                    error
                })
            })
        })
        .catch(error => {
            res.render('hospitalizaciones/404error',{
                data_doc: data_user[token_id],
                msg:"Algo paso con el servidor 3000",
                error
            })
        })
    }else{
        res.redirect('/')
    }
})


var traslado_post = {}
function post_msg(data,id){
  let storedItem = traslado_post[id];
    if (!storedItem) {
      storedItem = traslado_post[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_post () {
  let arr = [];
  for (const id in traslado_post) {
      arr.push(traslado_post[id]);
  }
  return arr;
}

function remove_post_msg(id) {
  delete traslado_post[id];
}

//ROUTA PARA INSERTAR
router.post('/internacion_of_traslado/:id_traslado/:id_especialidad/:token_id', (req,res) => {
    const { id_traslado,id_especialidad, token_id } = req.params;
    
    var msg_p
    var data_body = req.body
    if(data_body.cama == "" || data_body.cama == null){
        if(msg_Consulta_hospitalizacion[token_id] == null){
            msg_p = {
              success:false,
              data_p:"Selecione cama por favor"
            }
            msg_data(msg_p,token_id)
        }else{
            msg_p = {
              success:false,
              data_p:"Selecione cama por favor"
            }
            remove(token_id)
            msg_data(msg_p,token_id)
        }
        if(traslado_post[token_id] == null){
            post_msg(data_body,token_id)
        }else{
            remove_post_msg(token_id)
            post_msg(data_body,token_id)
        }

        res.redirect( '/internaciones/internacion_traslado/'+id_traslado+"/"+data_body.historial+"/"+id_especialidad+"/"+token_id );
    }else {
        var esto = {
            method: 'POST',
            body: JSON.stringify(data_body),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch('http://localhost:3000/api/Internacion_of_traslado/'+id_traslado+"/"+data_body.cama,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            
            if(data.success == true){
    
                if(msg_Consulta_hospitalizacion[token_id] == null){
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
    
                fetch(url.name.url+'/api/updateEstadoCama/'+data_body.cama+"/"+data_body.historial) 
                .then(resp => resp.json())
                .then(resp =>{
    
                    if(resp.success == true){
    
                        fetch(url.name.url+'/api/estado_traslado/'+id_traslado) 
                        .then(resp => resp.json())
                        .then(resp =>{
    
                            if(resp.success == true){
                                remove_post_msg(token_id)
                                res.redirect( '/internaciones/internacion_traslado/'+id_traslado+"/"+data_body.historial+"/"+id_especialidad+"/"+token_id );
                            }else{
                                if(msg_Consulta_hospitalizacion[token_id] == null){
                                    msg_p = {
                                      success:false,
                                      data_p:"error, no se actualizo el estado de este formulario"
                                    }
                                    msg_data(msg_p,token_id)
                                }else{
                                    msg_p = {
                                      success:false,
                                      data_p:"error, no se actualizo el estado de este formulario"
                                    }
                                    remove(token_id)
                                    msg_data(msg_p,token_id)
                                }
                            }
                        })
                        .catch(error => {
                            res.render('hospitalizaciones/500error',{
                                data_doc: data_user[token_id],
                                
                                error
                            })
                        }) 
                    }else{
                        if(msg_Consulta_hospitalizacion[token_id] == null){
                            msg_p = {
                              success:false,
                              data_p:"No se pude registrar al paciente en esa cama"
                            }
                            msg_data(msg_p,token_id)
                        }else{
                            msg_p = {
                              success:false,
                              data_p:"No se pude registrar al paciente en esa cama"
                            }
                            remove(token_id)
                            msg_data(msg_p,token_id)
                        }
                        res.redirect( '/internaciones/internacion_traslado/'+id_traslado+"/"+data_body.historial+"/"+id_especialidad+"/"+token_id );
                    }
    
                })
                .catch(error => {
                    res.render('hospitalizaciones/500error',{
                        data_doc: data_user[token_id],
                        
                        error
                    })
                }) 
            }else{
                if(msg_Consulta_hospitalizacion[token_id] == null){
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
                if(traslado_post[token_id] == null){
                    post_msg(data_body,token_id)
                }else{
                    remove_post_msg(token_id)
                    post_msg(data_body,token_id)
                }
                res.redirect( '/internaciones/internacion_traslado/'+id_traslado+"/"+data_body.historial+"/"+id_especialidad+"/"+token_id );
            }
            
        }) 
    }    
});

/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<
        Actualizar papeleta de internacion
>>>>>>><<<<<<<<<<>>>>>>>>>><<<<>>><>>><<>>><<>>><
<<<<<<<>><<<<><<<>><<<><<<>><<>>><<>>><<>>>><<<>>
*/

//esta ruta cambia el estado de la cama a false que es ocupado y ademas que añade al paciente
router.get('/estadoCama1/:idCama/:historial/:token_id/:id_traslado/:id_especialidad', (req,res) => {
    var data = req.params;
    fetch(url.name.url+'/api/updateEstadoCama/'+data.idCama+"/"+data.historial) 
    .then(resp => resp.json())
    .then(resp =>{
        console.log(resp, " estado 1")
        res.redirect( '/internaciones/internacion_traslado/'+data.id_traslado+"/"+data.historial+"/"+data.id_especialidad+"/"+data.token_id); 
    })        
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})

router.get('/update_estado_cama/:idCama/:newIDcama/:historial/:token_id/:id_traslado/:id_especialidad', (req,res) => {
    const { idCama, newIDcama, historial, token_id,id_traslado, id_especialidad} = req.params;
     var data = {
        estado: "true",
        historial: "0"
    }
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.url+'/api/updateCama_estado/'+idCama,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        console.log(data ," <<<< estado")
        res.redirect('/internaciones/estadoCama1/'+newIDcama+"/"+historial+'/'+token_id+'/'+id_traslado+"/"+id_especialidad);
    }) 
})

//router.get('/internacion_traslado/:id_traslado/:historial/:id_especialidad/:token_id', (req,res) => {

//ruta para poder actualizar form internacion
router.post('/update_Form_internacion1/:id/:id_especialidad/:id_cama/:token_id', (req,res) => {
    const { id,id_especialidad, id_cama,token_id } = req.params;
    var data_update = req.body;
    
     var msg_p
    var esto = {
        method: 'POST',
        body: JSON.stringify(data_update),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/update_form_internacion/'+id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        if (data.success == true){

            if(msg_Consulta_hospitalizacion[token_id] == null){
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
            
            res.redirect('/internaciones/update_estado_cama/'+id_cama+'/'+data_update.cama+'/'+ data_update.historial+'/'+token_id+'/'+data_update.id_traslado+"/"+id_especialidad)
            
            
        }else{

            if(msg_Consulta_hospitalizacion[token_id] == null){
                msg_p = {
                  success:false,
                  data_p:"No se pudo actualizar los datos"
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:false,
                  data_p:"No se pudo actualizar los datos"
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            }
            res.redirect( '/internaciones/internacion_traslado/'+data_update.id_traslado+"/"+data_update.historial+"/"+id_especialidad+"/"+token_id ); 
        }    
    }) 
})



module.exports = router;