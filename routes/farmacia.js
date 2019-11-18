const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');


router.get('/datas_array', (req,res) => {
  res.send({ 
    data_post_body, 
    one_medicamento ,
    msg_Consulta_emergencia
  })
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

//function mensage post segun usuario
var msg_Consulta_emergencia = {}
function msg_data(data,id){
  let msg_data = msg_Consulta_emergencia[id];
    if (!msg_data) {
        msg_data = msg_Consulta_emergencia[id] = {
        data: data,
        qty: 0
      };
    }
    msg_data.qty++;
}

function array321 () {
  let arr = [];
  for (const id in msg_Consulta_emergencia) {
      arr.push(msg_Consulta_emergencia[id]);
  }
  return arr;
}
function remove(id) {
    delete msg_Consulta_emergencia[id];
}

router.get('/home/:id/:token_part', (req,res) => {
    const { id,token_part } = req.params
    var data_token = {
      token_id: '',
      token_p: '',
      medico:''
    }
    fetch('http://localhost:3600/api/user/'+id)  // esto es para sacar el token del usuario
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      data_token.token_id = resp.id     // esto manda el el id para el token
      
        if(datas.name.token[resp.id] && datas.name.token[resp.id].data.token.split(" ")[1].split(".")[2] == token_part ){
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "farmacia"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
              data_token.token_p = token_part
                fetch('http://localhost:3600/api/personal/'+resp.perso_id)
                .then(resp => resp.json())
                .catch(error => console.error('Error',error))
                .then(resp => {
                  data_token.medico = resp 
                  if(data_user[data_token.token_id] == null){
                    user(data_token, data_token.token_id)
                    res.render('Farmacia/home',{
                        data_token
                    })
                  status = null
                  }else{
                    remove_user( data_token.token_id)
                    user(data_token, data_token.token_id)
                    res.render('Farmacia/home',{
                        data_token
                    })
                  status = null
                  }
                  
                })
            }else{
              res.redirect('/')
            }
        }else{
          res.redirect('/')
        }
        
    })
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                          rutas para medicamentos
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.get('/voler123/:token_id/:token_partial', (req,res) => {
  const {  token_id,token_partial } = req.params
  remove_medicamento_data(token_id)
  res.redirect('/farmacia/almacenamiento/' + token_id + '/' + token_partial)  
})

router.get('/almacenamiento/:token_id/:token_partial',(req, res) => {
    const { token_id,token_partial } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){

      fetch('http://localhost:3200/api/mostrar_medicamentos')
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(list_medicamentos => {
          
          fetch('http://localhost:3200/api/mostrar_grupos')
          .then(resp => resp.json())
          .catch(error => console.error('Error',error))
          .then(list_grupoAsig_Far => {

            res.render('Farmacia/almacenamiento',{
              data_doc : data_user[token_id], //esto contine los datos del usuario
              list_medicamentos,
              list_grupoAsig_Far,
              one_medicamento:one_medicamento[token_id],
              msg:msg_Consulta_emergencia[token_id],
              data_body_post: data_post_body[token_id]
            })
            remove_msg()
          })
         function remove_msg(){
           if(data_post_body[token_id] != ""){
            remove_data_body(token_id),{expiresIn: 10* 50}
            remove(token_id),{expiresIn: 10* 30}
           }
           if(msg_Consulta_emergencia[token_id].data.success == true){
            remove(token_id),{expiresIn: 10* 30}
           }
         }
      })
        
    }else{
        res.redirect('/')
    }
    
});

var one_medicamento = {}
function medicamento(data,id){
  let storedItem = one_medicamento[id];
    if (!storedItem) {
      storedItem = one_medicamento[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array123 () {
  let arr = [];
  for (const id in one_medicamento) {
      arr.push(one_medicamento[id]);
  }
  return arr;
}

function remove_medicamento_data(id) {
  delete one_medicamento[id];
}


//ruta para poder sacar un medicamento



router.get('/one_medicamento/:id_medicamento/:token_id/:token_partial', (req,res) => {
    const { id_medicamento, token_id,token_partial } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
        fetch('http://localhost:3200/api/one_medicamento/'+id_medicamento)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            if(one_medicamento[token_id] == null){
                medicamento(resp, token_id)
                res.redirect('/farmacia/almacenamiento/' + token_id + '/' + token_partial)      
              }else{
                remove_medicamento_data(token_id)
                medicamento(resp, token_id)
                res.redirect('/farmacia/almacenamiento/' + token_id + '/' + token_partial)
              }
            
        })
    }else{
        res.redirect('/')
    }

})



var data_post_body = {}
function body_post(data,id){
  let storedItem = data_post_body[id];
    if (!storedItem) {
      storedItem = data_post_body[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_body_post () {
  let arr = [];
  for (const id in data_post_body) {
      arr.push(data_post_body[id]);
  }
  return arr;
}

function remove_data_body(id) {
  delete data_post_body[id];
}

router.post('/registrar_medicamento/:token_id/:token_partial', (req,res) => {
  const { token_id, token_partial } = req.params
  var msg_p
  var datos = req.body
  var esto = {
      method: 'POST',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/reg_med',esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
      if(data.success == true){
          if(msg_Consulta_emergencia[token_id] == null){
              msg_p = {
                success:true,
                data_med:data.msg
              }
              msg_data(msg_p,token_id)
          }else{
              msg_p = {
                success:true,
                data_med:data.msg
              }
              remove(token_id)
              msg_data(msg_p,token_id)
          } 
          remove_data_body(token_id)
          res.redirect('/farmacia/almacenamiento/' + token_id + '/' + token_partial) 
      }else{
          if(msg_Consulta_emergencia[token_id] == null){
              msg_p = {
                success:false,
                data_med:data.msg
              }
              msg_data(msg_p,token_id)
          }else{
              msg_p = {
                success:false,
                data_med:data.msg
              }
              remove(token_id)
              msg_data(msg_p,token_id)
          }
          if(data_post_body[token_id] == null){
            body_post(datos, token_id);
          }else{
            remove_data_body(token_id)
            body_post(datos, token_id);
          }
          res.redirect('/farmacia/almacenamiento/' + token_id + '/' + token_partial) 
      }   
  })
})

// ruta para poder actulizar medicamentos
router.post('/update_medicamento/:id_medicamento/:token_id/:token_partial', (req,res) => {
  const { id_medicamento, token_id, token_partial } = req.params
  var data = req.body;
  var msg_p;
  var esto = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/update_medicamento/'+id_medicamento,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    console.log(data)
    if(data.success == true){
      if(msg_Consulta_emergencia[token_id] == null){
        msg_p = {
          success:true,
          data_med:data.msg
        }
        msg_data(msg_p,token_id)
      }else{
        msg_p = {
          success:true,
          data_med:data.msg
        }
        remove(token_id)
        msg_data(msg_p,token_id)
         
      } 
      res.redirect('/farmacia/one_medicamento/'+id_medicamento+'/'+token_id+'/'+token_partial)
    }else{
      if(msg_Consulta_emergencia[token_id] == null){
        msg_p = {
          success:false,
          data_med:data.msg
        }
        msg_data(msg_p,token_id)
      }else{
        msg_p = {
          success:false,
          data_med:data.msg
        }
        remove(token_id)
        msg_data(msg_p,token_id)
        
      } 
      res.redirect('/farmacia/one_medicamento/'+id_medicamento+'/'+token_id+'/'+token_partial) 
    }
   
  })
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                      ruta para cantidad de medicamentos
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

router.get('/medicametos_cantidad/:id_medicamento/:token_id/:token_partial', (req,res) => {
  const { id_medicamento, token_id, token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    fetch('http://localhost:3200/api/one_fecha_medicamento/'+id_medicamento)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      res.render('Farmacia/cantidad_fecha', {
        resp,
        data_doc : data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
  
})



/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                          rutas para grupoAsig_Far
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

router.get('/volver/:token_id/:token_partial', (req,res) => {
    const { token_id,token_partial } = req.params
    remove_grupo_data(token_id)
    remove(token_id)
    res.redirect('/farmacia/grupoAsig_Far/'+token_id+'/'+token_partial)

})

router.get('/grupoAsig_Far/:token_id/:token_partial',(req, res) => {
    const { token_id,token_partial } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){

        fetch('http://localhost:3200/api/mostrar_grupos')
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(list_grupoAsig_Far => {
            res.render('Farmacia/grupoAsig_Far',{
                data_doc : data_user[token_id], //esto contine los datos del usuario
                list_grupoAsig_Far,
                msg:msg_Consulta_emergencia[token_id],
                one_grupo:one_grupo_designacion[token_id]
            })
        })
       
    }else{
        res.redirect('/')
    }
    
});

var one_grupo_designacion = {}
function grupo_designacion(data,id){
  let storedItem = one_grupo_designacion[id];
    if (!storedItem) {
      storedItem = one_grupo_designacion[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in one_grupo_designacion) {
      arr.push(one_grupo_designacion[id]);
  }
  return arr;
}

function remove_grupo_data(id) {
  delete one_grupo_designacion[id];
}


//ruta para poder sacar un grupo designacion

router.get('/one_grupo/:id_grupo/:token_id/:token_partial', (req,res) => {
  const { id_grupo, token_id,token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
      fetch('http://localhost:3200/api/one_grupo/'+id_grupo)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(resp => {
          if(one_grupo_designacion[token_id] == null){
              grupo_designacion(resp, token_id)
              res.redirect('/farmacia/grupoAsig_Far/' + token_id + '/' + token_partial)      
            }else{
              remove_grupo_data(token_id)
              grupo_designacion(resp, token_id)
              res.redirect('/farmacia/grupoAsig_Far/' + token_id + '/' + token_partial)
            }
          
      })
  }else{
      res.redirect('/')
  }

})

router.post('/registrar_grupo/:token_id/:token_partial', (req,res) => {
    const { token_id, token_partial } = req.params
    var msg_p
    var datos = req.body
    var esto = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3200/api/reg_grupoDesignacion',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        if(data.success == true){
            if(msg_Consulta_emergencia[token_id] == null){
                msg_p = {
                  success:true,
                  data:data.msg
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:true,
                  data:data.msg
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            } 
            res.redirect('/farmacia/grupoAsig_Far/'+token_id+'/'+token_partial) 
        }else{
            if(msg_Consulta_emergencia[token_id] == null){
                msg_p = {
                  success:false,
                  data:data.msg
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:false,
                  data:data.msg
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            }
            res.redirect('/farmacia/grupoAsig_Far/'+token_id+'/'+token_partial) 
        }   
    })
})


//ruta para poder actualizar grupo designacion
router.post('/update_grupo/:id_grupo/:token_id/:token_partial', (req,res) => {
    const { id_grupo, token_id, token_partial } = req.params
    var msg_p
    var datos = req.body
    var esto = {
        method: 'put',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3200/api/update_grupo/'+id_grupo,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        if(data.success == true){
            if(msg_Consulta_emergencia[token_id] == null){
                msg_p = {
                  success:true,
                  data:data.msg
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:true,
                  data:data.msg
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            } 
            res.redirect('/farmacia/one_grupo/'+id_grupo+'/'+token_id+'/'+token_partial) 
        }else{
            if(msg_Consulta_emergencia[token_id] == null){
                msg_p = {
                  success:false,
                  data:data.msg
                }
                msg_data(msg_p,token_id)
            }else{
                msg_p = {
                  success:false,
                  data:data.msg
                }
                remove(token_id)
                msg_data(msg_p,token_id)
            }
            res.redirect('/farmacia/one_grupo/'+id_grupo+'/'+token_id+'/'+token_partial) 
        }   
    })
})

router.get('/volver', (req,res) => {
    oneGrupoAsig = null
    res.redirect('/farmacia/almacenamiento'); 
})
  
/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                   Ruta para mostrar pedidos o movimientos
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/


// esta ruta es para mostrar la lista de pedidos
router.get('/solicitudes/:token_id/:token_partial',(req, res) => {
  const { token_id, token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){

    fetch('http://localhost:3200/api/list_pedidos')
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      res.render('Farmacia/solicitudes',{
        resp, // esto es la lista de los pedidos
        data_doc : data_user[token_id]
      })
    })
    
  }else{
    res.redirect('/')
  }
});

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                          vista aceptar pedido
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
router.get('/peido/:id_pedido/:token_id/:token_partial', (req,res) => {
  const { id_pedido,token_id,token_partial  } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    fetch('http://localhost:3200/api/one_pedido/'+id_pedido)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(resp => {
        res.render('Farmacia/farmcia_ver_pedidos', {
          resp,
          data_doc : data_user[token_id]
        })
      })
  }else{
    res.redirect('/')
  }
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                   Ruta para registrar pedidos o movimientos
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

//ruta para poder renderizar reg pedidos
router.get('/reg_solicitud/:token_id/:token_partial',(req, res) => {
  const { token_id, token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    res.render('Farmacia/reg_solicitud',{
      data_doc : data_user[token_id]
    })
  }else{
    res.redirect('/')
  }
    
});

/* 
    rutas para vue
*/
//ruta para poder mostrar la lista de medicamentos
router.get('/Vue_medicamentos_farmacia', (req,res) => {

  fetch('http://localhost:3200/api/fecha_list_cantidad')
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.status(200).json(resp)
  })

})

//ruta para pode ve un solo fecha cantidad
router.get('/vue_One_fecha_cantidad/:id_fecha', (req,res) => {
  const  { id_fecha } = req.params;
  fetch('http://localhost:3200/api/one_fecha/'+id_fecha)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.status(200).json(resp)
  })

})

// ruta para sacar un solo medicamentos
router.get('/vue_medicamento/:id_medicamento', (req,res) => {
  const { id_medicamento } = req.params
  fetch('http://localhost:3200/api/one_medicamento/'+id_medicamento)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.status(200).json(resp)
  })
})

//ruta para poder inser pedidos
router.post('/vue_post_pedidos', (req,res) => {  
  var datos = req.body
  var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/reg_pedido',esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    res.status(200).json(data)
  })
})


router.post('/update_pedido/:id_pedido', (req,res) =>{
  const { id_pedido } = req.params
  var datos = req.body
  console.log(datos, " <<<<<<<<<<<<<<<<")
  var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/update_peidodo_farmacia/'+id_pedido,esto)
  .then(res => res.json())  
  .then(data => {
    res.status(200).json(data)
  })
  .catch(error => {
    res.status(500).json({
      success:false,
      msg:"Error de servidor",
      error
    })
  })
})

//esta ruta es para insertar a la tabla cantidad fecha
router.post('/register_cantidad_fecha/:id_medicamento', (req,res) => {
  const { id_medicamento } = req.params   
  var datos = req.body
  console.log(datos, " <<<<<<<<<<<<<<<<")
  var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/cerateFecha_Cantidad/'+id_medicamento,esto)
  .then(res => res.json())  
  .then(data => {
    res.status(200).json(data)
  })
  .catch(error => {
    res.status(500).json({
      success:false,
      msg:"Error de servidor",
      error
    })
  })
})

//sumar cantidad
router.post('/sumar_cantidad/:id_medicamento', (req,res) => {
  const { id_medicamento } = req.params
  var datos = req.body
  console.log(datos, " <<<<<<<<<<<<<<<<")
  var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/sumar_cantidad/' + id_medicamento,esto)
  .then(res => res.json())  
  .then(data => {
    res.status(200).json(data)
  })
  .catch(error => {
    res.status(500).json({
      success:false,
      msg:"Error de servidor",
      error
    })
  })
  
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                   ruta para recetas de pacientes
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.get('/volver3', (req,res) => {
    oneGrupoAsig = null
    res.redirect('/Farmacia/solicitudes'); 
})
  


router.get('/recetas_farm/:token_id/:token_partial',(req, res) => {
  const { token_id, token_partial } = req.params;
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){

    fetch('http://localhost:3000/api/reg_Receta')
    .then(resp => resp.json())
    .then(resp => {
      res.render('Farmacia/recetas_farm',{
        resp,
        data_doc : data_user[token_id]
      })
    })
    .catch(error => {
      res.render('Farmacia/404error',{
        msg404 : "No hay coneccion con la base de datos docker postgres",
        data_doc : data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
    
});

//ruta para renderizar reg receta

router.get('/reg_receta/:id_receta/:token_id/:token_partial',(req, res) => {
  const { id_receta, token_id, token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    fetch('http://localhost:3000/api/one_receta/'+id_receta)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(data_receta => {
      
      fetch('http://localhost:3000/api/onlyPaciente/'+data_receta[0].historiaClinica)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(one_paciente => {
        res.render('Farmacia/reg_receta',{
          data_receta,
          data_doc : data_user[token_id],
          one_paciente
        })
      })

    })
    
  }else{
    res.redirect('/')
  }
    
});

router.get('/vue_one_receta/:id_receta', (req,res) => {
  const { id_receta } = req.params
  fetch('http://localhost:3000/api/one_receta/'+id_receta)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(data => {
      res.status(200).json(data)
  })
})

router.get('/Vue_one_medicamento_fecha/:id_medicamento',  (req,res) => {
  const { id_medicamento } = req.params;
  fetch('http://localhost:3200/api/one_medicamento_fecha/'+id_medicamento)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(data => {
      res.status(200).json(data)
  })
})

router.post('/vue_reg_receta_paciente', (req,res) => {
  var datos = req.body
  var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/reg_receta_paciente',esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    res.status(200).json(data)
  })
})

//ruta para actualizar cantidad de producto
router.post('/vue_update_cantidad/:id_medicamento', (req,res) => {
  const { id_medicamento } = req.params
  var datos = req.body
  var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3200/api/update_cantidad/'+id_medicamento,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    res.status(200).json(data)
  })
})




  router.get('/volver2', (req,res) => {
    oneGrupoAsig = null
    res.redirect('/farmacia/recetas_farm'); 
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        Rutas para ventas
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
router.get('/ventas/:token_id/:token_partial',(req, res) => {
  const { token_id, token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    fetch('http://localhost:3200/api/list_clients')
    .then(res => res.json())
    .then(clientes => {
      res.render('Farmacia/ventas',{
        data_doc : data_user[token_id],
        clientes,
        msg:msg_Consulta_emergencia[token_id],
      })
    })
    .catch(error => {
      res.render('Farmacia/404error',{
        msg404 : "No hay coneccion con la base de datos docker postgres",
        data_doc : data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
});

router.post('/reg_cliente/:token_id/:token_partial', (req,res) => {
  const { token_id, token_partial } = req.params
  var datos = req.body
  /* res.send(datos) */
  var msg_p;
   var esto = {
    method: 'post',
    body: JSON.stringify(datos),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:3200/api/create_cliente',esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    if(data.success == true){
      res.redirect('/farmacia/reg_venta/'+data.data.id+'/'+token_id+'/'+token_partial)
      console.log(data, " <<<<<<csxcs<< esto es la respuesta que quiero ver <<<<<<<<<<<<<<< ")
    }else{
      if(msg_Consulta_emergencia[token_id] == null){
        msg_p = {
          success:false,
          data_cliente:data.msg
        }
        msg_data(msg_p,token_id)
    }else{
        msg_p = {
          success:false,
          data_cliente:data.msg
        }
        remove(token_id)
        msg_data(msg_p,token_id)
    }
    res.redirect('/farmacia/ventas/'+token_id+'/'+token_partial) 
      
    }
   
  })
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// rutas para registrar venta de clientes 
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

router.get('/reg_venta/:id_cliente/:token_id/:token_partial',(req, res) => {
  const { id_cliente, token_id, token_partial } = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    fetch('http://localhost:3200/api/one_client/'+id_cliente)
    .then(res => res.json())
    .then(one_cliente => {
      res.render('Farmacia/reg_venta',{
        one_cliente,
        data_doc : data_user[token_id],
      })
    })
    .catch(error => {
      res.render('Farmacia/404error',{
        msg404 : "No hay coneccion con la base de datos docker postgres",
        data_doc : data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
  
});


//ruta vue para registrar ventas
router.post('/register_venta_cliente/:id_cliente',(req,res) => {
  const { id_cliente } = req.params
  var datos = req.body
   var esto = {
    method: 'post',
    body: JSON.stringify(datos),
    headers:{
      'Content-type' : "application/json"
    }
  };
  fetch('http://localhost:3200/api/create_receta_cliente/'+id_cliente,esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    res.status(200).json(data)
  })
})


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//ruta para stock farmacia

router.get('/Stock_far/:token_id/:token_partial', (req,res) => {
  const {token_id, token_partial} = req.params
  if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
    fetch('http://localhost:3200/api/list_med')
    .then(resp => resp.json())
    .then(list_medicamentos => {
      res.render('Farmacia/Stock_far',{
        list_medicamentos,
        data_doc : data_user[token_id]
      });
    })
    .catch(error => {
      res.render('Farmacia/404error',{
        msg404 : "No hay coneccion con la base de datos docker postgres",
        data_doc : data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
});

  router.get('/volver1', (req,res) => {
    oneGrupoAsig = null
    res.redirect('/farmacia/ventas'); 
})
  
  router.get('/reportes_facturacion',(req, res) => {
    res.render('Farmacia/reportes_facturacion')
  });
router.get('/kardexValorizado', (req,res) => {
    res.render('Farmacia/kardexValorizado');
});
router.get('/reportes_cajas', (req,res) => {
    res.render('Farmacia/reportes_cajas');
});

router.get('/reportes_recetas', (req,res) => {
    res.render('Farmacia/reportes_recetas');
});
router.get('/med_ven', (req,res) => {
    res.render('Farmacia/med_ven');
});
router.get('/reportes_solicitudes', (req,res) => {
    res.render('Farmacia/reportes_solicitudes');
});
router.get('/reportes_ventas', (req,res) => {
    res.render('Farmacia/reportes_ventas');
});







module.exports = router;