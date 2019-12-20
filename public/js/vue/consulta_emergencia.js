const consulta_emergencia = new Vue({
    el:"#consulta_emergencia",
    data:() => ({
        url:data_url.url_front_end,
        msg:'aljand321',
        one_consulta:'',
        
        hora:'',

        fechaAtencion:'',
        Nhistorial:'',
        nombreDoctor:'',
        motivoConsulta:'',
        diagnostico:[],
        tratamiento:'',
        observaciones:'',
        idCita:'',
        idDoctor:'',

        one_cita_emergencia:'',
        data:'A00',
        lista:[]
        
    }),
    mounted(){
        this.fechaAtencion =  moment().format('l');       
        fetch(this.url+'/consulta_externa/vue_diagnosticos')        
        .then(resp => resp.json())
        .then( diagnostico =>{
            this.lista = diagnostico
        }) 
        
        //one cita emergencia
        fetch(this.url+'/emergencia2.0/Vue_one_emergencia/'+this.idCita)        
        .then(resp => resp.json())
        .then( one_emergencia =>{
            console.log(one_emergencia, "  esto es lo que quiero ver <<<<<<<<<<<<<>>><<<<><<>>><<<><<<<>><<<>>>")
            this.one_cita_emergencia = one_emergencia[0]
        }) 
    },
    computed:{
        buscar(){           
            return this.lista.filter((item) => item.codigo.toLowerCase().includes(this.data) || item.descripcion.includes(this.data.toLowerCase()))           
        }
    },
    methods:{
        insertar(codigo){
            fetch(this.url+'/consulta_externa/vue_diagnostico_codigo/'+codigo)        
            .then(resp => resp.json())
            .then( data =>{ 
                var data1
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
                            console.log(this.diagnostico[i].codigo ,"No puede haber dos diagnósticos del mismo tipo")
                            data1 = false
                        }
                    }
                    if(data1 != false){
                        console.log(data[0].codigo,data[0].descripcion)
                        var c =data[0].codigo, d = data[0].descripcion
                        this.diagnostico.push({
                            codigo:c,
                            descripcion:d,
                            observaciones:''
                        })
                        console.log(this.diagnostico, "  <<< esto es lo que quiero ver 22222222222")
                        data1 = ""
                    }
                }
               
                
            })
        },
        eliminarDiag(index){
            this.diagnostico.splice(index,1)
        },
        One_consulta(id){
            fetch(this.url+'/emergencia2.0/Vue_emergenciaP/'+id)
            .then(resp => resp.json())
            .then(resp =>{
                console.log(resp)
                this.one_consulta ={
                    Nhistorial:resp[0].Nhistorial,
                    nombreDoctor:resp[0].nombreDoctor,
                    apellidoD1:resp[0].apellidoD1,
                    apellidoD2:resp[0].apellidoD2,
                    motivoConsulta:resp[0].motivoConsulta,
                    diagnostico:resp[0].diagnostico,
                    tratamiento:resp[0].tratamiento,
                    observaciones:resp[0].observaciones,
                    nombre:resp[0].Citas_Medica.Paciente.nombre,
                    apellidop:resp[0].Citas_Medica.Paciente.apellidop,
                    apellidom:resp[0].Citas_Medica.Paciente.apellidom,
                    fechanacimiento:resp[0].Citas_Medica.Paciente.fechanacimiento,
                    sexo:resp[0].Citas_Medica.Paciente.sexo
                }
                console.log(this.one_consulta)
            })
        },
        registrar_emeregencia(e){
            console.log("click  <<< ")
            e.preventDefault();
           
            var estado = {
                fechaAtencion: this.fechaAtencion,
                Nhistorial:this.Nhistorial,
                nombreDoctor:this.nombreDoctor,
                motivoConsulta:this.motivoConsulta,
                diagnostico:this.diagnostico,
                tratamiento:this.tratamiento,
                observaciones:this.observaciones,
                idDoctor:this.idDoctor,
                //hora:this.hora
            }
            var esto = {
                method: 'POST',
                body: JSON.stringify(estado),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/emergencia2.0/Vue_register_cita_emergencia/'+this.idCita,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(resp => {
               
                if (resp.success == true){
                    swal.fire(
                        'Confirmado',
                        '<label style="color:green;">'+ resp.msg +'</label>',
                        'success'
                    )
                    this.one_emregencia();
                    this.update_estado();
                    this.upadte_hora();
                    /* setTimeout(()=>{
                        this.update_cita(e);
                    },10000); */
                }else{
                    swal.fire(
                        'Error',
                        '<label style="color:red;">'+resp.msg+'</label>',
                        'error'
                    )
                }
            })
        },
        // esta fucion es para mostrar el registro de la consulta de emergencia
        one_emregencia(){
            fetch(this.url+'/emergencia2.0/Vue_one_emergencia/'+this.idCita)        
            .then(resp => resp.json())
            .then( one_emergencia =>{
                console.log(one_emergencia, "  esto es lo que quiero ver <<<<<<<<<<<<<>>><<<<><<>>><<<><<<<>><<<>>>")
                this.one_cita_emergencia = one_emergencia[0]
            }) 
        },
        //funcion para actualizar el estado de la hora
        upadte_hora(){
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
            fetch(this.url+'/emergencia2.0/Vue_upadte_hora/'+this.hora.split("/")[1],esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(resp => {
                console.log(resp, " Esto es la respuesta de la hora del estado")
            })
        }, 
        
        update_estado(){
            fetch(this.url+'/emergencia2.0/Vue_estado/'+this.idCita)        
            .then(resp => resp.json())
            .then( resp =>{
                console.log(resp, "esto es el estado de la cita")
            })
        },

        update_cita(e){
            e.preventDefault();
            var estado = {                
                motivoConsulta:this.one_cita_emergencia.motivoConsulta,
                diagnostico:this.one_cita_emergencia.diagnostico,
                tratamiento:this.one_cita_emergencia.tratamiento,
                observaciones:this.one_cita_emergencia.observaciones,
            }
            var esto = {
                method: 'POST',
                body: JSON.stringify(estado),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/emergencia2.0/vue_estado_cita/'+this.one_cita_emergencia.id,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(resp => {
               
                if (resp.success == true){
                    swal.fire(
                        'Confirmado',
                        '<label style="color:green;">'+ resp.msg +'</label>',
                        'success'
                    )
                    this.one_emregencia();
                    
                }else{
                    swal.fire(
                        'Error',
                        '<label style="color:red;">'+resp.msg+'</label>',
                        'error'
                    )
                }
            })
        },
        insertar_update(codigo){
            fetch(this.url+'/consulta_externa/vue_diagnostico_codigo/'+codigo)        
            .then(resp => resp.json())
            .then( data =>{ 
                var data
                if(this.one_cita_emergencia.diagnostico == "" || this.one_cita_emergencia.diagnostico == null || this.one_cita_emergencia.diagnostico.length  == 0 ){
                    console.log(data[0].codigo,data[0].descripcion)
                    var c =data[0].codigo, d = data[0].descripcion
                    this.one_cita_emergencia.diagnostico.push({
                        codigo:c,
                        descripcion:d,
                        observaciones:''
                    })
                    console.log(this.one_cita_emergencia.diagnostico, "  <<< esto es lo que quiero ver 11111111")
                }else{

                    for(var i = 0; i < this.one_cita_emergencia.diagnostico.length; i++){
                        if (this.one_cita_emergencia.diagnostico[i].codigo == data[0].codigo){
                            console.log(this.one_cita_emergencia.diagnostico[i].codigo ,"No puede haber dos diagnósticos del mismo tipo")
                            data = false
                        }
                    }
                    if(data != false){
                        console.log(data[0].codigo,data[0].descripcion)
                        var c =data[0].codigo, d = data[0].descripcion
                        this.one_cita_emergencia.diagnostico.push({
                            codigo:c,
                            descripcion:d,
                            observaciones:''
                        })
                        console.log(this.one_cita_emergencia.diagnostico, "  <<< esto es lo que quiero ver 22222222222")
                        data = ""
                    }
                }
               
                
            })
        },
        eliminarDiag_update(index){
            this.one_cita_emergencia.diagnostico.splice(index,1)
        },
    }
})
