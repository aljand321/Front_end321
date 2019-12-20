const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');

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

var url = "http://localhost:3500/api";

router.get('/volver', (req,res) => {
    oneGrupoAsig = null
    res.redirect('/medicamento/dataGrupoA'); 
})

router.get('/volver2', (req,res) => {
    res.redirect('/medicamento/dataGrupoA'); 
})
router.get('/volver3/:id/:token_id/:token_part', (req,res) => {
    const { id, token_id, token_part } = req.params
    res.redirect('/medicamento/medFecha_cantidad/'+id+'/'+token_id+'/'+token_part); 
})
//var dataGRUPOa;
router.get('/medicamentos/:token_id/:token_part',(req,res) =>{
    const { token_id, token_part } = req.params;
    fetch('http://localhost:3600/api/user/'+token_id)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {

        if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
            var status
            for(var i = 0; i < resp.role.length; i++ ){
                if(resp.role[i].name == "Almacen"){
                    status = "tiene permiso"
                }
            } 
            if(status == "tiene permiso"){ 
                fetch('http://localhost:3500/api/asignacion')   
                .then(resp => resp.json())
                .then(dataGRUPOa =>{

                    fetch('http://localhost:3500/api/medicamento')   
                    .then(resp => resp.json())
                    .then(resp =>{
                        res.render('Almacen/medicamentos',{
                            dataGRUPOa,
                            data_doc:datas.name.data_user[token_id], 
                            resp,
                            OnlyMedicamento:update_medicamento[token_id],
                            msg:msg_Consulta_emergencia[token_id]
                        })  
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

        }else{
            res.redirect('/')
        }

    })
    .catch(error => {
        console.log(error);
        res.send({
            msg: "no hay coneccion con el servidor 3600",
            error
        })
    })
});

//serv para renderisar la vista medicamento con datos de la tabla grupo asignacion
router.get('/volver15/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params;
    remove_one_med(token_id);
    res.redirect('/medicamento/medicamentos/'+token_id+'/'+token_part);
})


//servcio para añadir a la tabla medicamentos
router.post('/medicamentos/:token_id/:token_part', (req,res) =>{
    const { token_id, token_part } = req.params;

    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        var data = req.body;
        var msg_p;
        var esto = {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-type' : "application/json"
          }
        };
        fetch('http://localhost:3500/api/medicamento',esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {

          if(data.success == false){
            if(msg_Consulta_emergencia[token_id] == null){
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
            res.redirect( '/medicamento/medicamentos/'+token_id+'/'+token_part );
             
          }else{
            if(msg_Consulta_emergencia[token_id] == null){
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
            res.redirect( '/medicamento/medicamentos/'+token_id+'/'+token_part );     
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
var update_medicamento = {}
function one_med(data,id){
  let storedItem = update_medicamento[id];
    if (!storedItem) {
      storedItem = update_medicamento[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array3 () {
  let arr = [];
  for (const id in update_medicamento) {
      arr.push(update_medicamento[id]);
  }
  return arr;
}

function remove_one_med(id) {
  delete update_medicamento[id];
}

//serv para mostrar un solo medicamento
router.get('/OnlyMedicamento/:id/:token_id/:token_part',(req, res) =>{
    const { id, token_id, token_part } = req.params;
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        fetch('http://localhost:3500/api/OnlyMedicamento/'+id)   
        .then(resp => resp.json())
        .then(resp =>{
            if(update_medicamento[token_id] == null){
                one_med(resp, token_id)
                res.redirect('/medicamento/medicamentos/'+token_id+'/'+token_part)                
            }else{
                remove_one_med(token_id)
                one_med(resp, token_id)
                res.redirect('/medicamento/medicamentos/'+token_id+'/'+token_part)                
            }
            setTimeout(()=>{
                remove_one_med(token_id)
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

router.post('/updateMedicamento/:id/:token_id/:token_part', (req,res) =>{
    const { id, token_id, token_part } = req.params;
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_part){
        console.log(req.body, " esto es lo que quiero ve <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ffffffffffffffffffffffffffffff")
        var data = req.body;
        var msg_p;
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url+'/updateMedicamento/'+id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            if ( data.success == false ){
                if(msg_Consulta_emergencia[token_id] == null){
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
                res.redirect('/medicamento/OnlyMedicamento/'+id+'/'+token_id+'/'+token_part);
            }else{
                if(msg_Consulta_emergencia[token_id] == null){
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
                res.redirect('/medicamento/OnlyMedicamento/'+id+'/'+token_id+'/'+token_part);
            }
            setTimeout(()=>{
                remove(token_id)
            },1000);
        })
    }else{
        res.redirect('/')
    }
});

/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>><<<<<>><<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<>>>>>>>><<<<<<<<<<<<<<<<<<<<<<
                Stock
<<<<<<<<<<<>>>>>>>>>>>>>>><<<<>><<<>>><<<><<<>><<<
<<<<<<<<<>>><<>>>>>>>>>>>>>>>>>>>>>>>><>>>>>>>>>><
*/

router.get('/stock/:token_id/:token_part', (req,res) => {
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
                    res.render('Almacen/stock_almacen',{
                        resp,
                        data_doc:datas.name.data_user[token_id]
                    })              
                })
                .catch(error => {
                    console.error('Error:', error)
                    res.send("no hay coneccion con el servidor");
                })
                status = null;
            }else{
                res.redirect('/');
            }
        });
        
    }else{
        res.redirect('/');
    }
})


//rutas para cantida y fecha de medicamentos

router.get('/medFecha_cantidad/:id_medicamento/:token_id/:token_part', (req,res) => {
    const { id_medicamento, token_id, token_part } = req.params
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
                fetch('http://localhost:3500/api/listMedicamentos/'+id_medicamento)   
                .then(resp => resp.json())
                .then(resp =>{         
                    res.render('Almacen/med_fecha_cantidad',{
                        resp,
                        data_doc:datas.name.data_user[token_id],
                        id_medicamento
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
        res.redirect('/')
    }   
})

module.exports = router;