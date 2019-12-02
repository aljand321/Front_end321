const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');
import { user_data1, remove_user12 } from './url/export';

router.get('/mostrar_dataUser', (req,res) => {
    res.send(data_user)
})

//esta funcion es para el data user


router.get('/imprimir/:id_pedido/:token_id/:token_part', (req,res) => {
    const { id_pedido, token_id, token_part} = req.params;
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){

        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            } 
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/OnlyPedido/'+id_pedido)   
                .then(resp => resp.json())
                .then(resp =>{ 
                    console.log(resp , " esto es lo que quiero ver asdaskjsd  <<<<<<<<<<<<<<<<<<<<<<<<<<zz")       
                    res.render('Almacen/imprimir',{
                        resp,
                        data_doc: data_user[token_id],
                    });
                })
                .catch(error => {
                    res.render('Almacen/404error',{
                        msg:"No hay cneccion con el sevidor de almacen"
                    })
                    
                }) 
                status = null
            }else{
                res.redirect('/')
            }
        })
    }else{
        res.redirect('/')
    }
    
});

router.get('/distri_imprimir/:id_distribucion/:token_id/:token_part', (req,res) => {
    const { id_distribucion, token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            } 
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/onlyDist/'+id_distribucion)
                .then(res => res.json())
                .then(data => { 
                    res.render('Almacen/distri_imprimir',{
                        data,
                        data_doc: data_user[token_id]
                    });
                })
                .catch(error => {
                    res.render('Almacen/404error',{
                        msg:"No hay cneccion con el sevidor de almacen"
                    })
        
                }) 
                status = null
            }else{
                res.redirect('/')
            }
        });
        
    }else{
        res.redirect('/');
    }
});
router.get('/volver12/:id/:token_id/:token_part', (req,res) => {
    const { id, token_id, token_part } = req.params
    res.redirect('/almacen/imprimir/'+id+'/'+token_id+'/'+token_part); 
})
router.get('/volver13/:id_dis/:token_id/:token_part', (req,res) => {
    const { id_dis, token_id, token_part } = req.params
    res.redirect('/almacen/distri_imprimir/'+id_dis+'/'+token_id+'/'+token_part); 
})
router.post('/loginAlmacen',(req,res) => {
    var data = req.body
    res.status(200).json(data)
})

router.get('/volver', (req,res) => {
    res.redirect('/almacen/pedidos'); 
})

router.get('/volver23', (req,res) => {
    res.redirect('/almacen/farmacia_pedidos'); 
})

router.get('/pedidos/:token_id/:token_part',(req, res) => {
    const { token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){

        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/pedido')   
                .then(resp => resp.json())
                .then(resp =>{          
                    res.render('Almacen/pedidos',{            
                        resp,
                        data_doc: data_user[token_id],
                    })
                })
                .catch(error => {
                    console.error('Error:', error)
                    res.send("no hay coneccion con el servidor");
                })
                status = null
            }else{
                res.redirect('/')
            } 
        })
        
    }else{
        res.redirect('/');
    }
});
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


// funcion para almacenar los datos del user
var data_user = {}
function user(data,id){
    console.log(data, id , "  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
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

router.get('/home/:id/:token_part', (req,res) => {
    const { id, token_part } = req.params
    console.log(token_part)
    var data_token = {
        token_id: {},
        token_part:{},
        personal:{},        
    }
    
    fetch('http://localhost:3600/api/user/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
       
        if(datas.name.token[resp.id] && datas.name.token[resp.id].data.token.split(" ")[1].split(".")[2] == token_part){
            data_token.token_id = resp.id 
            data_token.token_part = token_part
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
                fetch('http://localhost:3600/api/personal/'+resp.perso_id)
                .then(resp => resp.json())
                .catch(error => console.error('Error',error))
                .then(personal => {
                    data_token.personal = personal 
                    

                    if(data_user[data_token.token_id] == null){

                        user(data_token, data_token.token_id)
                        user_data1(data_token, data_token.token_id)
                        
                        fetch('http://localhost:3500/api/medicamento')
                        .then(resp => resp.json())
                        .then(medi =>{
                            fetch('http://localhost:3500/api/proveedor')
                            .then(resp => resp.json())
                            .then(pro =>{
                                fetch('http://localhost:3500/api/proveedor')
                                .then(resp => resp.json())
                                .then(pedi =>{
                                    res.render('Almacen/home',{
                                        resp,
                                        logs:medi.length,
                                        logs1:pro.length,
                                        logs2:pedi.length,
                                        data_token,
                                        token:{
                                            success: datas.name.token[resp.id].data.success,
                                            token:datas.name.token[resp.id].data.token,
                                            token_part,
                                            user:{
                                                id: datas.name.token[resp.id].data.user.id,
                                                perso_id: datas.name.token[resp.id].data.user.perso_id,
                                                username: datas.name.token[resp.id].data.user.username,
                                                email:  datas.name.token[resp.id].data.user.email,
                                            } 
                                        },
                                        login:datas.name.session[resp.id]      
                                    })
                                })

                            })

                        })
                    

                        status = null
                    }else{
                        remove_user( data_token.token_id)
                        
                        user(data_token, data_token.token_id)
                        
                        remove_user12(data_token.token_id)
                        user_data1(data_token, data_token.token_id)

                        fetch('http://localhost:3500/api/medicamento')
                        .then(resp => resp.json())
                        .then(medi =>{
                            fetch('http://localhost:3500/api/proveedor')
                            .then(resp => resp.json())
                            .then(pro =>{
                                fetch('http://localhost:3500/api/proveedor')
                                .then(resp => resp.json())
                                .then(pedi =>{
                                    res.render('Almacen/home',{
                                        resp,
                                        logs:medi.length,
                                        logs1:pro.length,
                                        logs2:pedi.length,
                                        data_token,
                                        token:{
                                            success: datas.name.token[resp.id].data.success,
                                            token:datas.name.token[resp.id].data.token,
                                            token_part,
                                            user:{
                                                id: datas.name.token[resp.id].data.user.id,
                                                perso_id: datas.name.token[resp.id].data.user.perso_id,
                                                username: datas.name.token[resp.id].data.user.username,
                                                email:  datas.name.token[resp.id].data.user.email,
                                            } 
                                        },
                                        login:datas.name.session[resp.id]      
                                    })
                                })

                            })

                        })
                        status = null
                    }
                })
                setTimeout(()=>{
                    remove_session(resp.id)
                      function remove_session(id) {
                      delete datas.name.session[id]
                    }
                },5000);
            }else{
                res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
        
    })
});

router.get('/kardexValorizado/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            } 
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/medicamento')   
                .then(resp => resp.json())
                .then(resp =>{ 
                    console.log(resp)       
                    res.render('Almacen/kardexValorizado',{
                        resp,
                        data_doc: data_user[token_id]
                    });
                })
                status = null
            }else{
                res.redirect('/')
            }
        })
        
    }else{
        res.redirect('/');
    }
});
router.get('/med_ven/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params;
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/medicamento')   
                .then(resp => resp.json())
                .then(resp =>{ 

                    fetch('http://localhost:3500/api/medicamento')   
                    .then(resp => resp.json())
                    .then(grupo =>{ 
                        console.log(resp)       
                        res.render('Almacen/med_ven',{
                            resp,
                            data_doc: data_user[token_id],
                            grupo
                        });
                    })
                    
                })
                status = null
            }else{
                res.redirect('/');
            }
        })
        
    }else{
        res.redirect('/')
    }
});

router.post('/vue_filter_med_g', (req,res) => {
    var datos = req.body;   
      
    var esto = {
        method: 'post',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3500/api/filter_data_med_grupo',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z 
                                  /// reportes  de  pedidos filter fechas
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Z 
 */
router.get('/volver321/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params
    remove_filter_pedidos(token_id);
    res.redirect('/almacen/reportes_pedidos/'+token_id+'/'+token_part);
})

router.get('/reportes_pedidos/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/pedido')   
                .then(resp => resp.json())
                .then(resp =>{ 
                    
                    fetch('http://localhost:3500/api/proveedor')   
                    .then(resp => resp.json())
                    .then( proveedores =>{
                        res.render('Almacen/reportes_pedidos',{
                            resp,
                            data_doc: data_user[token_id],
                            filter: filter_pedidos[token_id],
                            msg:msg_Consulta_emergencia[token_id],
                            proveedores
                        });
                    })
                    
                })
                status = null;
            }else{
                res.redirect('/')
            }
        })
        
    }else{
        res.redirect('/')
    }
});

var filter_pedidos = {}
function filter_pedidos_data(data,id){
  let storedItem = filter_pedidos[id];
    if (!storedItem) {
      storedItem = filter_pedidos[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_filter_pedios () {
  let arr = [];
  for (const id in filter_pedidos) {
      arr.push(filter_pedidos[id]);
  }
  return arr;
}

function remove_filter_pedidos(id) {
  delete filter_pedidos[id];
}

router.post('/filter_pedios_datas/:token_id/:token_partial', (req,res) => {
    const { token_id, token_partial } = req.params;
    var datos = req.body;  
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_partial){
      var msg_p;
       var esto = {
        method: 'post',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
      };
      fetch('http://localhost:3500/api/filter_pedidos_fecha',esto)
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
            remove_filter_pedidos(token_id)
            setTimeout(()=>{
              remove(token_id)
            },1000);   
            res.redirect('/almacen/reportes_pedidos/'+token_id+'/'+token_partial)
          }else{
            if(filter_pedidos[token_id] == null){
              msg_p = {
                success:false,
                data_cliente:data
              }
              filter_pedidos_data(msg_p,token_id)
            }else{
              msg_p = {
                success:false,
                data_cliente:data
              }
              remove_filter_pedidos(token_id)
              filter_pedidos_data(msg_p,token_id)
            }
            res.redirect('/almacen/reportes_pedidos/'+token_id+'/'+token_partial)
        }
      })
    }else{
      res.redirect('/');
    }
       
  })

/// reportes de salidas
router.get('/reportes_salidas/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/distribucion')   
                .then(resp => resp.json())
                .catch(error => console.error('Error',error))
                .then(data =>{ 
                    fetch('http://localhost:3200/api/list_pedidos')   
                    .then(resp => resp.json())
                    .catch(error => console.error('Error',error))
                    .then(dat =>{   
                        
                        fetch('http://localhost:3600/api/role_farmacia')     
                        .then(resp => resp.json())
                        .catch(error => console.error('Error',error))
                        .then(personal_farmacia =>{
                            res.render('Almacen/reportes_salidas',{
                                data,
                                dat,
                                data_doc: data_user[token_id],
                                personal_farmacia
                            });
                        })
                       
                    })
                })               
                status = null;
            }else{
                res.redirect('/');
            }
        })
        
    }else{
        res.redirect('/');
    }
});

// ruta para poder filtrar los datos de distribucion
router.post('/Vue_filter_data_pedidos', (req,res) => {
    var datos = req.body;
    var esto = {
        method: 'post',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3500/api/filter_data_list',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

///ruta para poder filtrar los datos pedidos 
router.post ('/filter_data_pedidos', (req,res) => {
    var datos = req.body;
    var esto = {
        method: 'post',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3200/api/list_pedidos_filter',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})


router.get('/volver1/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params
    remove_one_grupo(token_id)
    res.redirect('/almacen/grupoAsig/'+token_id+'/'+token_part); 
})

router.get('/quitar/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params;
    remove_post(token_id);
    res.redirect('/almacen/grupoAsig/'+token_id+'/'+token_part);
})
///estos serv son para añadir a la tabla o al modelo grupo Asignacion
router.get('/grupoAsig/:token_id/:token_part',(req, res) => {
    const { token_id, token_part } = req.params
    fetch('http://localhost:3600/api/user/'+token_id)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
        if(datas.name.token[resp.id] && datas.name.token[resp.id].data.token.split(" ")[1].split(".")[2] == token_part){
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
                fetch('http://localhost:3500/api/asignacion')   
                .then(resp => resp.json())
                .then(resp =>{
                    console.log(data_post[token_id], " asdlñkjasldkj")
                    res.render('Almacen/grupoAsig',{
                        resp,
                        oneGrupoAsig:update_grupo[token_id],
                        data_doc: data_user[token_id],
                        msg:msg_Consulta_emergencia[token_id],
                        err:data_post[token_id] // esto es el body cuadno sale mensaje de error
                    });
                })

                .catch(error => {
                    console.error('Error:', error)
                    res.send("no hay coneccion con el servidor");
                })
                status = null
            }else{
                res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
        
    })
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



//ruta para poder insertar a grupo asignacion
router.post('/grupoAsig/:token_id/:token_part', (req, res) => {
    const { token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        var datos = req.body
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch('http://localhost:3500/api/asignacion',esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            if(data.success == false){
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
                if(data_post[token_id] == null){
                    data_p(datos,token_id)
                }else{
                    remove_post(token_id)
                    data_p(datos,token_id)
                }
                setTimeout(()=>{
                    remove_post(token_id)
                },50000);
                res.redirect('/almacen/grupoAsig/' + token_id + '/' + token_part);            
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
                remove_post(token_id)               
                res.redirect('/almacen/grupoAsig/' + token_id + '/' + token_part);             
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        })
    }else{
        res.redirect('/')
    }
});

// esta funcion es para poder mandar un usrio para que sea actualizado mediante usario
var update_grupo = {}
function one_grupo(data,id){
  let storedItem = update_grupo[id];
    if (!storedItem) {
      storedItem = update_grupo[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array1 () {
  let arr = [];
  for (const id in update_grupo) {
      arr.push(update_grupo[id]);
  }
  return arr;
}

function remove_one_grupo(id) {
  delete update_grupo[id];
}

router.get('/GrupoAsigONLY/:id/:token_id/:token_part', (req,res) => {
    const { id, token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3500/api/GrupoAsigONLY/'+id)   
            .then(resp => resp.json())
            .then(resp =>{
                if(update_grupo[token_id] == null){
                    one_grupo(resp, token_id)
                    res.redirect('/almacen/grupoAsig/'+token_id+'/'+token_part); 
                }else{
                    remove_one_grupo(token_id)
                    one_grupo(resp, token_id)
                    res.redirect('/almacen/grupoAsig/'+token_id+'/'+token_part); 
                }
                setTimeout(()=>{
                    remove_one_grupo(token_id)
                },60000);
        })
        .catch(error => {
            console.error('Error:', error)
            res.send("no hay coneccion con el servidor");
        })
    }else{
        res.redirect('/')
    }
});

router.post('/updateGPA/:id/:token_id/:token_part', (req,res) =>{
    const  { id, token_id, token_part }  = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        var data = req.body
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch('http://localhost:3500/api/GrupoAsigUPDATE/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {   
            console.log(data, "   este es el mesaje de update   <<<<<<")
          if (data.success == false){
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
            res.redirect( '/almacen/GrupoAsigONLY/'+id+'/'+token_id+'/'+token_part );
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
            res.redirect( '/almacen/GrupoAsigONLY/'+id+'/'+token_id+'/'+token_part );       
          }  
          setTimeout(()=>{
            remove(token_id)
        },1000);

        })
    }else{
        res.redirect('/')
    }

});

//ruta para pedidos  de farmacia
router.get('/farmacia_pedidos', (req,res) => {
    fetch('http://localhost:3200/api/list_pedidos')
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      res.render('Almacen/farmacia_pedidos', {
            resp
        })
    })
})

// ruta para ver el pedido de farmacia
router.get('/farmacia_ver_pedidos/:id_pedido/:token_id/:token_part', (req,res) => {
    const { id_pedido, token_id, token_part } = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3600/api/user/'+token_id)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            }  
            if(status == "tiene permiso"){
                fetch('http://localhost:3200/api/one_pedido/'+id_pedido)
                .then(resp => resp.json())
                .catch(error => console.error('Error',error))
                .then(resp => {                    
                    res.render('Almacen/farmcia_ver_pedidos',{
                        resp,
                        data_doc: data_user[token_id]
                    })
                })
                status = null;
            }else{
                res.redirect('/');
            };
        })
        
    }else{
        res.redirect('/');
    }
})
// ruta para poder sacar un pedido segun id de pedido
router.get('/Vue_one_pedido_farmacia/:id_pedido', (req,res) => {  
    const { id_pedido } = req.params
    fetch('http://localhost:3200/api/one_pedido/'+id_pedido)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
        res.status(200).json(resp)
    })
})

router.post('/Vue_update_peidodo_almacen_of_farmacia/:id_pedido', (req,res) => {
    const { id_pedido } = req.params
    var data = req.body
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3200/api/update_peidodo_almacen_of_farmacia/'+id_pedido,esto)
    .then(res => res.json())    
    .then(data => {  
        res.status(200).json(data)
    })
    .catch( error => {
        res.status(400).json({
            success:false,
            msg:"no se puedo actualizar los datos",
            error
        })
    })
    
})

module.exports = router;