//$(document).ready(function() { 
   
       /* fetch('http://localhost:3000/api/servicios')
        .then(res => res.json())
        .then(data =>{
            var $content = "";
            data.forEach(function(item){

              var row = "<select><option>"+item.nombre+"</option></select>";
              $content = $content + row;

            })
            
        $("#selects").html($content);
         // console.log(data)
          
        })*/

        // esta funcion selecina lo que hay dentro del select para agarrar ese dato
        //y llevarlo a otro fetch que traeria datos de salas
        
       /* $(function(){
          $("#selects").change(function(){
          var  serv = $("#selects option:selected").text();
          console.log(serv);
          fetch('http://localhost:3000/api/ServSalasN/'+serv)
            .then(res => res.json())
            .then(data =>{
              console.log(data)
                var $content2 = "";
                data.forEach(function(item){
                
                  var row = "<select><option value = "+item.id+">"+item.descripcionSala+"</option></select>";
                  $content2 = $content2 + row;               
                })      
            $("#salas").html($content2);              
            })  
          })  
        })

        $(function(){
          $("#salas").change(function(){
          var  sala = $("#selects option:selected").text(); 
            console.log(sala, "esto es de sala")
          })
        })*/
        

        

     /* $( "select" )
  .change(function() {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).text() + " ";
    });
    $( "div" ).text( str );
  })
  .trigger( "change" );*/


//});

/*const app = new Vue({
  el: '#prueva',
  data () {
    return {
      mensaje: null
    }
  },
  mounted () {
    axios
      .get('http://localhost:3000/api/papeletaInt')
      .then(response => (this.mensaje = response.data[0].Historial ))
  }
})*/

const options = new Vue({
  el:'#options',
    
    data () {
      return {
        url:data_url.url_front_end,
        mensaje:'',
        mostrar:'',
        salaID:'',
        camas:[],
        fecha_Registro:'',

        data_one_internacion:'',
        numero_cama:'',
        sala:''

      }
    },
    mounted(){
      this.fecha_Registro = moment().format('l'); 
    },
    methods:{
      agregar: function (){
        if(this.mensaje != ""){
          axios
          .get(this.url+'/internaciones/Vue_list_salas/'+this.mensaje)
          .then(response => {
            this.mostrar = response.data 
            //console.log(response.data)
            
          })
        }
       
      },
      traer: function (){
        if(this.salaID != ""){
          axios
          .get(this.url+'/internaciones/VUe_list_camas/'+this.salaID)
          .then(response => {
            console.log(response.data)
            this.camas = response.data
          })
        }
       
      },
      //one_papeleta internacion id
      one_papeleta_onternacion(id){
        fetch(this.url+'/internaciones/vue_one_papeleta_internacion/'+id) 
        .then(resp => resp.json())
        .then(data =>{
          this.numero_cama = data[0].Cama.numeroCama;
          this.sala = data[0].Cama.Sala.descripcionSala;
          this.data_one_internacion = data[0]
          console.log( this.data_one_internacion, " asdasd")
        })
      }
    }
})

