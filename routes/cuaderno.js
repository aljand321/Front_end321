const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

var url = require('./url/export');
const datas = require('./url/export');


//rutas con vue

router.post('/vue_regConsultorio/:id_especialidad',(req,res) => {
    const { id_especialidad } = req.params
    var data = req.body
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.cuadernos+'/api/reg_consEsp/' + id_especialidad,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        console.log(data)
        res.status(200).json(data)
    }) 
})

router.get('/VueliminarConsulta/:id',(req,res) =>{
    const { id } = req.params;
    fetch('http://localhost:4600/api/delturn/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
        res.status(200).json(resp)
    });
})

router.get('/vude_del_med_especialidad/:id', (req,res) => {
    const { id } = req.params
    fetch('http://localhost:4600/api/delmedico/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
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


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

router.get('/cuaderno',(req,res) => {
    res.render('cuadernos/homeCuaderno');
});

router.get('/limpiar/:token_id', (req,res) => {
    const { token_id } = req.params
    remove(token_id)
    remove_esp(token_id)
    res.redirect('/cuaderno/especialidad/'+token_id);
})


/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
                serv para renderizar y listar todas las especialidades            
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
 */

router.get('/especialidad/:token_id', (req,res) => {
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch(url.name.cuadernos+'/api/especialidad')
        .then(res => res.json())
        .then(resp => { 
            fetch(url.name.pruebas+'/api/Only_Medicos')
            .then(res => res.json())
            .then(Lista_medicos => {
                console.log(update_esp[token_id], "  <<   < < < < < < < < < < < << ")
                res.render('cuadernos/especialidad',{
                    resp,
                    espONE:update_esp[token_id],
                    msg:msg_Consulta_emergencia[token_id],
                    Lista_medicos,
                    data_doc:datas.name.data_user[token_id]
                });
            })
            .catch(error => {
                console.error('Error:', error)
                res.render('404error',{
                    msg:"No hay conección con el sevidor 3600",
                    //data_doc:datas.name.data_user[token_id],
                });
            }) 
        })
        .catch(error => {
            console.error('Error:', error)
            res.render('404error',{
                msg:"No hay conección con el sevidor  4600",
                //data_doc:datas.name.data_user[token_id],
            });
        }) 
    }else{
        res.redirect('/')
    }
    
});
var update_esp = {}
function one_esp(data,id){
  let storedItem = update_esp[id];
    if (!storedItem) {
      storedItem = update_esp[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array12 () {
  let arr = [];
  for (const id in update_esp) {
      arr.push(update_esp[id]);
  }
  return arr;
}

function remove_esp(id) {
  delete update_esp[id];
}
//serv para poder sacar una sola especialidad para que pueda ser actualizado

router.get('/oneEsp/:id/:token_id', (req,res) => {
    const { token_id } = req.params
    const { id } = req.params;
    fetch(url.name.cuadernos+'/api/EspOne/'+id)
    .then(res => res.json())
    .then(resp => { 
        if(update_esp[token_id] == null){
            one_esp(resp, token_id)
            res.redirect('/cuaderno/especialidad/'+ token_id) 
        }else{
            remove_esp(token_id)
            one_esp(resp, token_id)
            res.redirect('/cuaderno/especialidad/'+token_id)
        }
        setTimeout(()=>{
            remove_esp(token_id)
        },25000);        
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})
//serv para poder insertar en cuadernos
router.post('/especialidad/:token_id', (req,res) => {
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        var data = req.body;
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/especialidad',esto)
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
                res.redirect('/cuaderno/especialidad/'+token_id)
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
                res.redirect('/cuaderno/especialidad/'+token_id)
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        }) 
    }else{
        res.redirect('/')
    } 
})

//ser para poder actualizar especialidad
router.post('/updateEsp/:id/:token_id', (req,res)=> {
    const { id, token_id } = req.params;
    if( datas.name.token[token_id] ){
        var data = req.body;
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/updateEsp/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            if(data.success == false){
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:false,
                      data_p:data.msg
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:false,
                      data_p:data.msg
                    };
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
                res.redirect('/cuaderno/oneEsp/'+id+'/'+token_id);
            }else{
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:true,
                      data_p:data.message
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:true,
                      data_p:data.message
                    };
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
                res.redirect('/cuaderno/oneEsp/'+id+'/'+token_id);
            }            
           
        }) 
    }else{
        res.redirect('/')
    } 
})

//asignar medico
router.get('/VUe_lista_medicos', (req,res) => {
    fetch(url.name.pruebas+'/api/Only_Medicos')
    .then(res => res.json())
    .then(Lista_medicos => { 
        res.status(200).json(Lista_medicos)
    })
})

router.post('/Vue_reg_doctor_especialidad/:id_especialidad', (req,res) => {
    const { id_especialidad } = req.params
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.cuadernos+'/api/reg_doctor_especialidad/'+id_especialidad,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data)       
    })  
})

router.get('/vue_only_list_doctores_especialidad/:id_especialidad', (req,res) => {
    const { id_especialidad } = req.params
    fetch(url.name.cuadernos+'/api/only_list_doctores_especialidad/'+id_especialidad)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

router.get('/vue_list_EspCons/:id_especialidad', (req,res) => {
    const { id_especialidad } = req.params
    fetch(url.name.cuadernos+'/api/list_EspCons/'+id_especialidad)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            RUTAS PARA CUADERNOS
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/

router.get('/limpiarC/:token_id', (req,res) => {
    const { token_id } = req.params;
    remove_cuaderno(token_id);
    remove(token_id);
    res.redirect('/cuaderno/Cuadernos/'+token_id);
})
router.get('/limpiar2', (req,res) => {
    mgconf = null;
    res.redirect('/cuaderno/Cuadernos')
})
router.get('/cuadernos1/:token_id', (req,res) => {
    const { token_id } = req.params
    res.redirect('/cuaderno/Cuadernos/'+token_id)
})
//esta ruta es para poder rendirzar cuadernos
router.get('/Cuadernos/:token_id', (req,res) => {
    const { token_id } = req.params
    if( datas.name.token[token_id] ){

        fetch(url.name.cuadernos+'/api/liscuaderno')
        .then(res => res.json())
        .then(resp => { 
            console.log(update_cuaderno[token_id], "  < < < < < <  < << <  < < << <  < <<  < < < < < < < < < < <<  <")
            res.render('cuadernos/cuadernos',{
                resp,
                data_doc:datas.name.data_user[token_id],
                msg:msg_Consulta_emergencia[token_id],
                OnlyC:update_cuaderno[token_id],
                

            })
        })
        .catch(error => {
            console.error('Error:', error)
            res.render('404error',{
                msg:"No hay conección con el sevidor de Cuadernos"
            });
        })    
    }else {
        res.redirect('/');
    } 
})

// esta funcion es para poder mandar un cuaderno para que sea actualizado mediante usario
var update_cuaderno = {}
function one_cuaderno(data,id){
  let storedItem = update_cuaderno[id];
    if (!storedItem) {
      storedItem = update_cuaderno[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array13 () {
  let arr = [];
  for (const id in update_cuaderno) {
      arr.push(update_cuaderno[id]);
  }
  return arr;
}

function remove_cuaderno(id) {
  delete update_cuaderno[id];
}

//ruta para poder sacar una solo cuaderno
router.get('/onlyCuadernos/:id/:token_id', (req,res) => {
    const { id, token_id } = req.params;
    fetch(url.name.cuadernos+'/api/OnlyCuadernos/'+id)
        .then(res => res.json())
        .then(resp => { 
            
            if(update_cuaderno[token_id] == null){
                one_cuaderno(resp, token_id)
                res.redirect('/cuaderno/Cuadernos/'+token_id)
            }else{
                remove_cuaderno(token_id)
                one_cuaderno(resp, token_id)
                res.redirect('/cuaderno/Cuadernos/'+token_id)
            }
            setTimeout(()=>{
                remove_cuaderno(token_id)
            },50000);
        })
        .catch(error => {
            console.error('Error:', error)
            res.send("404error");
        })   
})

//ruta para insertar en cuadernos
router.post('/cuadernos/:token_id',(req,res) => {
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        var data = req.body;
        var msg_p
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/cuaderno',esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
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
                res.redirect('/cuaderno/Cuadernos/'+token_id)
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
                res.redirect('/cuaderno/Cuadernos/'+token_id)
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        })  
    }else{
        res.redirect('/')
    }
})

router.post('/updateCuaderno/:id/:token_id', (req,res) => {
    const { id, token_id } = req.params;
    if( datas.name.token[token_id] ){
        var data = req.body;
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/updateCuaderno/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {   
            if(data.success == true){
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
                res.redirect('/cuaderno/onlyCuadernos/'+id+'/'+token_id)  
            }else{

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
                res.redirect('/cuaderno/onlyCuadernos/'+id+'/'+token_id) 
                
            } 
            setTimeout(()=>{
                remove(token_id)
            },1000);    

        })  
    }else{
        res.redirect('/')
    }
})




/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            RUTA PARA MEDICOS 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
//-http://localhost:3600/personal/personal

router.get('/volver_a_doctor', (req,res) => {
    res.redirect('/cuaderno/getEsp/'+idCuaderno)
})

router.get('/limpiarMDoc/:id/:token_id', (req,res) => {
    const { id, token_id } = req.params
    remove_one(token_id)
    res.redirect('/cuaderno/getEsp/'+id+'/'+token_id)
})

router.get('/getEsp/:id/:token_id', (req,res) => {
    const { id,token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch(url.name.cuadernos+'/api/list_consEsp')
        .then(res => res.json())
        .then(esp => { 

            fetch(url.name.cuadernos+'/api/doctores/'+id)
            .then(res => res.json())
            .then(listDoc => { 
            
                fetch(url.name.pruebas+'/api/Only_Medicos')
                .then(res => res.json())
                .then(resp => { 
                    fetch(url.name.pruebas+'/api/OnlyEnfermera')
                    .then(res => res.json())
                    .then(enfermeras => { 

                        res.render('cuadernos/turnos',{
                            id, 
                            data_doc:datas.name.data_user[token_id],
                            msg:msg_Consulta_emergencia[token_id],
                            resp, // esto contiene los doctores
                            esp,   // esto trae las especialidades
                            listDoc,
                            modifDoct:modif_Doct[token_id],
                            enfermeras
                        });

                    })
                
                })
                .catch(error => {
                    console.error('Error:', error)
                    res.send("no hay coneccion con el servidor");
                }) 
            })
            .catch(error => {
                console.error('Error:', error)
                res.send("no hay coneccion con el servidor");
            }) 
        })
        .catch(error => {
            console.error('Error:', error)
            res.send("no hay coneccion con el servidor");
        }) 
    }else{
        res.redirect('/')
    }

})

// esta funcion es para poder mandar un cuaderno para que sea actualizado mediante usario
var modif_Doct = {}
function one(data,id){
  let storedItem = modif_Doct[id];
    if (!storedItem) {
      storedItem = modif_Doct[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array14 () {
  let arr = [];
  for (const id in modif_Doct) {
      arr.push(modif_Doct[id]);
  }
  return arr;
}

function remove_one(id) {
  delete modif_Doct[id];
}

//ruta para modificar o actualizar

router.get('/midificarDoct/:id/:id2/:token_id', (req,res) => {
    const { id, id2, token_id } = req.params;
    if( datas.name.token[token_id] ){
        fetch(url.name.cuadernos+'/api/IdDoct/'+id)
        .then(res => res.json())
        .then(resp => {            
            if(modif_Doct[token_id] == null){
                one(resp, token_id)
                res.redirect('/cuaderno/getEsp/'+id2+'/'+token_id)
            }else{
                remove_one(token_id)
                one(resp, token_id)
                res.redirect('/cuaderno/getEsp/'+id2+'/'+token_id)
            }
            setTimeout(()=>{
                remove_one(token_id)
            },50000);   

        })
        .catch(error => {
            console.error('Error:', error)
            res.send("no hay coneccion con el servidor");
        })
    }else{
        res.redirect('/')
    } 
})


//ruta para insertar en doctor
let id_docCuaderno // esta id es para poder insertar en fechas
router.post('/docCuaderno/:id/:token_id', (req,res) => {
    const { id,token_id } = req.params
    if( datas.name.token[token_id] ){

        var data = req.body;
        var msg_p;
        console.log(req.body, " < < < < < < < < <  < < < < < < < < < < <  < < < < < < < < <<<<<<<<<<<<<<<<<<<<<<<<")
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/doctor/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {   
            console.log(data.message + " <<  < < < < <  esto es xxzxzx< < < < < <  <")
            if (data.success == true){
                id_docCuaderno =  data.data.id
                res.redirect('/cuaderno/FechaDoc/'+data.data.id+'/'+token_id+'/'+id )   
            }else{
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
                res.redirect( '/cuaderno/getEsp/' + id + '/' + token_id );
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        }) 

    }else{
        res.redirect('/')
    }
})

//ruta para poder actualizar 
router.post('/updateDoctCuaderno/:id/:id2/:token_id', (req,res) => {
    const { id,id2, token_id } = req.params
    if( datas.name.token[token_id] ){
        var datos = req.body
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/modifyDocCuadern/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {   
            if(data.success == true){
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
                res.redirect('/cuaderno/midificarDoct/'+id+'/'+id2+'/'+token_id ) 
            }else{
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
                res.redirect('/cuaderno/midificarDoct/'+id+'/'+id2+'/'+token_id ) 
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        
        })  
    }else{
        res.redirect('/')
    }
    
})


/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            RUTA PARA Fechas 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/


// esta ruta es para poder volver una pestaña anterior
router.get('/volver_docCuaderno/:id_anterior/:token_id', (req,res) => {
    const { id_anterior, token_id } = req.params
    res.redirect('/cuaderno/getEsp/'+id_anterior+'/'+token_id)
})


router.get('/volverFechas/:id/:token_id/:id_anterior', (req,res) => {
    const { id, token_id, id_anterior } = req.params
    res.redirect('/cuaderno/FechaDoc/'+id+'/'+token_id+'/'+id_anterior) //    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
})

router.get('/limpiarFecha/:id/:token_id/:id_anterior',(req,res) => {
    const { id, token_id, id_anterior } = req.params;
    remove(token_id)
    remove_fecha(token_id);
    res.redirect('/cuaderno/FechaDoc/'+id+'/'+token_id+'/'+id_anterior);
})

//ruta para mostrar las fechas del doctor

router.get('/FechaDoc/:id/:token_id/:id_anterior', (req,res) => {
    const { id, token_id, id_anterior } = req.params;
    if( datas.name.token[token_id] ){
        id_docCuaderno = id;
        fetch(url.name.cuadernos+'/api/fechasList/'+id)
        .then(res => res.json())
        .then(docFecha => { 
            console.log(modif_fecha[token_id], "  <<<<<<<< < < < < < < < < ")
            res.render('cuadernos/fechas',{
                id,
                id_anterior,
                docFecha, //trae fecha de contrato del doctor

                onlyFecha:modif_fecha[token_id], //para mostar una sola fecha y luego poder actualizar

                data_doc:datas.name.data_user[token_id],
                msg:msg_Consulta_emergencia[token_id],
            })
        })
        .catch(error => {
            console.error('Error:', error)
            res.send("no hay coneccion con el servidor");
        }) 
    }else{
        res.redirect('/')
    }
})

// esta funcion es para poder mandar un cuaderno para que sea actualizado mediante usario
var modif_fecha = {}
function one_fecha(data,id){
  let storedItem = modif_fecha[id];
    if (!storedItem) {
      storedItem = modif_fecha[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array15 () {
  let arr = [];
  for (const id in modif_fecha) {
      arr.push(modif_fecha[id]);
  }
  return arr;
}

function remove_fecha(id) {
  delete modif_fecha[id];
}


//ruta para poder actualizar mostrar una fecha
router.get('/onlyfecha/:id_fechas/:id/:token_id/:id_anterior', (req,res) => {
    const { id_fechas, id, token_id, id_anterior } = req.params;
    if( datas.name.token[token_id] ){
        fetch(url.name.cuadernos+'/api/oneFecha/'+id_fechas)
        .then(res => res.json())
        .then(resp => { 
            if(modif_fecha[token_id] == null){
                one_fecha(resp, token_id)
                res.redirect('/cuaderno/FechaDoc/'+id+'/'+token_id+'/'+id_anterior)
            }else{
                remove_fecha(token_id)
                one_fecha(resp, token_id)
                res.redirect('/cuaderno/FechaDoc/'+id+'/'+token_id+'/'+id_anterior)
            }
            setTimeout(()=>{
                remove_fecha(token_id)
            },50000);   

        })
        .catch(error => {
            console.error('Error:', error)
            res.send("no hay coneccion con el servidor");
        }) 
    }else{
        res.redirect('/')
    }
})

var msge1, msge2;
let idFechas
router.post('/fechas/:id/:token_id/:id_anterior', (req,res) => {
    const { id, token_id, id_anterior } = req.params;
    if( datas.name.token[token_id] ){
        var datos = req.body;
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/fechas/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {  
            console.log("aquiiiiiiiiiiiii",data)            
            if(data.success == true){
                idFechas = data.data.id  
                res.redirect('/cuaderno/turnos/'+data.data.id+'/'+token_id+'/'+id_anterior+'/'+id) 
            }else{
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:false,
                      data_p:data.message
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:false,
                      data_p:data.message
                    }
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
                res.redirect('/cuaderno/FechaDoc/'+id+'/'+token_id+'/'+id_anterior);
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
            
        })  
    }else{
        res.redirect('/')
    }
})

router.get('/vue_list_horas/:id_turno', (req,res) => {
    const { id_turno } = req.params
    fetch('http://localhost:4600/api/listHoras_turno/'+id_turno)
    .then(resp => resp.json())    
    .then(resp =>{
        res.status(200).json(resp)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"error de servidor",
            error
        })
    })
})

//ruta para poder actualizar fecha
router.post('/updateFecha/:id_fecha/:id/:token_id/:id_anterior', (req,res ) => {
    const { id_fecha,id, token_id, id_anterior } = req.params;
    if( datas.name.token[token_id] ){
        var data = req.body;
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/updateFecha/'+id_fecha,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            if(data.success == true){
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:true,
                      data_p:data.message
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:true,
                      data_p:data.message
                    }
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
                res.redirect('/cuaderno/onlyfecha/'+id_fecha+'/'+id+'/'+token_id+'/'+id_anterior)
            }else{
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:false,
                      data_p:data.message
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:false,
                      data_p:data.message
                    }
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
                res.redirect('/cuaderno/onlyfecha/'+id_fecha+'/'+id+'/'+token_id+'/'+id_anterior)
            };
            setTimeout(()=>{
                remove(token_id)
            },1000);
        })  
    }else{
        res.redirect('/')
    }
})

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            RUTA PARA TURNOS 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/

router.get('/volver_a_trunos', (req,res) => {
    res.redirect('/cuaderno/turnos')
})

router.get('/turnos/:id_fechas/:token_id/:id_anterior/:id_volver_fechas', (req,res) => {
    const { id_fechas, token_id, id_anterior, id_volver_fechas } = req.params
    if( datas.name.token[token_id] ){
        fetch(url.name.cuadernos+'/api/oneTurno/'+id_fechas)
        .then(res => res.json())
        .then(resp => {
            console.log(resp, "   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   esto") 
            res.render('cuadernos/diasTurnos',{
                id_fechas,// este es el id para insertar en fechas
                id_anterior,// este es el id que me permite id a asignar doctor
                id_volver_fechas,// esto es el id que me permite ir a el rango de fechas o el contrato del doctor
                data_doc:datas.name.data_user[token_id],
                resp,
                msg:msg_Consulta_emergencia[token_id]
            });
        })
        .catch(error => {
            console.error('Error:', error)
            res.send("no hay coneccion con el servidor");
        }) 
    }else{
        res.redirect('/');
    }
   
})

router.post('/turnos/:id_fechas/:token_id/:id_anterior/:id_volver_fechas', (req,res) => {
    const { id_fechas, token_id, id_anterior, id_volver_fechas } = req.params
    if( datas.name.token[token_id] ){
        var data = {
            cantiFicha: req.body.cantiFicha,
            diasAten: req.body.diasAten,
            turno: req.body.turno
        };
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.cuadernos+'/api/turnos/'+id_fechas,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {   
            if(data.success == true){
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:true,
                      data_p:data.message
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:true,
                      data_p:data.message
                    }
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
            res.redirect('/cuaderno/turnos/'+id_fechas+'/'+token_id+'/'+id_anterior+'/'+id_volver_fechas)
            }else{
                if(msg_Consulta_emergencia[token_id] == null){
                    msg_p = {
                      success:false,
                      data_p:data.message
                    };
                    msg_data(msg_p,token_id);
                }else{
                    msg_p = {
                      success:false,
                      data_p:data.message
                    }
                    remove(token_id);
                    msg_data(msg_p,token_id);
                }
                res.redirect('/cuaderno/turnos/'+id_fechas+'/'+token_id+'/'+id_anterior+'/'+id_volver_fechas)
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        })  
    }else{
        res.redirect('/');
    }
})
router.get('/delturno/:id/:id_fechas/:token_id/:id_anterior/:id_volver_fechas', (req, res) => {
    const { id, id_fechas, token_id, id_anterior, id_volver_fechas }= req.params;
    if( datas.name.token[token_id] ){
        fetch('http://localhost:4600/api/delete/'+id)
        .then(resp => resp.json())
        .catch(error => console.error('Error:', error))
        .then(resp =>{
            res.redirect('/cuaderno/turnos/'+id_fechas+'/'+token_id+'/'+id_anterior+'/'+id_volver_fechas)
        });
    }else{
        res.redirect('/')
    }
});


  /* 
<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    rutas para especialidad consulta
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>><<<>>><<<>>><<>>><<>>><<<>>><<>><<<>>><<<>>><<<<
*/
//ruta para  especialidad consulta
var id_esp, oneEsp_consulta;

router.get('/one_null', (req,res) => {
    oneEsp_consulta = null
    res.redirect('/cuaderno/especialidad_consulta/'+id_esp)
})

router.get('/especialidad_consulta/:id_especialidad', (req,res) => {
    const { id_especialidad } = req.params;
    id_esp = id_especialidad;
    fetch('http://localhost:4600/api/list_EspCons/'+id_especialidad)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
        res.render('cuadernos/Especialidad_Consulta',{
            resp,
            id_especialidad,
            oneEsp_consulta
        });
    });
    
})

router.get('/one_consultaEsp/:id', (req,res) => {
    const { id } = req.params;
    fetch('http://localhost:4600/api/OneEspCons/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
        oneEsp_consulta = resp;
        res.redirect('/cuaderno/especialidad_consulta/'+id_esp)        
    });
})

//ruta para poder insertar en conaulta internacion
router.post('/reg_especialidad_consulta/:id_especialidad', (req,res) => {
    const { id_especialidad } = req.params
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.cuadernos+'/api/reg_consEsp/'+id_especialidad,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {   
        res.redirect('/cuaderno/especialidad_consulta/'+id_especialidad)
       
    })  
})

//ruta para poder actualizar especialidad consultorio
router.post('/update_consulta_especialidad/:id', (req,res) => {
    const { id } = req.params
    var data = req.body
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.cuadernos+'/api/modifyEspCons/'+id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {   
        res.redirect('/cuaderno/especialidad_consulta/'+id_esp)
       
    })  
})
/*
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        Ruta horarios de turno
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    
*/

var idTurno, turn;
router.get('/horarios_turnos/:id_turnos/:turno', (req,res) => {
    const { id_turnos, turno} = req.params
    idTurno = id_turnos;
    turn = turno;
    fetch('http://localhost:4600/api/listHoras_turno/'+id_turnos)
        .then(resp => resp.json())
        .catch(error => console.error('Error:', error))
        .then(resp =>{
            res.render('cuadernos/horarios_turnos',{
                resp
            })
    });  
})

    var hora = [];
    
    var numero = 1
    router.post('/insertarHorarios', (req,res) => {        
        var data = req.body
       
        if(turn == "Mañanas"){
            var horas = 8;
            var minutos = 0, num = data.minutos *1
            hora.push({h:horas+":"+minutos})
            for(var i = 0; i < data.cantiFicha - 1; i++){  
                if(horas == 12){
                    hora = []
                    res.send("Esa cantidad de fichas y el tiempo de atencion sobrepasa las 12 del medio dia")
                    
                }else{
                    if(minutos == 60){
                        minutos = 0
                        horas++  
                        hora.push({h:horas+":"+minutos})
                    }else {
                        minutos = minutos + num; 
                        if (minutos == 60){
                            minutos = 0
                            horas++
                        }
                        hora.push({h:horas+":"+minutos})
    
                    } 
                }                         
               

            }
        }else if(turn == "Tardes"){
            var horas = 14;
            var minutos = 0, num = data.minutos *1
            hora.push({h:horas+":"+minutos})
            for(var i = 0; i < data.cantiFicha - 1; i++){
                if(horas == 18) {
                    hora = []
                    res.send("se exedio")
                }else{
                    if(minutos == 60){
                        minutos = 0
                        horas++  
                        hora.push({h:horas+":"+minutos})
                    }else {
                        minutos = minutos + num; 
                        if (minutos == 60){
                            minutos = 0
                            horas++
                        }
                        hora.push({h:horas+":"+minutos})
    
                    } 
                }                          
               

            }
        }else{
            var horas = 18;
            var minutos = 0, num = data.minutos *1
            hora.push({h:horas+":"+minutos})
            for(var i = 0; i < data.cantiFicha - 1; i++){    
                if(horas == 22){
                    hora = []
                    res.send("se exedio en la cantidad de horas")
                } else{
                    if(minutos == 60){
                        minutos = 0
                        horas++  
                        hora.push({h:horas+":"+minutos})
                    }else {
                        minutos = minutos + num; 
                        if (minutos == 60){
                            minutos = 0
                            horas++
                        }
                        hora.push({h:horas+":"+minutos})
    
                    } 
                }                      
                

            }
        } 
        
        insertar(hora)        
        function insertar(hora1){ 
            fetch('http://localhost:4600/api/listHoras_turno/'+idTurno)
            .then(resp => resp.json())
            .catch(error => console.error('Error:', error))
            .then(resp =>{
                if(resp == ""){
                    for(var i = 0; i < hora1.length; i++){
                        
                        var data = {
                            hora : hora1[i].h
                        }
                        var esto = {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers:{
                              'Content-type' : "application/json"
                            }
                        };
                        fetch(url.name.cuadernos+'/api/hora_turno/'+idTurno,esto)
                        .then(res => res.json())
                        .catch(error => console.error('Error:', error))
                        .then(resp => { 
                        })
                        numero++  
                        if(hora1.length -1  == numero){   
                                              
                            hora = []
                            numero = 0
                            res.redirect('/cuaderno/horarios_turnos/'+idTurno+"/"+turn)
                        }else{
                            console.log("  esto ")
                        }  
                                             
                    }      
                }else{
                   res.send(" porfavor elimine las horas antes de volver a registrar ")
                } 
            });    
        } 
    }) 

router.get('/VUE_delete_horas/:id_hora', (req,res) => {
    const { id_hora } = req.params
    fetch('http://localhost:4600/api/delete_horas_turnos/'+id_hora)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
        res.status(200).json(resp)
    }); 
})

router.get('/de_paso',(req,res) => {
    fetch('http://localhost:4600/api/listHoras_turno/'+idTurno)
        .then(resp => resp.json())
        .catch(error => console.error('Error:', error))
        .then(resp =>{
            res.redirect('/cuaderno/horarios_turnos/'+idTurno+"/"+turn)
    });  
})

router.get('/horaslist', (req,res) => {

    fetch('http://localhost:4600/api/listHoras_turno/'+idTurno)
        .then(resp => resp.json())
        .catch(error => console.error('Error:', error))
        .then(resp =>{
            
            eliminar(resp)
            function eliminar(resp){
                for( var i = 0; i < resp.length; i++){
                    fetch('http://localhost:4600/api/delete_horas_turnos/'+resp[i].id)
                    .then(resp => resp.json())
                    .catch(error => console.error('Error:', error))
                    .then(resp =>{
                    }); 
                }
                
            }
            
    }); 
    res.redirect('/cuaderno/de_paso')   
})
 ///vue
 router.get('/Vuehoraturno/:id_turnos',(req,res)=>{
    const { id_turnos } = req.params
   fetch('http://localhost:4600/api/listHoras_turno/'+id_turnos)
       .then(resp => resp.json())
       .catch(error => console.error('Error:', error))
       .then(resp =>{
           res.status(200).json(resp)
   });  
})


router.post('/vuehora_turno/:id_turno', (req,res) => {
    const { id_turno } = req.params    
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.cuadernos+'/api/hora_turno/'+id_turno,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data)       
    })  
})

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            ruta para poder todos los datos de un doctor
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.get('/alldataDoctor/:id/:id_cuaderno', (req,res) => {
    const  { id,id_cuaderno } = req.params
    fetch('http://localhost:4600/api/docAllData/'+id)
        .then(resp => resp.json())
        .catch(error => console.error('Error:', error))
        .then(resp =>{
            res.render('cuadernos/dataDocAll',{
                resp,
                id_cuaderno
            })
    });
})

//ruta vue

// ruta para mostrar one cunsulta especialidad
router.get('/vue_one_consulta_especialidad/:id', (req, res) =>{
    const { id } = req.params;
    fetch('http://localhost:4600/api/OneEspCons/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
        res.status(200).json(resp)
    });
})
///* */
router.get('/vueCuaderno/:id', (req,res) => {
    const { id } = req.params;
    fetch('http://localhost:4600/api/docAllData/'+id)
    .then(resp => resp.json())
    .catch(error => console.error('Error:', error))
    .then(resp =>{
        res.status(200).json(resp)
    });
})

router.get('/VueDoctores/:id_cuaderno', (req,res) => {
    const { id_cuaderno } = req.params
    fetch(url.name.cuadernos+'/api/doctores/'+id_cuaderno)
    .then(res => res.json())
    .then(resp => { 
       res.status(200).json(resp);
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                             Reportes 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
router.get('/recuadernos/:token_id',(req, res) => {
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:4600/api/liscuaderno')        
        .then(resp => resp.json())
        .then(data =>{  
            res.render('reprtescuader', {
              data,
              data_doc:datas.name.data_user[token_id],
              filter: filter_ventas[token_id],
              filter1: filter_ventas1[token_id],
                msg:msg_Consulta_emergencia[token_id],
                
            })
        })
    }else{
        res.redirect('/')
    }
});
router.get('/general/:token_id', (req,res) =>{
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:4600/api/especialidad')        
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
router.get('/general1/:token_id', (req,res) =>{
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:4600/api/liscuaderno')        
        .then(resp => resp.json())
        .then(data =>{  
            res.render('reporAdmin/impriCu', {
                data,
                data_doc:datas.name.data_user[token_id]
            })
        })
    }else{
        res.redirect('/')
    }
})

router.get('/repespecialidad/:token_id',(req, res) => {
    const { token_id } = req.params
    if( datas.name.token[token_id] ){
        fetch('http://localhost:4600/api/especialidad')        
        .then(resp => resp.json())
        .then(data =>{  
            res.render('reporteespe', {
                data,
                data_doc:datas.name.data_user[token_id],
                filter: filter_ventas[token_id],
                
                msg:msg_Consulta_emergencia[token_id],
                
            })
        })
    }else{
        res.redirect('/')
    }
});
///////*****filtros */
var filter_ventas1= {}
function filter_cliente_ventas(data,id){
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

function remove_filter_data2(id) {
  delete filter_ventas1[id];
}

router.post ('/vue_filter_datas1', (req,res) => {
    var datos = req.body;  
       var esto = {
        method: 'post',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
      };
      fetch('http://localhost:4600/api/fitra_espe',esto)
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(data => {
        res.status(200).json(data)
      })
  })
///filter datas
router.post('/filter_datas1/:token_id', (req,res) => {
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
      fetch('http://localhost:4600/api/fitra_espe',esto)
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
            res.redirect('/cuaderno/recuadernos/'+token_id)
          }else{
            if(filter_ventas1[token_id] == null){
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
            remove_filter_data1(token_id)
            res.redirect('/cuaderno/recuadernos/'+token_id)
        }
      })
    }else{
      res.redirect('/');
    }
       
  })
  
  //<<<<<<<<<<<<<<<<<<<<<<<<<<
  //***filtrar cuadernos  */
  var filter_ventas ={}
function filter_cliente_ventas1(data,id){
    let storedItem = filter_ventas[id];
      if (!storedItem) {
        storedItem = filter_ventas[id] = {
          data: data,
          qty: 0
        };
      }
      storedItem.qty++;
  }
  
  function array_filter_data3 () {
    let arr = [];
    for (const id in filter_ventas) {
        arr.push(filter_ventas[id]);
    }
    return arr;
  }
  
  function remove_filter_data1(id) {
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
      fetch('http://localhost:4600/api/filtrar_cuader',esto)
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(data => {
        res.status(200).json(data)
      })
  })

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
      fetch('http://localhost:4600/api/filtrar_cuader',esto)
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
            remove_filter_data1(token_id)
            setTimeout(()=>{
              remove(token_id)
            },1000);   
            res.redirect('/cuaderno/recuadernos/'+token_id)
          }else{
            if(filter_ventas[token_id] == null){
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
            remove_filter_data2(token_id)
            res.redirect('/cuaderno/recuadernos/'+token_id)
        }
      })
    }else{
      res.redirect('/');
    }
       
  })
/////*** */
router.get('/Vue_Cuadernos', (req,res) => {

    fetch('http://localhost:4600/api/liscuaderno')        
    .then(resp => resp.json())
    .then( datas =>{
      res.status(200).json(datas)
    })
  
})
////////*** */
router.get('/Vue_Especialidades', (req,res) => {

    fetch('http://localhost:4600/api/list_consEsp')        
    .then(resp => resp.json())
    .then( datas =>{
      res.status(200).json(datas)
    })
  
})

/** */

module.exports = router;