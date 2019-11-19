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
    },
    computed:{
        buscar(){           
            return this.lista.filter((item) => item.codigo.includes(this.data) || item.descripcion.includes(this.data))           
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
                            console.log(this.diagnostico[i].codigo ,"no puede haver dos diagnosticos del mismo tipo")
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
            fetch('http://localhost:3000/api/EmergenciaP/'+id)
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
        registrar_emeregencia(){
            e.preventDefault();
            var estado = {
                fechaAtencion: this.fechaAtencion,
                Nhistorial:this.Nhistorial,
                nombreDoctor:this.nombreDoctor,
                motivoConsulta:this.motivoConsulta,
                diagnostico:this.diagnostico,
                tratamiento:this.tratamiento,
                observaciones:this.observaciones,
                idDoctor:this.idDoctor
            }
            var esto = {
                method: 'POST',
                body: JSON.stringify(estado),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/consulta_externa//',esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(resp => {
                if (resp.success == true){
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
    }
})
