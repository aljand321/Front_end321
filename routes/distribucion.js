const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');
var url = require('./url/export');

router.get('/volver/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params;
    res.redirect('/distribucion/listDistribucion/'+token_id+'/'+token_part); 
})

router.get('/volver2/:token_id/:token_part', (req,res) => {
    const { token_id, token_part } = req.params;
    res.redirect('/distribucion/nueva_distribucion/'+token_id+'/'+token_part); 
})
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    Vue rutas
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/

//ruta para traer el medicamento
router.get('/vueMedicamento', (req,res) => {
    fetch(url.name.urlFarmacia+'/api/mostrar_lista_med')
    .then(res => res.json())
    .then(resp => { 
       res.status(200).json(resp);
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
})

router.post('/vueMedicamento',(req,res) => {
    var data = req.body
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.urlFarmacia+'/api/distribucion',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
      res.status(200).json(data);
         
    })   
})

//ruta para mostrar todas las distribucion
router.get('/vueDistribucion', (req,res) => {
    fetch(url.name.urlFarmacia+'/api/distribucion')
    .then(res => res.json())
    .then(resp => { 
       res.status(200).json(resp);
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })  
})

//esta ruta es para reducir los datos son mandados des vue distribucion
router.post('/vueReduceStock', (req,res) => {
    var productos = req.body
    console.log(productos, "  <<<<<<<<<<<<<<<<<<<<<<  esto es la cantidad")
    for(var i = 0; i< productos.producto.length; i++){
        var unidades = { unidades: productos.producto[i].qty}
        var esto = {
            method: 'POST',
            body: JSON.stringify(unidades),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.urlFarmacia+'/api/reduce/'+productos.producto[i].item.id,esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            res.status(200).json({
                msg: " Exito",
                data
            })        
        }) 
    }     
})

///ruta para poder actualizar la cantidad_unidad de fechas 
router.post('/Vue_reduce_cantidad_fecha/:id', (req,res) => {
    const { id } = req.params;
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url.name.urlFarmacia+'/api/reduce_fecha_cantidad/'+id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
        res.status(200).json(data);
    })
})


/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

/* router.get ('/limpiar',(req,res) => {
    onlyDist = null
    res.redirect('/distribucion/distribucion');
}); */
// este serv sirve para mandar una sola distribucion
router.get('/onlyDist/:id', (req,res) => {
    const { id } = req.params;
    fetch(url.name.urlFarmacia+'/api/onlyDist/'+id)
    .then(res => res.json())
    .then(resp => {
        res.status(200).json(resp)
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    }) 
}) 

//serv para listar las distribuciones
router.get('/listDistribucion/:token_id/:token_part', (req,res) => {
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
                fetch(url.name.urlFarmacia+'/api/distribucion')
                .then(res => res.json())
                .catch(error => console.error('Error',error))
                .then(resp => { 
                
                    fetch('http://localhost:3200/api/list_pedidos') // est fecth es para mostrar la lista de pedids de farmacia que hace a almancen
                    .then(resp => resp.json())
                    .catch(error => console.error('Error',error))
                    .then(lis_farmacia_pedidos => {
                        res.render('Almacen/distribucion',{
                            resp,
                            lis_farmacia_pedidos,
                            data_doc:datas.name.data_user[token_id]
                        })
                    })
                    
                })
                status = null
            }else{
                res.redirect('/');
            }
        })
       
    }else{
        res.redirect('/');
    }
})

//ruta para pedidos  de farmacia
//serv para enviar distribucion
var message;
router.post('/distribucion', (req,res) => {
    if (generateArray() != "" ){
        var data = {
            codigo : req.body.codigo,
            responsable: req.body.responsable,
            recibe: req.body.recibe,
            fechaLlegada: req.body.fechaLlegada,
            productos:  generateArray()
        }
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(url.name.urlFarmacia+'/api/distribucion',esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
          res.redirect('/distribucion/Medicamento_Reduce'); 
          message = null;       
        })   
    }else {
        message = " No se seleciono nada para la distribucion ";
        res.redirect('/distribucion/listDistribucion');      
    }
})
//rutas de nueva  distribucion

router.get('/nueva_distribucion/:token_id/:token_part', (req,res) => {
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
                res.render('Almacen/reg_distribucion',{
                    data_doc:datas.name.data_user[token_id]
                })
                status = null
            }else{
                res.redirect('/');
            }  
        })
       
    }else{
        res.redirect('/');
    }
})



module.exports = router;