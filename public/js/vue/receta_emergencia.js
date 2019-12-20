
const receta = new Vue({
    el: '#receta', 
    data : () => ({
        url:data_url,
        ocultar:false,
        buscar:'',

        id_consulta:'',

        data_msg:{
            msg_true:'',
            msg_false:''
        },
        
        lista:{
            id_medicamento:0,
            medicamento:'',
            dosis:'',
            frecuencia:'',
            duracion:'',
            cantidad:''
        },

        medicamentos:[],

        data_receta:{
            tipoConsulta:'',
            historiaClinica:'',
            fecha:'',
            doctor:'',
            unidades:23,
            id_medico:''
            
        },

        One_receta:'',
        dataReceta:'',
        receta_id:'',
    }),
    computed:{
        buscar_medicamentos(){
            return this.dataReceta.filter((item) => item.nombre.toLowerCase().includes(this.lista.medicamento.toLowerCase()))
        }
    },
    mounted(){
        this.data_receta.fecha = moment().format('l'); 
        fetch(this.url.url_front_end+'/emergencia2.0/vue_receta_emergencia/'+this.id_consulta)        
        .then(resp => resp.json())
        .then(data =>{  
            if (data != "") {
                this.One_receta = {
                    id:data[0].id,
                    estado:data[0].estado,
                    historiaClinica:data[0].historiaClinica,
                    fecha:data[0].fecha,
                    medicamentos:data[0].medicamentos,
    
                }
            }          
            
        })
        fetch(this.url.url_front_end+'/consulta_externa/medicamentos')
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
            this.dataReceta = data
        })
    },
    methods:{
        teclado(){
            console.log("teclado")
            this.lista.id_medicamento = 0
        },
        name_insert(name, id){
            console.log(name)
            this.lista.medicamento = name
            this.lista.id_medicamento = id
        },
        get_receta(){
            fetch(this.url.url_front_end+'/emergencia2.0/vue_receta_emergencia/'+this.id_consulta)        
            .then(resp => resp.json())
            .then(data =>{            
                this.One_receta = {
                    id:data[0].id,
                    estado:data[0].estado,
                    historiaClinica:data[0].historiaClinica,
                    fecha:data[0].fecha,
                    medicamentos:data[0].medicamentos,
                }
            })
        },
        insertar(){
            if(this.lista.medicamento == "" || this.lista.medicamento == undefined){
               
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte nombre del medicamento</label>',
                    'error'
                )
            }else if (this.lista.dosis == "" || this.lista.dosis == undefined){
                //this.data_msg.msg_false = "Inserte dosis"   
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte dosis</label>',
                    'error'
                )             
            }else if (this.lista.frecuencia == "" || this.lista.frecuencia == undefined){
                //this.data_msg.msg_false = "Inserte Frecuencia" 
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte frecuencia</label>',
                    'error'
                )  
            }else if (this.lista.duracion == "" || this.lista.duracion == undefined){
                //this.data_msg.msg_false = "Inserte duracion"   
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte duracion</label>',
                    'error'
                )               
            }else if(this.lista.cantidad == "" || this.lista.cantidad == undefined || isNaN(this.lista.cantidad) || this.lista.cantidad < 0){
                if(isNaN(this.lista.cantidad)){
                    //this.data_msg.msg_false = "Cantidad solo puede contener numeros"
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">Cantidad solo puede contener numeros</label>',
                        'error'
                    )
                }else if (this.lista.cantidad <= 0){ 
                    //this.data_msg.msg_false = "Inserte cantidad"
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">La cantidad no puede ser negativo</label>',
                        'error'
                    )
                }else if (this.lista.cantidad == "" || this.lista.cantidad == undefined ){
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">Inserte cantidad</label>',
                        'error'
                    )
                }               
            }else{
                if(this.lista.id_medicamento == 0){
                    this.medicamentos.push({
                        id:0,
                        medicamento:this.lista.medicamento,
                        dosis:this.lista.dosis,
                        frecuencia:this.lista.frecuencia,
                        duracion:this.lista.duracion,
                        cantidad:this.lista.cantidad
                    });
                    this.data_msg.msg_false = ""
                    this.lista = {};
                }else{
                    fetch(this.url.url_front_end+'/consulta_externa/vue_one_medicamentos/'+this.lista.id_medicamento)        
                    .then(resp => resp.json())
                    .then(data =>{  
                        
                        this.medicamentos.push({
                            id:data[0].id,
                            medicamento:data[0].nombre,
                            dosis:this.lista.dosis,
                            frecuencia:this.lista.frecuencia,
                            duracion:this.lista.duracion,
                            cantidad:this.lista.cantidad
                        });
                        console.log(this.medicamentos, " esto es <<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                        this.data_msg.msg_false = ""
                        this.lista = {};
                    })   
                }
            }   
        },
        eliminar(index){
            this.medicamentos.splice(index, 1)
        },
        post_recetas(e){
            e.preventDefault();
            if(this.medicamentos != ""){
                if(this.data_receta.fecha == "" ){
                    //this.data_msg.msg_false = "Inserte la fecha actual por favor"
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">Inserte la fecha actual por favor</label>',
                        'error'
                    )
                }else{
                    var data  = {
                        
                        historiaClinica:this.data_receta.historiaClinica,
                        fecha:this.data_receta.fecha,
                        tipoConsulta:"EMERGENCIA",
                        doctor:this.data_receta.doctor,
                        unidades:this.data_receta.unidades,
                        medicamentos:this.medicamentos,
                        id_medico:this.data_receta.id_medico
                    };
                    var esto = {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers:{
                          'Content-type' : "application/json"
                        }
                    };
                    fetch(this.url.url_front_end+'/emergencia2.0/Vue_receta/'+this.id_consulta,esto)
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(data => { 
                        console.log(data)
                        if(data.success == true){
                            swal.fire(
                                'Confirmar!',
                                '<label style="color:green;">'+ data.msg +'</label>',
                                'success'
                            )
                            this.medicamentos=[]
                            this.get_receta()
                        }else{
                            /* console.log(data)
                            this.data_msg.msg_false = data.msg */
                            swal.fire(
                                'Error!',
                                '<label style="color:red;">'+data.msg+'</label>',
                                'error'
                            ) 
                        }
                        
                    })   
                }                
            }else{
                //this.data_msg.msg_false = "Porfavor inserte medicamentos"
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Porfavor inserte medicamentos</label>',
                    'error'
                ) 
                console.log(this.data_msg.msg_false)
            }
                  
        },
        insertar_update(){
            if(this.lista.medicamento == "" || this.lista.medicamento == undefined){
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte nombre del medicamento</label>',
                    'error'
                )
            }else if (this.lista.dosis == "" || this.lista.dosis == undefined){
                this.data_msg.msg_false = "Inserte dosis"   
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte dosis</label>',
                    'error'
                  )             
            }else if (this.lista.frecuencia == "" || this.lista.frecuencia == undefined){
                //this.data_msg.msg_false = "Inserte Frecuencia"  
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte frecuencia</label>',
                    'error'
                  ) 
            }else if (this.lista.duracion == "" || this.lista.duracion == undefined){
                //this.data_msg.msg_false = "Inserte duracion"    
                swal.fire(
                    'Error!',
                    '<label style="color:red;">Inserte duracion</label>',
                    'error'
                )              
            }else if(this.lista.cantidad == "" || this.lista.cantidad == undefined || isNaN(this.lista.cantidad) || this.lista.cantidad < 0){
                if(isNaN(this.lista.cantidad)){
                    //this.data_msg.msg_false = "Cantidad solo puede contener numeros"
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">Cantidad solo puede contener numeros</label>',
                        'error'
                    )
                }else if (this.lista.cantidad <= 0){ 
                    //this.data_msg.msg_false = "Inserte cantidad"
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">La cantidad no puede ser negativo</label>',
                        'error'
                    )
                }else if (this.lista.cantidad == "" || this.lista.cantidad == undefined ){
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">Inserte cantidad</label>',
                        'error'
                    )
                }
            }else{
                if(this.lista.id_medicamento == 0){
                    this.One_receta.medicamentos.push({
                        id:0,
                        medicamento:this.lista.medicamento,
                        dosis:this.lista.dosis,
                        frecuencia:this.lista.frecuencia,
                        duracion:this.lista.duracion,
                        cantidad:this.lista.cantidad
                    });
                    this.data_msg.msg_false = ""
                    this.lista = {};
                }else{
                    
                    fetch(this.url.url_front_end+'/consulta_externa/vue_one_medicamentos/'+this.lista.id_medicamento)        
                    .then(resp => resp.json())
                    .then(data =>{  
                        
                        this.One_receta.medicamentos.push({
                            id:data[0].id,
                            medicamento:data[0].nombre,
                            dosis:this.lista.dosis,
                            frecuencia:this.lista.frecuencia,
                            duracion:this.lista.duracion,
                            cantidad:this.lista.cantidad
                        });
                        
                        this.data_msg.msg_false = ""
                        this.lista = {};
                    })
                }
                
            }  
           /*  this.One_receta.medicamentos.push({
                medicamento:this.lista.medicamento,
                dosis:this.lista.dosis,
                frecuencia:this.lista.frecuencia,
                duracion:this.lista.duracion
            });

            this.lista = {}; */
        },
        eliminar_update(index){
            this.One_receta.medicamentos.splice(index, 1)
        },
        update_recedta(e){
            console.log ("clikc")
            e.preventDefault();
            if(this.One_receta.medicamentos == ""){
               /*  this.data_msg.msg_true = ""
                this.data_msg.msg_false = "La lista de meciamentos no puede ser vacio" */
                swal.fire(
                    'Error!',
                    '<label style="color:red;">La lista de meciamentos no puede ser vacio</label>',
                    'error'
                )
            }else{            
                var data  = {            
                    estado:true,    
                    medicamentos:this.One_receta.medicamentos
                }
                var esto = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{
                      'Content-type' : "application/json"
                    }
                };
                fetch(this.url.url_front_end+'/consulta_externa/VueupdateReceta/'+this.One_receta.id,esto)
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(data => { 
                    console.log(data)
                    if(data.success == true){
                       /*  this.data_msg.msg_true = data.msg
                        this.data_msg.msg_false = "" */
                        swal.fire(
                            'Confirmar!',
                            '<label style="color:green;">'+ data.msg +'</label>',
                            'success'
                        )
                        this.get_receta()
                    }else{
                        //this.data_msg.msg_false = "Algo salio mal no se pudo actualizar la receta"
                        swal.fire(
                            'Error!',
                            '<label style="color:red;">'+ data.msg +'</label>',
                            'error'
                        )
                    }
                }) 
            }  
        },
        one_receta_id(id_receta){
            fetch(this.url.url_front_end+'/consulta_externa/Vue_one_receta_id/'+id_receta)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => { 
                this.receta_id = data[0]
            })
        }
        
    }
})