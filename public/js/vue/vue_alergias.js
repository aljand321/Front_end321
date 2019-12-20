const alergias = new Vue({
    el:"#alergias",
    data:{
        url:data_url.url_front_end,
        msg: "aljand",
        id_paciente:'',
        id_medico:'',
        msg:'',
        msg_false:'',

        fecha_registro:'',
        tipoAlergia:'',
        descripcion:'',

        alergias_list:{},
        oneAlergia:'',
        idAlergia:''
    },
    mounted(){
        this.fecha_registro = moment().format('l'); 
        fetch(this.url+'/datos_generales_paciente/vue_list_alergias/'+this.id_paciente)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {
            this.alergias_list = data
            console.log(this.alergias_list, " esto es lo quiero ver")
        })
    },
    methods:{
        //registrar alergias
        reg_alergias(e){
            e.preventDefault();
            var data = {
                fecha_registro:this.fecha_registro,
                tipoAlergia:this.tipoAlergia,
                descripcion:this.descripcion,
                id_user:this.id_medico
            };
            var esto = {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/datos_generales_paciente/vue_reg_alergias/'+this.id_paciente,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
                if(data.success == true){
                    swal.fire(                  //esto
                        'Confirmado!',
                        '<label style="color:green;">'+ data.msg +'</label>',
                        'success'
                      )
                    this.tipoAlergia = ""
                    this.descripcion = ""
                    this.msg = data.msg
                    this.msg_false = ""
                    this.lista_alergias()
                }else{
                    this.msg_false = data.msg
                    this.msg = ""
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">'+data.msg+'</label>',
                        'error'
                    )
                }
            })
        },
        //lista de alergias
        lista_alergias(){
            fetch(this.url+'/datos_generales_paciente/vue_list_alergias/'+this.id_paciente)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
                this.alergias_list = data
                console.log(this.alergias_list, " esto es lo quiero ver")
            })
        },
        //para mostrar una sola alergia
        one_alergia(id_alergia){
            this.idAlergia = id_alergia;
            fetch(this.url+'/datos_generales_paciente/vue_one_alergia/'+id_alergia)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
                this.oneAlergia = data[0]               
            })
        },
        //actualizar alergia
        update_alergia(e){
            e.preventDefault();
            var data = {     
                tipoAlergia:this.oneAlergia.tipoAlergia,
                descripcion:this.oneAlergia.descripcion               
            };
            var esto = {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url+'/datos_generales_paciente/Vue_updateAlergia/'+this.idAlergia,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
                if(data.success == true){
                    swal.fire(                  //esto
                        'Confirmado!',
                        '<label style="color:green;">'+ data.msg +'</label>',
                        'success'
                      )
                    this.msg = data.msg
                    this.msg_false = ""
                    this.one_alergia(this.idAlergia)
                    this.lista_alergias()                    
                }else{
                    this.msg_false = data.msg
                    this.msg = ""
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">'+data.msg+'</label>',
                        'error'
                      )
                }
            })
        }
    }
})