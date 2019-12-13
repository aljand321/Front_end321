const roles = new Vue({
    el:"#roles",
    data: () => ({
        mensaje : "",
        mesaje_f:"",
        url:data_url,
        email:' esto ',
        roles: {
            nombre:"",
            apellidop:"",
            apellidom:"",
            ci:"",
            cargo:"",
            direcion:"",
            telefono: "",
            roles:{},
            rolUser: ""

        },

        id_personal:''
    }),
    methods:{
        traer(id){
            fetch(this.url.url_front_end+'/usuarios/roles/'+id)
            .then(res => res.json())
            .then(res => {  
                this.roles.nombre = res[0].nombre
                this.roles.apellidop   = res[0].apellidop
                this.roles.apellidom = res[0].apellidom
                this.roles.ci = res[0].ci
                this.roles.cargo = res[0].cargo
                this.roles.direcion = res[0].direcion
                this.roles.telefono = res[0].telefono
                this.roles.roles = res[0].Users           
            })
        },

        mostrar_roles(){
            for(var i = 0 ; i < this.roles.roles.length; i++){
                if( this.roles.roles[i].email == this.email){
                    
                    this.roles.rolUser = this.roles.roles[i].role[0].name
                }
            }
        },
    }
})