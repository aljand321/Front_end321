
const citas = new Vue({
    el:"#citas",
    data: () => ({ 
        url:data_url,

        dia:'Lunes',
        turno:'Mañanas',
        especialidades:'',
        doctores:[], 

        selectEsp:'',
        listCitas: '',        
        selectDoctor:'', // esto es para poder sacar el dato que desde doctor en aqui esta el id 
        
        horas_Turno:[],
        horas_Turno_reservado:[],
        horas_Turno_atendido:[],
        arr:[]
    }),
    
    mounted(){
        axios
        .get(this.url.url_front_end+'/paciente/vueEspecialidades_consulta/')
        .then(response => (
          this.especialidades = response.data
        ))
        
    },
    methods:{
      especilida(){
        if(this.selectEsp != ""){        
          axios
          .get(this.url.url_front_end+'/paciente/vueDoctores/'+this.selectEsp+"/"+this.dia+"/"+this.turno)
          .then(response => {
              
            var data = []
            for(var i = 0; i< response.data[0].Doctores.length; i++){
              if(response.data[0].Doctores[i].Fechas == ""){
                console.log("NO HAY DOCOTORES")
                  
              }else{
                data.push (response.data[0].Doctores[i])          
              }                 
            }              
            this.doctores = data
          })
        }else{
          console.log("no se seleciono nada")
        }
      },
      
      saca_horas(){
        if(this.selectDoctor != ""){
          var horas_turnos, mayor = 0;
          for(var i = 0; i < this.doctores.length; i++){
            if(this.doctores[i].nombre == this.selectDoctor){
            
              horas_turnos = this.doctores[i].Fechas
              //console.log(this.doctores[i].nombre)
            }
          }
          //console.log(horas_turnos, "  fechas")
          for(var i = 0; i < horas_turnos.length; i++){
            if (horas_turnos[i].id > mayor){
              mayor = horas_turnos[i].id;
            };

          }
           var orden =[]
          for(var i = 0; i<horas_turnos.length; i++){
            if(horas_turnos[i].id == mayor){
            
             orden = horas_turnos[i].Turnos[0].horas_of_trunos
            }
          }

          arr = []
          for(var i = 0; i < orden.length; i++){
            if(orden[i].estado == "libre"){
              arr.push({h:orden[i].hora, id:orden[i].id})
              //console.log(orden[i], "  <<<<")
            }

          }
          this.horas_Turno = arr.sort()
          console.log(orden, " esta son las horas")
        }else{
          console.log("no se selecciono doctor")
        }
      },

      saca_horas_reservadas(){
        if(this.selectDoctor != ""){
          var horas_turnos, mayor = 0;
          for(var i = 0; i < this.doctores.length; i++){
            if(this.doctores[i].nombre == this.selectDoctor){
            
              horas_turnos = this.doctores[i].Fechas
              //console.log(this.doctores[i].nombre)
            }
          }
          //console.log(horas_turnos, "  fechas")
          for(var i = 0; i < horas_turnos.length; i++){
            if (horas_turnos[i].id > mayor){
              mayor = horas_turnos[i].id;
            };

          }
           var orden =[]
          for(var i = 0; i<horas_turnos.length; i++){
            if(horas_turnos[i].id == mayor){
            
             orden = horas_turnos[i].Turnos[0].horas_of_trunos
            }
          }

          arr = []
          for(var i = 0; i < orden.length; i++){
            if(orden[i].estado == "reservado"){
              arr.push({h:orden[i].hora, id:orden[i].id})
              //console.log(orden[i], "  <<<<")
            }          
          }
          this.horas_Turno_reservado = arr.sort()
        }else{
          console.log("no se selecciono horas")
        }
        
      },
      saca_horas_atendidas(){
        if(this.selectDoctor != ""){
          var horas_turnos, mayor = 0;
        for(var i = 0; i < this.doctores.length; i++){
          if(this.doctores[i].nombre == this.selectDoctor){
           
            horas_turnos = this.doctores[i].Fechas
            //console.log(this.doctores[i].nombre)
          }
        }
        //console.log(horas_turnos, "  fechas")
        for(var i = 0; i < horas_turnos.length; i++){
          if (horas_turnos[i].id > mayor){
            mayor = horas_turnos[i].id;
          };
          
        }
         var orden =[]
        for(var i = 0; i<horas_turnos.length; i++){
          if(horas_turnos[i].id == mayor){
           
           orden = horas_turnos[i].Turnos[0].horas_of_trunos
          }
        }
        
        this.arr = []
        for(var i = 0; i < orden.length; i++){
          if(orden[i].estado == "atendido"){
            this.arr.push({h:orden[i].hora, id:orden[i].id})
            //console.log(orden[i], "  <<<<")
          }
          
        }
        this.horas_Turno_atendido = this.arr.sort()
        //console.log(this.horas_Turno_atendido)
        } else {
          console.log("no se selecciono doctro")
        }
        
      },

      liverar:function(){
        if( this.horas_Turno_atendido != ""){
          for(var i = 0; i < this.horas_Turno_atendido.length; i++){

            var esto = {
              method: 'POST',
              headers:{
                'Content-type' : "application/json"
              }
            };
            fetch(this.url.url_front_end+'/paciente/Vue_estado_libre_horas/'+this.horas_Turno_atendido[i].id,esto)
            .then(res => res.json())
            .then(res => {
              if(res.msg == true){
                this.horas_Turno_atendido = [];
                this.arr = []
                console.log(res, "esto es fetch")
                this.saca_horas();
              }
             

            })
          }
        }else{
          swal.fire(
            'Error!',
            '<label style="color:red;">No hay nada para liberar</label>',
            'error'
          )
        }
        
      },
      medicoTurnos(){
          /*axios
          .get('http://localhost:7000/paciente/doctorTurno/'+this.selectDoctor)
          .then(response => {
            //this.turno = response.data[0].Fechas[0].Turnos; 
            for(var i = 0; i < response.data[0].Fechas[0].Turnos.length; i++){
              if(response.data[0].Fechas[0].Turnos[i].diasAten == this.dia){
                  console.log(response.data[0].Fechas[0].Turnos[i].diasAten); 
                  this.turno = response.data[0].Fechas[0].Turnos[i].turno
                  console.log(this.turno)
              }
            }
                       
          })*/
      }
    }
})