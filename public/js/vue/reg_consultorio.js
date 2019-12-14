Vue.component('v-select', VueSelect.VueSelect);

var reg_sala = new Vue({
  el : "#reg_sala",
  data: () =>({
      id_for_delete_consultorio:'',
      id_med_delete:'',
      buscar:'',
      msg: "",
      msg_false :'',
      url:data_url,
      sigla:"",
      nombre:"",
      id_especialidad: '',
      list_consulta_especialidad:'',
      data_medicos:[],
      ci_medico:'',
      nombre_medico: '',
      especilidad_lista_medicas:'',

      list_ci_med:[],
      /*list_consultorios:[
        {
          id:1,
          name:'CONSUL. EMERGENCIA'
        
        },
        {
          id:2,
          name:'CONSUL. ANATOMÍA PATOLÓGICA'
        
        },
        {
          id:3,
          name:'CONSUL. CARDIOLOGÍA'
        
        },
        {
          id:4,
          name:'CONSUL. CIRUGÍA GENERAL'
        
        },
        {
          id:5,
          name:'CONSUL. CIRUGÍA MAXILOFACIAL'
        
        },
        {
          id:6,
          name:'CONSUL. CIRUGÍA PEDIATRICA'
        
        },
        {
          id:7,
          name:'CONSUL. CIRUGÍA PLASTACA'
        
        },
        {
          id:8,
          name:'CONSUL. DERMATOLOGÍA'
        
        },
        {
          id:8,
          name:'CONSUL. ECOGRAFÍA'
        
        },
        {
          id:10,
          name:'CONSUL. ENDOCRINOLOGÍA'
        
        },
      ]*/
      options:[
        
        'CONSUL. EMERGENCIA',
        'CONSUL. ANATOMÍA PATOLÓGICA',
        'CONSUL. CARDIOLOGÍA',
        'CONSUL. CIRUGÍA GENERAL',
        'CONSUL. CIRUGÍA MAXILOFACIAL',
        'CONSUL. DERMATOLOGÍA',
        'CONSUL. ECOGRAFÍA',
        'CONSUL. ENDOCRINOLOGÍA',
        'CONSUL. ESPIROMETRÍA',
        'CONSUL. FISIOTERAPIA',
        'CONSUL. GASTROENTEROLOGÍA',
        'CONSUL. GENÉTICAp',
        'CONSUL. GINECOLOGÍA',
        'CONSUL. HEMODIÁLISIA',
        'CONSUL. LABORATORIO',
        'CONSUL. MEDICINA INTERNA',
        'CONSUL. MEDICINA TRADICIONAL',
        'CONSUL. NEFROLOGÍA',
        'CONSUL. NEUMOLOGÍA',
        'CONSUL. NEUROCIRUGÍA',
        'CONSUL. NEUROCIRUGÍA CLINICA',
        'CONSUL. NUEROCIRUGÍA PEDIÁTRICA',
        'CONSUL. OBSTETRICIA',
        'CONSUL. ODONTOLOGÍA',
        'CONSUL. OFTANMOLOGÍA',
        'CONSUL. OTORRINOLARINGOLOGÍA',
        'CONSUL. PEDIATRÍA',
        'CONSUL. PSIQUIATRÍA INFANTIL',
        'CONSUL. RAYOS X',
        'CONSUL. REUMATOLOGÍA',
        'CONSUL. SALUD MENTAL',
        'CONSUL. TELE SALUD',
        'CONSUL. TERAPIA INTENSIVA ADULTOS',
        'CONSUL. TERAPIA INTENSIVA PEDIATRIA',
        'CONSUL. TERAPIA INTENSIVA NEONATAL',
        'CONSUL. TRAUMATOLOGÍA',
        'CONSUL. TRAUMATOLOGÍA PEDIÁTRICA',
        'CONSUL. TOMOGRAFÍA',
        'CONSUL. UROLOGÍA'

      ], 
      
  }),
    computed:{
      buscar_consultorio(){
        return this.list_consultorios.filter((item) => item.name.includes(this.buscar))
      }
    },
    mounted(){
      console.log(this.options)
      fetch(this.url.url_front_end+'/cuaderno/VUe_lista_medicos')
      .then(res => res.json())
      .then(data => {
       
        this.data_medicos = data

        for ( var i = 0; i < data.length;  i++){
          this.list_ci_med.push({ci : data[i].ci})
          console.log(data[i].ci)
        }
        
      })
      
    },
    methods:{
      selected(name){
        for(var i = 0; i < this.list_consultorios.length; i++){
          if(this.list_consultorios[i].name == name){
            this.buscar = this.list_consultorios[i].name
            this.nombre = this.list_consultorios[i].name
          }
        }
      },
        data(id){
            this.id_especialidad = id;
            this.msg = ""
        },
        reg_consultorio(e){
            e.preventDefault();
            data = {
                nombre:this.nombre,
                sigla: this.sigla                
            }
            var esto = {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                  'Content-type' : "application/json"
                }
            };
            fetch(this.url.url_front_end+'/cuaderno/vue_regConsultorio/'+this.id_especialidad,esto)
            .then(res => res.json())
            .then(data => {
              if (data.success == true){
                this.msg = data.msg
                this.sigla = "",
                this.nombre = ""
                this.lista_consulta()
                this.msg_false=""
                swal.fire(
                  'Confirmado!',
                  '<label style="color:green;">'+  data.msg +'</label>',
                  'success',
                  
                )
              }else{
                this.msg_false = data.msg
                this.msg =""
                swal.fire(
                  'Error!',
                  '<label style="color:red;">' + data.msg +'</label>',
                  'error'
                )
              }
            })
        },

        list_medicos(){
          for(var i = 0; i < this.data_medicos.length; i++){
            if(this.data_medicos[i].ci == this.ci_medico){
              console.log(this.data_medicos[i].nombre)
              this.nombre_medico = this.data_medicos[i].nombre+' '+this.data_medicos[i].apellidop+' '+this.data_medicos[i].apellidom
            }
          }
        },
        register_medicos(e){
          e.preventDefault();
          data = {
            nombre_doctor: this.nombre_medico,       
            ci:this.ci_medico        
          }
          var esto = {
              method: 'POST',
              body: JSON.stringify(data),
              headers:{
                'Content-type' : "application/json"
              }
          };
          fetch(this.url.url_front_end+'/cuaderno/Vue_reg_doctor_especialidad/'+this.id_especialidad,esto)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            if (data.success == true){
              this.msg = data.msg
              this.nombre_medico = ""
              this.msg_false = "",
              this.lista_doctores()
            }else{
              this.msg_false = data.msg
              this.msg = ""
            }
          })
          
        },
        lista_doctores(){
          fetch(this.url.url_front_end+'/cuaderno/vue_only_list_doctores_especialidad/'+this.id_especialidad)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.especilidad_lista_medicas = data
          })
        },
        lista_consulta(){
          fetch(this.url.url_front_end+'/cuaderno/vue_list_EspCons/'+this.id_especialidad)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.list_consulta_especialidad = data
          })
        },        
        ////**eliminar consultorio */
        eliminar_Consultorio(){
          fetch(this.url.url_front_end+'/cuaderno/VueliminarConsulta/'+this.id_for_delete_consultorio)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.lista_consulta()
          })
        },
        ///**eliminar medico */
        eliminaMedico(){
          fetch(this.url.url_front_end+'/cuaderno/vude_del_med_especialidad/'+this.id_med_delete)
          .then(res => res.json())
          .then(data => {
            console.log(data , "#ssssssssssssssssssss  <<<<<<<<<<<<<<<<<<<<<<<<")
            this.lista_doctores()
          })
        }
    }
})