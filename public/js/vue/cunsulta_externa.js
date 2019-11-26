

const m = moment()
console.log(m.format("dddd MMMM Mo YYYY"), " <<<<<<<<<<<<<<<<")
const consulta = new Vue({
    el:"#consulta",
    data:() => ({
        url:data_url.url_front_end,
        id_hora:'',


        msg:"",
        msg_false:"",

        //register data
        id_cita:'',
        tipoConsulta:'',
        fechaConsulta:'',
        numeroHistorial:'',

        anamnesis:'',       
        tratamiento:'',
        observaciones:'',

        id_medico:'',

        //list diagnostico
        data:'A00',
        lista:[],

        diagnostico:[],
        c_edad:'',
        edad:'',

        consulta_update:{},
        paciente_data:{},
        id_paciente:'',

        msg_paciente:'',
        msg_false_paciente:'',
    }),
    
    mounted(){
       
        fetch(this.url+'/consulta_externa/vue_diagnosticos')        
        .then(resp => resp.json())
        .then( diagnostico =>{
            this.lista = diagnostico
        })  

        var edad=moment(this.c_edad), hoy=moment()
        var anios=hoy.diff(edad,"years")
        this.edad = anios
        this.fechaConsulta = moment().format('l'); 

        fetch(this.url+'/consulta_externa/VUE_data_update_consulta/'+this.id_cita)
        .then(resp => resp.json())
        .then(resp =>{
            this.consulta_update =  resp[0];
        })
    },
   
    methods:{

        //datos del paciente
        data_paciente(){
            fetch(this.url+'/consulta_externa/vue_data_pacinte/'+this.numeroHistorial)
            .then(resp => resp.json())
            .then(dataPaciente =>{
                this.id_paciente = dataPaciente[0].id
                if(dataPaciente[0].estadocivil == null || dataPaciente[0].ocupacion == null || dataPaciente[0].zona == null || dataPaciente[0].telef == null){
                    this.paciente_data = {
                        estadocivil:dataPaciente[0].estadocivil,
                        ocupacion:dataPaciente[0].ocupacion,
                        zona:dataPaciente[0].zona,
                        telef:dataPaciente[0].telef
                    }
                    console.log( this.paciente_data, "    <<<<<<<<<<<<< esto es lo que quiero ver")
                }else{
                    this.paciente_data =null
                    console.log( this.paciente_data, "    ya hay datos")
                }
               
                
            })
        },

        updateDataPaciente(e){
            e.preventDefault();
            var data = {
                estadocivil:this.paciente_data.estadocivil,
                ocupacion:this.paciente_data.ocupacion,
                zona:this.paciente_data.zona,
                telef:this.paciente_data.telef
            };
            var esto = {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/consulta_externa/vue_update_paciente_data/'+this.id_paciente,esto)
            .then(res => res.json())
            .then(data => {
                if(data.success == true){
                    swal.fire(                  //esto
                        'Success!',
                        '<label style="color:green;">'+ data.msg +'</label>',
                        'success'
                      )

                    this.msg_paciente = data.msg
                    this.msg_false_paciente = ""
                }else{
                    this.msg_false_paciente = data.msg
                    this.msg_paciente = ""
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">'+data.msg+'</label>',
                        'error'
                      )
                }
            })
            
        },

        data_update_consulta(){
            fetch(this.url+'/consulta_externa/VUE_data_update_consulta/'+this.id_cita)
            .then(resp => resp.json())
            .then(resp =>{
                this.consulta_update =  resp[0];
            })
        },

        //para insertar diagnosticos
        insertar(codigo){
            fetch(this.url+'/consulta_externa/vue_diagnostico_codigo/'+codigo)        
            .then(resp => resp.json())
            .then( data =>{ 
                var data
                if(this.diagnostico == "" || this.diagnostico == null || this.diagnostico.length  == 0 ){
                    console.log(data[0].codigo,data[0].descripcion)
                    var c =data[0].codigo, d = data[0].descripcion
                    this.diagnostico.push({
                        codigo:c,
                        descripcion:d,
                        observaciones:''
                    })
                    console.log(this.diagnostico, "  <<< esto es lo que quiero ver 11111111")
                }else{

                    for(var i = 0; i < this.diagnostico.length; i++){
                        if (this.diagnostico[i].codigo == data[0].codigo){
                            console.log(this.diagnostico[i].codigo ,"no puede haver dos diagnosticos del mismo tipo")
                            data = false
                        }
                    }
                    if(data != false){
                        console.log(data[0].codigo,data[0].descripcion)
                        var c =data[0].codigo, d = data[0].descripcion
                        this.diagnostico.push({
                            codigo:c,
                            descripcion:d,
                            observaciones:''
                        })
                        console.log(this.diagnostico, "  <<< esto es lo que quiero ver 22222222222")
                        data = ""
                    }
                }
               
                
            })
        },
        eliminarDiag(index){
            this.diagnostico.splice(index,1)
        },


        // para poder insertar a daignosticos desde update
        insertar_update(codigo){
            fetch(this.url+'/consulta_externa/vue_diagnostico_codigo/'+codigo)        
            .then(resp => resp.json())
            .then( data =>{ 
                var data
                if(this.consulta_update.diagnostico == "" || this.consulta_update.diagnostico == null || this.consulta_update.diagnostico.length  == 0 ){
                    console.log(data[0].codigo,data[0].descripcion)
                    var c =data[0].codigo, d = data[0].descripcion
                    this.consulta_update.diagnostico.push({
                        codigo:c,
                        descripcion:d,
                        observaciones:''
                    })
                    console.log(this.consulta_update.diagnostico, "  <<< esto es lo que quiero ver 11111111")
                }else{

                    for(var i = 0; i < this.consulta_update.diagnostico.length; i++){
                        if (this.consulta_update.diagnostico[i].codigo == data[0].codigo){
                            console.log(this.consulta_update.diagnostico[i].codigo ,"no puede haver dos diagnosticos del mismo tipo")
                            data = false
                        }
                    }
                    if(data != false){
                        console.log(data[0].codigo,data[0].descripcion)
                        var c =data[0].codigo, d = data[0].descripcion
                        this.consulta_update.diagnostico.push({
                            codigo:c,
                            descripcion:d,
                            observaciones:''
                        })
                        console.log(this.consulta_update.diagnostico, "  <<< esto es lo que quiero ver 22222222222")
                        data = ""
                    }
                }
               
                
            })
        },
        eliminarDiag_update(index){
            this.consulta_update.diagnostico.splice(index,1)
        },


        reg_consulta(e){
            e.preventDefault();

            var data = {
                tipoConsulta:this.tipoConsulta,
                fechaConsulta:this.fechaConsulta,
                numeroHistorial:this.numeroHistorial,
        
                anamnesis:this.anamnesis, 
                diagnostico:this.diagnostico,      
                tratamiento:this.tratamiento,
                observaciones:this.observaciones,
        
                id_medico:this.id_medico,
            };
            var esto = {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/consulta_externa/VUE_reg_consulta_externa/'+this.id_cita,esto)
            .then(res => res.json())
            .then(data => {
                if(data.success == true){
                    this.msg = data.msg
                    swal.fire(                  //esto
                        'Success!',
                        '<label style="color:green;">'+ data.msg +'</label>',
                        'success'
                      )
                    this.anamnesis = "" 
                    this.diagnostico = ""      
                    this.tratamiento = ""
                    this.observaciones = ""
                    this.msg_false = ""
                    this.update_hora()
                    this.update_estado_cita()
                    this.data_update_consulta()
                }else{
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">'+data.msg+'</label>',
                        'error'
                      )
                }
            })
        },

        update_hora(){
            
            var estado = {
                estado: "atendido"
            }
            var esto = {
                method: 'POST',
                body: JSON.stringify(estado),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/consulta_externa/Vue_update_hora/'+this.id_hora,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(resp => {
              console.log(resp, " esto es la respuesta que quiero ver ")
            })
        },
        update_estado_cita(){

            fetch(this.url+'/consulta_externa/vue_estado_cita/'+this.id_cita)
            .then(resp => resp.json())
            .then(resp =>{
                console.log(resp, " estado respuesta")
            })
        },

        update_consulta(e){
            e.preventDefault();

            var estado = {
                estado_update: 'false',
                anamnesis:this.consulta_update.anamnesis, 
                diagnostico:this.consulta_update.diagnostico,      
                tratamiento:this.consulta_update.tratamiento,
                observaciones:this.consulta_update.observaciones,
            }
            var esto = {
                method: 'POST',
                body: JSON.stringify(estado),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/consulta_externa/vue_update_consulta/'+this.consulta_update.id,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(resp => {
                if(resp.success == true){
                    this.msg = resp.msg,
                    this.data_update_consulta()
                    this.msg_false = ""
                    swal.fire(
                        'Success!',
                        '<label style="color:green;">'+ resp.msg +'</label>',
                        'success'
                      )

                }else{
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">'+resp.msg+'</label>',
                        'error'
                      )
                }
            })
        }
        
    },
    computed:{
        buscar(){
           
            return this.lista.filter((item) => item.codigo.includes(this.data) || item.descripcion.includes(this.data))
           
        }
    },


})

/* para filtrar datos tutorial */

/* https://www.youtube.com/watch?v=eB17ef_TVrA */