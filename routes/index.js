const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');
import { user_data1, remove_user12 } from './url/export';

router.post('/enviar', (req,res) => {
  var data = req.body
  if (data != "" ){
    tok(data.data_token,data.data_token.user.id)
    datas.name.token = listItems
    res.status(200).json({
      success:true
    })
    
  }else{
    res.status(400).json({
      success:false,
    })
  }
})

// esta funcion es para poder mandar el usuario gegistrado de cada usuario
var listItems = {}
function tok(token,id){
  let storedItem = listItems[id];
    if (!storedItem) {
      storedItem = listItems[id] = {
        data: token,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in listItems) {
      arr.push(listItems[id]);
  }
  return arr;
}

function remove_Token(id) {
  delete datas.name.token[id];
}


//funcion para saver si se estaentrando por login 
var login = {}
function sessions(token,id){
  let storedItem = login[id];
    if (!storedItem) {
      storedItem = login[id] = {
        data: token,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_session () {
  let arr = [];
  for (const id in login) {
      arr.push(login[id]);
  }
  return arr;
}

function remove_session(id) {
  delete datas.name.session[id];
}


//esta funcion es para el data user
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




router.get('/',(req, res) => {
  res.render('index', { msg1, msg2, msg3 })
});

router.get('/index2', (req,res) => {
  res.render('index2');
});
/**home aquiiiiiiiiiiiii */

router.get('/delete_token/:token_id', (req,res) => {
  const { token_id } = req.params;
  remove_Token(token_id);
  res.redirect('/')
})

router.get('/home/:id_user',(req, res) => {
  const { id_user } = req.params

  var data_token = {
    token_id: {},
    personal:{},        
  }

  fetch('http://localhost:3600/api/user/'+id_user)  // esto es para sacar el token del usuario
  .then(resp => resp.json())
  .then(resp => {

    if(datas.name.token[resp.id]){
      data_token.token_id = resp.id 
      var status
      for(var i = 0; i < resp.role.length; i++ ){
          if(resp.role[i].name == "administrcion"){
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
                fetch('http://localhost:3600/api/allUser')        
                .then(resp => resp.json())
                .then(data =>{  
                  var lo = data.length
                  fetch('http://localhost:3600/api/Only_Medicos')        
                    .then(resp => resp.json())
                    .then(medi =>{
                      fetch('http://localhost:3600/api/OnlyPersonal')
                      .then(resp => resp.json())
                      .then(personal =>{
                        fetch('http://localhost:3600/api/OnlyEnfermera')
                        .then(resp => resp.json())
                        .then(enfe =>{
                          fetch('http://localhost:3600/api/OnlyFarma')
                          .then(resp => resp.json())
                          .then( fer =>{
                            fetch('http://localhost:4600/api/liscuaderno')
                            .then(resp => resp.json())
                            .then(cua =>{
                              fetch('http://localhost:4600/api/especialidad')
                              .then(resp => resp.json())
                              .then(esp =>{
                                fetch('http://localhost:3000/api/pacientes')
                                .then(resp => resp.json())
                                .then(paci =>{

                                  res.render('home',{
                                    lo,
                                    medi,
                                    data,
                                    fer,
                                    personal,
                                    enfe,
                                    cua,
                                    esp,
                                    paci,
                                    log5:esp.length,
                                    log4:cua.length,
                                    lar: medi.length,
                                    long: personal.length,
                                    long1:enfe.length,
                                    log3: fer.length,
                                    log6:paci.length,
                                    data_token,
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

                                })
                                
                              })

                            })
                            .catch(error => {       
                              console.error('Error:', error)
                              res.render('404error',{
                                msg:"No hay conección con el sevidor 4600",
                                /* data_doc:datas.name.data_user[data_token.token_id], */
                              })
                            })
                          })
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
                fetch('http://localhost:3600/api/allUser')        
                .then(resp => resp.json())
                .then(data =>{  
                  var lo = data.length
                  fetch('http://localhost:3600/api/Only_Medicos')        
                    .then(resp => resp.json())
                    .then(medi =>{
                      fetch('http://localhost:3600/api/OnlyPersonal')
                      .then(resp => resp.json())
                      .then(personal =>{
                        fetch('http://localhost:3600/api/OnlyEnfermera')
                        .then(resp => resp.json())
                        .then(enfe =>{
                          fetch('http://localhost:3600/api/OnlyFarma')
                          .then(resp => resp.json())
                          .then( fer =>{
                            fetch('http://localhost:4600/api/liscuaderno')
                            .then(resp => resp.json())
                            .then(cua =>{
                              fetch('http://localhost:4600/api/especialidad')
                              .then(resp => resp.json())
                              .then(esp =>{
                                fetch('http://localhost:3000/api/pacientes')
                                .then(resp => resp.json())
                                .then(paci =>{

                                  res.render('home',{
                                    lo,
                                    medi,
                                    data,
                                    fer,
                                    personal,
                                    enfe,
                                    cua,
                                    esp,
                                    paci,
                                    log5:esp.length,
                                    log4:cua.length,
                                    lar: medi.length,
                                    long: personal.length,
                                    long1:enfe.length,
                                    log3: fer.length,
                                    log6:paci.length,
                                    data_token,
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

                                })
                                
                              })
                            })
                            .catch(error => {       
                              console.error('Error:', error)
                              res.render('404error',{
                                msg:"No hay conección con el sevidor 4600",
                                /* data_doc:datas.name.data_user[data_token.token_id], */
                              })
                            })
                          })
                        })
                      })
                    })    
                  }) 

                status = null
            }
            setTimeout(()=>{
              remove_session(resp.id)
                function remove_session(id) {
                delete datas.name.session[id]
              }
            },5000);
            
           
        })
      }else{
        res.redirect('/')
      }
      
    }else{
      res.redirect('/')
    }
    
  })
  .catch(error => {       
    console.error('Error:', error)
    res.render('404error',{
      msg:"No hay conección con el sevidor 3600",
      /* data_doc:datas.name.data_user[data_token.token_id], */
    })
  })
  });

var msg1,msg2,msg3, token_part;
router.post('/login', (req,res)  => {
  const username = req.body.username;
  const password = req.body.password;  
 
  if(username =="" ){
    msg3 = null
    msg1='Introdusca por favor la cuenta.';
    res.redirect('/')
    
  }else if( password == "" ){
    msg3 = null
    msg2 = 'Introdusca password.'
    res.redirect('/')   

  }else {
    var data = req.body;
    var enviar = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type' : "application/json"
      }
    }
  fetch('http://localhost:3600/api/login',enviar)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    //console.log(resp, " esto es http://localhost:3600/api/login")
    if(resp.user == false){
      msg1=null;
      msg2=null;
      msg3 =" Usted no esta registrado "
      res.redirect('/')   
    }else if(resp.success == false){
      msg1=null;
      msg2=null;
      msg3 = " Contraceña Incorrecta "
      res.redirect('/')   
    }else if ( datas.name.token[resp.user.id] == null ){
      fetch('http://localhost:3600/api/personal/'+resp.user.perso_id)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(personal => {
        //console.log(personal, " estao es la respuesta que quiero ver")
        if(personal.estado == false){
          token_part = resp.token.split(" ")[1].split(".")[2] // esto saca la parte final del token      
          tok(resp,resp.user.id); //funcion para añadir token del usuario  
    
          var session = {
            login:true
          }
          sessions(session,resp.user.id)
          datas.name.session = login // esto es para ver si el usuario inicio session desde login
    
          datas.name.token = listItems // esto es para añadir tokens a datas
          fetch('http://localhost:3600/api/user/'+resp.user.id)
          .then(resp => resp.json())
          .catch(error => console.error('Error',error))
          .then(resp => {
            if(resp.role[0] == null || resp.role[0] == ""){
              res.status(400).json({
                success:false,
                msg:"El paciente todavia no tiene un rol o no se creo la especilidad donde el paciente esta queriendo entrar"
              })
            }else{
              //console.log(resp, "  <<<<<<<< esto es lo que quiero ver <<<<<<<<<<<<<<<<<<<")
              
              if(resp.role[0].name == "Almacen"){
                //res.send(resp.role[0].name)
                res.redirect('/almacen/home/'+resp.id + '/' + token_part )
              }else if(resp.role[0].name == "fichaje"){
                res.redirect('/paciente/home/'+resp.id + '/'+ token_part)
                //res.send(resp.role)
              }else if(resp.role[0].name == "medico"){
                res.redirect('/consulta_externa/home/'+resp.id + '/'+ token_part)
              }else if(resp.role[0].name == "emergencia"){
                res.redirect('/emergencia2.0/home/'+resp.id + '/'+ token_part)
              }else if(resp.role[0].name == "farmacia"){
                res.redirect('/farmacia/home/' + resp.id + '/' + token_part)            
              }else if(resp.role[0].name == "hospitalizacion"){
                res.redirect('/Internaciones/home/'+resp.id)
              }else  if(resp.role[0].name == "laboratorio") {
                res.redirect('/laboratorios/home/'+resp.id)
              }else if (resp.role[0].name == "administrcion"){
                res.redirect('/home/'+resp.id)
              }
              
            }
            //res.redirect('/almacen/home/'+resp.user.id)
          }) 
        }else{
          res.status(400).json({
            success:false,
            msg:"No puede entrar por que se dio de baja al personal"
          })
        }
      })
      
    }else {
      fetch('http://localhost:3600/api/personal/'+resp.user.perso_id)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(personal => {
        //console.log(personal, " estao es la respuesta que quiero ver")
        console.log(personal.estado)
        if(personal.estado == false){
          var session = {
            login:true
          }
          remove_session(resp.user.id)
          sessions(session,resp.user.id)
          datas.name.session = login // esto es para ver si el usuario inicio session desde login
    
    
          token_part = resp.token.split(" ")[1].split(".")[2] // esto saca la parte final del token      
          remove_Token(resp.user.id)
          
          tok(resp,resp.user.id); //funcion para añadir token del usuario  
          
          datas.name.token = listItems // esto es para añadir tokens a datas
          fetch('http://localhost:3600/api/user/'+resp.user.id)
          .then(resp => resp.json())
          .catch(error => console.error('Error',error))
          .then(resp => {
            if(resp.role[0] == null || resp.role[0] == ""){
              res.status(400).json({
                success:false,
                msg:"El paciente todavia no tiene un rol o no se creo la especilidad donde el paciente esta queriendo entrar"
              })
            }else{
              
              if(resp.role[0].name == "Almacen"){
                //res.send(resp.role[0].name)
                res.redirect('/almacen/home/'+resp.id+ '/'+ token_part)
              }else if(resp.role[0].name == "fichaje"){
                res.redirect('/paciente/home/'+resp.id + '/'+ token_part)
                //res.send(resp.role)
              }else if(resp.role[0].name == "medico"){
                res.redirect('/consulta_externa/home/'+resp.id + '/'+ token_part)
                console.log(resp, " entro y mostro esto")
              }else if(resp.role[0].name == "emergencia"){
                res.redirect('/emergencia2.0/home/'+resp.id + '/'+ token_part)            
              }else if(resp.role[0].name == "farmacia"){
                res.redirect('/farmacia/home/' + resp.id + '/' + token_part)
              }else if(resp.role[0].name == "hospitalizacion"){
                res.redirect('/Internaciones/home/'+resp.id)
              }else if(resp.role[0].name == "laboratorio"){
                res.redirect('/laboratorios/home/'+resp.id)
              }else if (resp.role[0].name == "administrcion"){
                res.redirect('/home/'+resp.id)
              }
              
            }
            //res.redirect('/almacen/home/'+resp.user.id)
          }) 
        }else{
          res.status(400).json({
            success:false,
            msg:"No puede entrar por que se dio de baja al personal"
          })
        }
      })
    }
    
  })
    .catch(error => {
      console.error('Error:', error)
        res.send("No hay coneccion con el servidor")
    }) 
  }
})


/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        login 2.0
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.get('/login2', (req,res) => {
  res.render('login2');
})

router.post('/login2', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;  
 
  if(username =="" ){
    msg3 = null
    msg1='Introdusca por favor la cuenta.';
    res.redirect('/')
    
  }else if( password == "" ){
    msg3 = null
    msg2 = 'Introdusca password.'
    res.redirect('/')   

  }else {
    var data = req.body;
    var enviar = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type' : "application/json"
      }
    }
    fetch('http://localhost:3600/api/login',enviar)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(data_login => {
      if(data_login.success == true){
        if ( datas.name.token[data_login.user.id] == null ){
          tok(data_login,data_login.user.id);

          fetch('Internaciones/prueba',{id:45,nombre:"alejandro"})
          
        }else{
          remove_Token(resp.user.id)
          tok(data_login,data_login.user.id);
          res.redirect('/Internaciones/prueba',{id:45,nombre:alejandro})
        }
        
      }else{
        res.redirect('/')
      }

    })
  }
})

//ver token
router.get('/token', (req,res) => {
  res.send({
    token:datas.name.token,
    session: datas.name.session,
    datas
  })
})

router.get('/forrm',(req, res) => {
  res.render('forrm')
});
router.get('/servicios',(req, res) => {
  res.render('servicios')
});
router.get('/usuarios',(req, res) => {
  res.render('usuarios')
});



router.get('/citas_fichas2',(req, res) => {
  res.render('citas_fichas2')
});

 //vista de doctor
 
// Historiales Clinicos
router.get('/reportes_pacientes',(req, res) => {
  res.render('reportes_pacientes')
});

router.get('/vistaPrimPaciente',(req, res) => {
  res.render('vistaPrimPaciente')
});



// se movio esta ruta  a emergencia

//para las vistas de hospitaliacion
router.get('/homeHospitalizacion', (req,res) => {
  res.render('homeHospitalizacion')
});


//hospitalizacion 


router.get('/vistaHospitalizacion',(req, res) => {
  res.render('vistaHospitalizacion')
});


router.get('/Papeleta_Inter',(req, res) => {
  res.render('Papeleta_Inter')
});

// Internacion
router.get('/salas',(req, res) => {
  res.render('salas')
});
// role
router.get('/roles',(req, res) => {
  fetch('http://localhost:3600/api/personal')        
  .then(resp => resp.json())
  .then(data =>{  
    res.render('roles', {
      data
    })
  })
});
router.get('/creroles',(req, res) => {
  fetch('http://localhost:3600/api/roleall')        
  .then(resp => resp.json())
  .then(data =>{  
    res.render('CreRoles', {
      data
    })
  })
});
// role
router.get('/backup/:token_id',(req, res) => {
  const { token_id } = req.params
  if(datas.name.token[token_id]){
    res.render('backup',{
      data_doc:datas.name.data_user[token_id]
    })
  }else{
    res.redirect('/');
  }
});
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


///medicamentos admin
router.get('/pacientead/:token_id',(req, res) => {
  const { token_id } = req.params
  if(datas.name.token[token_id]){
    fetch('http://localhost:3200/api/mostrar_medicamentos')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('pacientead', {
        data,
        data_doc:datas.name.data_user[token_id],
        filter:filter_ventas1[token_id],
        msg:msg_Consulta_emergencia[token_id],
        
      })
    })  
  }else{
    res.redirect('/')
  }
});

var filter_ventas1 = {}
function filter_cliente_ventas1(data,id){
  let storedItem = filter_ventas1[id];
    if (!storedItem) {
      storedItem = filter_ventas1[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_filter_data3 () {
  let arr = [];
  for (const id in filter_ventas1) {
      arr.push(filter_ventas1[id]);
  }
  return arr;
}

function remove_filter_data1(id) {
  delete filter_ventas1[id];
}

//filter ventas

router.post ('/filter_ventas/:token_id', (req,res) => {
  const { token_id } = req.params
  var msg_p;
  if(datas.name.token[token_id]){
    var data = req.body;
    var enviar = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type' : "application/json"
      }
    }
    fetch('http://localhost:3200/api/filter_ventas',enviar)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
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
          remove_filter_data1(token_id)
          setTimeout(()=>{
            remove(token_id)
          },1000);   
          res.redirect('/pacientead/'+token_id)
        }else{
          if(filter_ventas1[token_id] == null){
            msg_p = {
              success:false,
              data_cliente:data
            }
            filter_cliente_ventas1(msg_p,token_id)
          }else{
            msg_p = {
              success:false,
              data_cliente:data
            }
            remove_filter_data1(token_id)
            filter_cliente_ventas1(msg_p,token_id)
          }
          res.redirect('/pacientead/'+token_id)
      }
    })
  }else{
    res.redirect('/')
  }
})
router.get('/allmedi/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){ 
    fetch('http://localhost:3200/api/mostrar_medicamentos')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriM', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
})
// Internacion salas 


//Se movio a routas salas
////solo pacintes
router.get('/paciente_Inter/:token_id',(req, res) => {
  const { token_id } = req.params
  if(datas.name.token[token_id]){
    fetch('http://localhost:3000/api/list_onli_pacientes')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('paciente_Inter', {
        data,
        data_doc:datas.name.data_user[token_id],
        filter:filter_ventas[token_id],
        msg:msg_Consulta_emergencia[token_id],        
      })
    })
  }else{
    res.redirect('/');
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

function remove_filter_data(id) {
  delete filter_ventas[id];
}

/***filtros pacientes */
router.post ('/filter_pacientes/:token_id', (req,res) => {
  const { token_id } = req.params
  var msg_p;
  if(datas.name.token[token_id]){
    var data = req.body;
    var enviar = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type' : "application/json"
      }
    }
    fetch('http://localhost:3000/api/filtro_pacientes',enviar)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
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
          remove_filter_data(token_id)
          setTimeout(()=>{
            remove(token_id)
          },1000);   
          res.redirect('/paciente_Inter/'+token_id)
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
            remove_filter_data(token_id)
            filter_cliente_ventas(msg_p,token_id)
          }
          res.redirect('/paciente_Inter/'+token_id)
      }
    })
  }else{
    res.redirect('/')
  }
})
router.get('/allpacientes/:token_id',(req, res) =>{
  const { token_id } = req.params
  if( datas.name.token[token_id] ){ 
    fetch('http://localhost:3000/api/list_onli_pacientes')        
    .then(resp => resp.json())
    .then(data =>{  
      res.render('reporAdmin/impriP', {
        data,
        data_doc:datas.name.data_user[token_id]
      })
    })
  }else{
    res.redirect('/')
  }
})
/////////////////////////////////////////////////////
router.get('/mostrar/:id_paciente', (req,res) => {
  const { id_paciente } = req.params
  fetch('http://localhost:3000/api/paciente_alergias/'+id_paciente  )        
  .then(resp => resp.json())
  .then(data =>{  
    res.send(data)
  })
})

// Farmacia
router.get('/almacen',(req, res) => {
  res.render('almacen')
});


//medicamento se movio a medicamento.js


// esta ruta se mando a almacen.js

// esta se movio a proveedores

// se movio a pedidos.js


router.get('/inventariosFar',(req, res) => {
  res.render('inventariosFar')
});

router.get('/solicitudes',(req, res) => {
  res.render('solicitudes')
});


//ruta temporal 
router.get('/consultaMed', (req, res) => {
  res.render('ConsultaMed');
});

//emergencia render
router.get('/emergencia', (req,res) => {
  res.render('emergencias/homeEmergencia')
});

//consulta externa

router.get('/datos_responsable', (req,res) => {
  res.render('datos_responsable')
});
router.get('/VerHistorial', (req,res) => {
  res.render('VerHistorial')
});
router.get('/ordenLaboratorio', (req,res) => {
  res.render('ordenLaboratorio')
});

router.get('/table_prueba', (req,res) => {
  res.render('hospitalizaciones/z_prueba_table')
})

///**Cerrar secion */
router.get('/outcerrar',(req, res) => {
  res.render('index')
});

router.get('/prueba_fecha', (req,res) => {
 
  fetch('http://localhost:4600/fecha')
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.render('prueba_fechas',{
      resp
    })
  })
})

router.post('/prueba_fecha', (req,res) => {
  var data = req.body;
  var enviar = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type' : "application/json"
    }
  }
  fetch('http://localhost:4600/fecha',enviar)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.redirect('/prueba_fecha')
  })
})


module.exports = router;