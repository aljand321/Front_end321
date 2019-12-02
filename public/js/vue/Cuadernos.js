const cuadernos = new Vue({
    el:"#cuadernos",
    data:() => ({
        mensaje: " Hola ",
        url:data_url,
        fechas:[],
        id:'',
        Turnos:'',

        //esta parte es para el buscador
        buscar:{
            lists:[],
            name: ''
        },
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        nombre_consultorio:''
    }),
    methods:{
        mostrar(id){
            fetch(this.url.url_front_end+'/cuaderno/vueCuaderno/'+id)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.one_consultorio_externo(res[0].id_ConsultaEspecialidad)
                this.fechas = res[0].Fechas 
                this.turnosFechas()      
                  
            })
        },
        turnosFechas(){
            
            for(var i = 0; i < this.fechas.length; i++){
                if (this.fechas[i].id == this.id){  
                    
                    this.Turnos = this.fechas[i].Turnos
                    console.log(this.Turnos)
                }
            }
            
        },

        buscador(id){
            
            fetch(this.url.url_front_end+'/cuaderno/VueDoctores/'+id)
            .then(res => res.json())
            .then(res => {
               
                this.buscar.lists = res  
            })
        },
        deleteList(){
            this.buscar.lists = [];
        },
        one_consultorio_externo(id){
            fetch(this.url.url_front_end+'/cuaderno/vue_one_consulta_especialidad/'+id)
            .then(res => res.json())
            .then(res => {
                this.nombre_consultorio = res[0].nombre
                console.log(res, "  <<<<<<<<<<<<<<<<<<<<<<  asdasdasd ")
            })
        }
    },
    computed:{
        search(){
            return this.buscar.lists.filter((item) => item.nombre.includes(this.buscar.name));
        }
    },
    

})