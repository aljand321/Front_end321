const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          rutas vue
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.get('/roles/:id', (req,res) => {
  const { id } = req.params
  fetch('http://127.0.0.1:3600/api/oneMOstrar/'+id)
        .then(resp => resp.json())
        .then(resp =>{
          console.log(resp)
          res.status(200).json(resp)
     });
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
        estas funciones es para poder mandar los mesajes que manda los post
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
 */

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

function array () {
  let arr = [];
  for (const id in msg_Consulta_emergencia) {
      arr.push(msg_Consulta_emergencia[id]);
  }
  return arr;
}
function remove(id) {
    delete msg_Consulta_emergencia[id];
}

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
router.get('/quitar/:token_id', (req,res) => {
  const { token_id } = req.params
  remove_one_user(token_id)
  res.redirect('/usuarios/usuarios/'+token_id);
})
router.get('/quitar2', (req,res) => {
  sms2 = null;
  res.redirect('/usuarios/usuarios');
})
router.get('/quitar3/:token_id', (req,res) => {
  remove(token_id)
  remove_post(token_id)
  const { token_id } = req.params  

  res.redirect('/usuarios/usuarios/'+token_id);
})
router.get('/quitar4/:id/:token_id', (req,res) => {
  const { id,token_id } = req.params
  remove(token_id)
  remove_post(token_id)
  res.redirect('/usuarios/UsuraioCuenta/'+id+'/'+token_id);
})

// esta ruta es para poder renderizar la vista de registro de usuarios
router.get('/usuarios/:token_id',(req, res) => {
  const { token_id } = req.params
  if( datas.name.token[token_id] ){
    var esto = {
      method: 'GET',
      headers:{
        'Content-type' : "application/json",
        /*'Authorization': datas.name.token*/
      }
    }
      fetch('http://localhost:3600/api/personal/',esto)
          .then(resp => resp.json())
          .then(resp =>{
          res.render('usuarios',{
            resp, 
            onlyUSer:update_user[token_id],
            data_doc:datas.name.data_user[token_id],
            msg:msg_Consulta_emergencia[token_id]
          });
          setTimeout(()=>{
            remove(token_id)
          },1000);
       })
       .catch(error => {       
        console.error('Error:', error)
        res.render('404error',{
          msg:"No hay conección con el sevidor 3600",
          //data_doc:datas.name.data_user[token_id],
        })
      })
  }else{
    res.redirect('/')
  }
});

// esta funcion es para poder mandar un usrio para que sea actualizado mediante usario
var update_user = {}
function one_user(data,id){
  let storedItem = update_user[id];
    if (!storedItem) {
      storedItem = update_user[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array1 () {
  let arr = [];
  for (const id in update_user) {
      arr.push(update_user[id]);
  }
  return arr;
}

function remove_one_user(id) {
  delete update_user[id];
}

// esta ruta es para poder sacar un usuario para que pueda ser actualizado
router.get('/usuarios/:id/:token_id',(req, res) => {
  const { id, token_id } = req.params
  if( datas.name.token[token_id] ){
    fetch('http://127.0.0.1:3600/api/personal/'+id)
    .then(resp => resp.json())
    .then(resp =>{
      if(update_user[token_id] == null){
        one_user(resp, token_id)
        res.redirect('/usuarios/usuarios/'+token_id)  
      }else{
        remove_one_user(token_id)
        one_user(resp, token_id)
        res.redirect('/usuarios/usuarios/'+token_id)
      }
    });
  }else{
    res.redirect('/');
  }
});

router.post('/usuarios/:token_id', (req,res) => {
  const { token_id } = req.params;
   var  msg_p;
    if( datas.name.token[token_id] ){
      var telefono = req.body.telefono;
      if(telefono == ""){
        msg = "introdusca telefono";
        res.redirect('/');
      }
      else{
        var data = req.body;
        var esto = {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-type' : "application/json",
            //'Authorization': datas.name.token
          }
        };
        fetch('http://localhost:3600/api/personal',esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {
           console.log(data, "  <<<<<<<<<<<<<<< esto es post")
            if (data.success == true){
                //msm1=  data.message              

                if(msg_Consulta_emergencia[token_id] == null){
                  msg_p = {
                    success:true,
                    data_p:data.message
                  }
                  msg_data(msg_p,token_id)
                }else{
                  msg_p = {
                    success:true,
                    data_p:data.message
                  }
                  remove(token_id)
                  msg_data(msg_p,token_id)
                }
                res.redirect('/usuarios/usuarios/'+token_id)
            }else{
                //sms2=data.message        
                if(msg_Consulta_emergencia[token_id] == null){
                  msg_p = {
                    success:false,
                    data_p:data.message
                  }
                  msg_data(msg_p,token_id)
                }else{
                  msg_p = {
                    success:false,
                    data_p:data.message
                  }
                  remove(token_id)
                  msg_data(msg_p,token_id)
                }
                res.redirect('/usuarios/usuarios/'+token_id);
            }

         
          
        })
      }
    }else{
      res.redirect('/');
    }
      
});
  
router.get('/usuario/:id',(req, res) => {
  var id = req.params;
  fetch('http://127.0.0.1:3600/personal/OnlyPersonal/'+id.id)
      .then(resp => resp.json())
      .then(resp =>{
      res.render('usuarioUpdate',{
        resp
      });
   });
});

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                      //servicio para actualizar personal
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
router.post('/updatePersonal/:id/:token_id',(req,res) => {
  const { id,token_id } = req.params
  if( datas.name.token[token_id] ){
    var msg_p
    var data = req.body;
    var enviar = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type' : "application/json"
      }
    }
    fetch('http://localhost:3600/api/UpdaPersonal/'+id,enviar)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      if(resp.success==false){
        if(msg_Consulta_emergencia[token_id] == null){
          msg_p = {
            success:false,
            data_p:"Error al actualizar"
          }
          msg_data(msg_p,token_id)
        }else{
          msg_p = {
            success:false,
            data_p:"Error al actualizar"
          }
          remove(token_id)
          msg_data(msg_p,token_id)
        }
        res.redirect('/usuarios/usuarios/'+id+'/'+token_id);
      }else{
        if(msg_Consulta_emergencia[token_id] == null){
          msg_p = {
            success:true,
            data_p:data.message
          }
          msg_data(msg_p,token_id)
        }else{
          msg_p = {
            success:true,
            data_p:data.message
          }
          remove(token_id)
          msg_data(msg_p,token_id)
        }
        res.redirect('/usuarios/usuarios/'+id+'/'+token_id);
      }
    })
  }else{
    res.redirect('/')
  }
});

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  esta ruta es para poder renderizar la vista de creacion de cuentas del usuario
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

router.get('/UsuraioCuenta/:id/:token_id', (req,res) => {
  const { id, token_id } = req.params 
  if( datas.name.token[token_id] ){ 
    fetch('http://127.0.0.1:3600/api/mostrarCuenta/'+id)
    .then(resp => resp.json())
    .then(resp =>{
      //console.log(resp)
      fetch('http://localhost:3600/api/roleall/')
      .then(resp => resp.json())
      .then(list_role =>{   

        res.render('usuarioCuenta',{
          id,
          resp,
          list_role,     
          data_doc:datas.name.data_user[token_id],     
          msg1:msg_Consulta_emergencia[token_id],
          data: data_post[token_id], // esto es la respuesta del body
          
        });
        setTimeout(()=>{
          remove(token_id)
        },1000);
      
      })
      .catch( error => {
        res.render('404error',{
          data_doc:datas.name.data_user[token_id],
          msg:"No hay conecion con el servidor 3600",
          error
        })
      })

      
    })
    .catch( error => {
      res.render('404error',{
        data_doc:datas.name.data_user[token_id],
        msg:"No hay conecion con el servidor 3600",
        error
      })
    })
  }else{
    res.redirect('/');
  }
  
});

//esta funcion es para mandar el data del post de forma dicamica para cada usuario
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

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    ruta para poder crear la tuenta del usuario
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
router.post('/crearCuenta/:id/:token_id', (req,res) => {
  const { id, token_id } = req.params
  if( datas.name.token[token_id] ){ 
    var  msg_p;    
    var datos = req.body
    var enviar = {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: {
        'Content-type' : "application/json"
      }
    }
    fetch('http://127.0.0.1:3600/api/UsuraioCuenta/'+id,enviar)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      //console.log(resp, "    <<<<<<<<<<<<<<<<<<<<  esto es la respuesta")
      if (resp.success == false){         
        
        if(msg_Consulta_emergencia[token_id] == null){
          msg_p = {
            success:false,
            data_p1:resp.msg
          }
          msg_data(msg_p,token_id)
        }else{
          msg_p = {
            success:false,
            data_p1:resp.msg
          }
          remove(token_id)
          msg_data(msg_p,token_id)
        }
        if(data_post[token_id] == null){
          data_p(datos,token_id)
        }else{
          remove_post(token_id)
          data_p(datos,token_id)
        }
        setTimeout(()=>{
          remove_post(token_id)
        },15000);
        res.redirect('/usuarios/UsuraioCuenta/'+id+'/'+token_id)
      }else{
        if(msg_Consulta_emergencia[token_id] == null){
          msg_p = {
            success:true,
            data_p1:resp.message
          }
          msg_data(msg_p,token_id)
        }else{
          msg_p = {
            success:true,
            data_p1:resp.message
          }
          remove(token_id)
          msg_data(msg_p,token_id)
        }
        remove_post(token_id)
        res.redirect('/usuarios/UsuraioCuenta/'+id+'/'+token_id)
      }

    })
  }else{
    res.redirect('/')
  }
});


/////****cerrar secion */
router.get('/secionout',(req,res) => {
  res.render('index', { msg1, msg2, msg3 })
})

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                             Reportes personal
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
router.get('/volver', (req,res) => {
  all = null;
  res.redirect('/usuarios/roles');
})

router.get('/roles1/:token_id',(req, res) => {
  const { token_id } = req.params
  if( datas.name.token[token_id] ){ 
    fetch('http://localhost:3600/api/personal')        
    .then(resp => resp.json())
    .then(data =>{  

      fetch('http://localhost:3600/api/allUser')        
      .then(resp => resp.json())
      .then(allusers =>{ 
        res.render('roles', {
          data,
          data_doc:datas.name.data_user[token_id],
          allusers,
          filter: filter_ventas[token_id],
          msg:msg_Consulta_emergencia[token_id],
        })
      })
    
    })
    .catch(error => {
      console.error('Error:', error)
      res.render('404error',{
        msg:"No hay conección con el sevidor"
      });
    })
  }else{
    res.redirect('/')
  }
});

var filter_ventas = {}
function filter_cliente_ventas(data,id){
  let storedItem = filter_ventas[id];
    if (!storedItem) {
      storedItem = filter_ventas[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_filter_data2 () {
  let arr = [];
  for (const id in filter_ventas) {
      arr.push(filter_ventas[id]);
  }
  return arr;
}

function remove_filter_data2(id) {
  delete filter_ventas[id];
}

router.post ('/vue_filter_datas', (req,res) => {
  var datos = req.body;  
     var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
    };
    fetch('http://localhost:3600/api/filter_list',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
      res.status(200).json(data)
    })
})
router.post ('/vue_filter_datas1', (req,res) => {
  var datos = req.body;  
     var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
    };
    fetch('http://localhost:3600/api/filter_users',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
      res.status(200).json(data)
    })
})


///filter datas
router.post('/filter_datas/:token_id', (req,res) => {
  const { token_id } = req.params;
  var datos = req.body;  
  if(datas.name.token[token_id]){
    var msg_p;
     var esto = {
      method: 'post',
      body: JSON.stringify(datos),
      headers:{
        'Content-type' : "application/json"
      }
    };
    fetch('http://localhost:3600/api/filter_list',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
      if(data.success == false){
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
          remove_filter_data2(token_id)
          setTimeout(()=>{
            remove(token_id)
          },1000);   
          res.redirect('/usuarios/roles1/'+token_id)
        }else{
          if(filter_ventas[token_id] == null){
            msg_p = {
              success:false,
              data_cliente:data
            }
            filter_cliente_ventas(msg_p,token_id)
          }else{
            msg_p = {
              success:false,
              data_cliente:data
            }
            remove_filter_data2(token_id)
            filter_cliente_ventas(msg_p,token_id)
          }
          res.redirect('/usuarios/roles1/'+token_id)
      }
    })
  }else{
    res.redirect('/');
  }
     
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<
router.get('/cuentas/:id/:token_id', (req,res) => {
  const { id,token_id } = req.params
  if( datas.name.token[token_id] ){ 
    fetch('http://127.0.0.1:3600/api/allrol/'+id)
    .then(resp => resp.json())
    .then(data =>{ 

      fetch('http://127.0.0.1:3600/api/personal/'+id)
      .then(resp => resp.json())
      .then(one_person =>{ 

        res.render('reporAdmin/detallimpre',{
          data,
          data_doc:datas.name.data_user[token_id],
          one_person
        })

      })
     
    })
  }else{
    res.redirect('/')
  }
  
})


router.get('/onlymedico/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){ 

    fetch('http://localhost:3600/api/Only_Medicos')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriA', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })

  }else{
    res.redirect('/')
  }
})
router.get('/onlyfarma/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){ 
    fetch('http://localhost:3600/api/OnlyFarma')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriA', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
})
router.get('/allreg/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){ 

    fetch('http://localhost:3600/api/personal')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriRol', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
})

router.get('/onlyenferme/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){
    fetch('http://localhost:3600/api/OnlyEnfermera')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriA', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  } 
})
router.get('/allcuentas/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){
    fetch('http://localhost:3600/api/allUser')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriusers', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
})
router.get('/allroles/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){
    fetch('http://localhost:3600/api/roleall')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriRol', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
})
///**vue personal */
router.get('/vue_personal', (req,res) => {

  fetch('http://localhost:3600/api/personal')
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    res.status(200).json(data)
  })
})
router.get('/vue_alluser', (req,res) => {

  fetch('http://localhost:3600/api/allUser')
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
    res.status(200).json(data)
  })
})
////** */

module.exports = router;