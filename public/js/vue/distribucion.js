
/* aljand()
function aljand(){
  var edad=moment("2019-05-11"), hoy=moment()
  var anios=hoy.diff(edad,"days")
  var days = moment().diff('2019-12-05', 'days');
  
  console.log(days)
} */


Vue.filter('numeral', function (value) {
    return numeral(value).format('0,0');
})

const pedidos =  new Vue({
    el:"#pedidos",
    data : () => ({
        url:data_url.url_front_end,
        id_personal:'',
        medicamentos:[],
        itemsCar:[],

        listFechas_distribucion:{},
        totalQty1 : 0,

        distribucionList : {},
        totalQty : 0,
        totalPrice : 0,

        codigo:'',
        responsable:'',
        recibe:'',
        fechaLlegada:'',

        //respuesta post
        respuestaPost:'',
        rep_post_false:'',
        respFalse: '',
        pass:'',

        listDistribucion:[],

        oneDistrbucion:[],

       //para buscar medicamentos para la desitribucion
       searchMed: '',
       ListMedicamentos:[],
       filteredMeds: [],
       paginatedMeds: [],
       paginationMeds: {
           range: 5,
           currentPage: 1,
           itemPerPage: 6,
           ListMedicamentos: [],
           filteredMeds: [],
       },
       //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    }),

    mounted(){
      this.fechaLlegada = moment().format('l')
      fetch(this.url+'/distribucion/vueMedicamento')
      .then(res => res.json())
      .then(res => {
        for(var i = 0; i < res.length; i++){
          if( -(moment().diff(res[i].fehca_vencimineto, 'days')) > 0 && res[i].cantidad_unidad != 0){
            this.ListMedicamentos.push({
              id_fecha:res[i].id,
              id : res[i].RegMedicamento.id,
              nombre : res[i].RegMedicamento.nombre,
              cantidad : res[i].cantidad,
              codificacion: res[i].RegMedicamento.codificacion,
              precio : res[i].RegMedicamento.precio,
              presentacion : res[i].RegMedicamento.presentacion,
              unidades : res[i].cantidad_unidad,
              fecha_v: -(moment().diff(res[i].fehca_vencimineto, 'days')),
              cant:0
            })
          }
           
        }
      })
    },
    ready() {
      //para buscar medicamentos para la desitribucion
      this.filteredMeds = this.ListMedicamentos
      this.buildPaginationMed()
      this.selectPageMed(1)  
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    },

    methods:{
      add_lismed(){
        fetch(this.url+'/distribucion/vueMedicamento')
        .then(res => res.json())
        .then(res => {
          var arr = []
          for(var i = 0; i < res.length; i++){
            if( -(moment().diff(res[i].fehca_vencimineto, 'days')) > 0 && res[i].cantidad_unidad != 0){
              arr.push({
                id_fecha:res[i].id,
                id : res[i].RegMedicamento.id,
                nombre : res[i].RegMedicamento.nombre,
                cantidad : res[i].cantidad,
                codificacion: res[i].RegMedicamento.codificacion,
                precio : res[i].RegMedicamento.precio,
                presentacion : res[i].RegMedicamento.presentacion,
                unidades : res[i].cantidad_unidad,
                fecha_v: -(moment().diff(res[i].fehca_vencimineto, 'days')),
                cant:0
              }) 
            }
            
          }
          this.ListMedicamentos = arr
        })
      },

      /*
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                  buscar medicamentos para el pedido
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      */
       clearSearchItemMed(){
        this.searchMed = undefined
        this.searchInTheListMed('')
        },
        searchInTheListMed(searchText, currentPage){
            if(_.isUndefined(searchText)){
              this.filteredMeds = _.filter(this.ListMedicamentos, function(v, k){
                return !v.selected
              })
            }
            else{
              this.filteredMeds = _.filter(this.ListMedicamentos, function(v, k){
                return !v.selected && v.nombre.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || !v.selected && v.presentacion.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                || !v.selected && v.unidades.toLowerCase().indexOf(searchText.toLowerCase()) > -1
               
              })
            }
            this.filteredMeds.forEach(function(v, k){
              v.key = k+1
            })  
            this.buildPaginationMed()

            if(_.isUndefined(currentPage)){
              this.selectPageMed(1) 
            }
            else{
              this.selectPageMed(currentPage)
            }
        },
        buildPaginationMed(){
            let numberOfPage = Math.ceil(this.filteredMeds.length/this.paginationMeds.itemPerPage)
            this.paginationMeds.ListMedicamentos = []
            for(var i=0; i<numberOfPage; i++){
              this.paginationMeds.ListMedicamentos.push(i+1)
            }
        },
        selectPageMed(item) {
            this.paginationMeds.currentPage = item

            let start = 0
            let end = 0
            if(this.paginationMeds.currentPage < this.paginationMeds.range-2){
              start = 1
              end = start+this.paginationMeds.range-1
            }
            else if(this.paginationMeds.currentPage <= this.paginationMeds.ListMedicamentos.length && this.paginationMeds.currentPage > this.paginationMeds.ListMedicamentos.length - this.paginationMeds.range + 2){
              start = this.paginationMeds.ListMedicamentos.length-this.paginationMeds.range+1
              end = this.paginationMeds.ListMedicamentos.length
            }
            else{
              start = this.paginationMeds.currentPage-2
              end = this.paginationMeds.currentPage+2
            }
            if(start<1){
              start = 1
            }
            if(end>this.paginationMeds.ListMedicamentos.length){
              end = this.paginationMeds.ListMedicamentos.length
            }

            this.paginationMeds.filteredMeds = []
            for(var i=start; i<=end; i++){
              this.paginationMeds.filteredMeds.push(i);
            }

            this.paginatedMeds = this.filteredMeds.filter((v, k) => {
              return Math.ceil((k+1) / this.paginationMeds.itemPerPage) == this.paginationMeds.currentPage
            })
        },  
         /*
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        */
       insertar1(id_med,id,cantidad,index){
         console.log(index, "   ssd")
        if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
          if(cantidad == 0 || cantidad == ""){
            this.respFalse = "Inserte una cantidad del producto";
            this.pass = ""
          }else if(cantidad <= 0){
            this.respFalse = "Las cantidades no pueden ser negativas";
            this.pass = ""
          }
        }else{
          fetch(this.url+'/pedidos/carrito_fehca/'+id)   
          .then(resp => resp.json())
          .then(resp =>{
            if (resp == ""){
              this.respFalse = "No se puede insertar no existe";
              this.pass = ""
            }else{
              var med_cant;
              for(var i = 0; i < this.ListMedicamentos.length; i++){
                if (this.ListMedicamentos[i].id_fecha == id){
                  med_cant = this.ListMedicamentos[i].unidades - cantidad
                }
              } 
              if (med_cant < 0){
                this.respFalse = "No se puede insertar es cantidad no existe";
                this.pass = "";
              }else{
                this.pass = "Se inserto productos"
                this.respFalse = ""
                for(var i = 0; i< cantidad; i++){
                  this.add1(resp,id,index);
                } 
                axios
                .get(this.url+'/pedidos/carrito/'+id_med)
                .then(response => {
                  //console.log(response.data, " esto es insertar ")
                    var car = {
                        id: response.data.id,
                        codificacion: response.data.codificacion,
                        nombre: response.data.nombre,
                        presentacion: response.data.presentacion,
                        price: response.data.price,
                        cantidad: response.data.cantidad,
                       
                    } 
                    this.itemsCar = car 
                                 
                    for(var i = 0; i< cantidad; i++){
                      this.add(car,id_med);
                    }                         
                })               
                for(var i = 0; i < this.ListMedicamentos.length; i++){
                  if (this.ListMedicamentos[i].id_fecha == id){
                    this.ListMedicamentos[i].unidades = this.ListMedicamentos[i].unidades - cantidad
                  }
                } 
              }
            }
          })
        }
       },
       add1: function(item, id, position)  {
        let storedItem = this.listFechas_distribucion[id];
        if (!storedItem) {
            storedItem = this.listFechas_distribucion[id] = {
                item: item,
                position,
                qty: 0
            };
            
        }
        storedItem.qty++;
        this.totalQty1++;         
      },

      reducir_cantidad1 (id) {
        
        
        var esto = this.generateArray1()
        console.log(esto, " esto es ")
        var mayor = 0, position = 0; 
        var index;
        for( var j = 0; j < esto.length; j++){

          if (esto[j].item[0].id_medicamento == id){

            if (esto[j].item[0].cantidad_unidad > mayor){              
              mayor=esto[j].item[0].cantidad_unidad;
              position = j;
              index = esto[j].item[0].id;
            }

          }

        }          
        for(var i = 0; i < this.ListMedicamentos.length; i++){
          if (this.ListMedicamentos[i].id_fecha == index){
            this.ListMedicamentos[i].unidades = this.ListMedicamentos[i].unidades + 1
          }
        }  
        this.listFechas_distribucion[esto[position].item[0].id].qty--;
        this.totalQty1--;
        
        if (this.listFechas_distribucion[esto[position].item[0].id].qty <= 0) {
          delete this.listFechas_distribucion[esto[position].item[0].id];
        } 

      },

      
      eliminar_item1(id) {
        var esto1 = this.generateArray1();
        
       
        for( var i = 0; i < esto1.length; i++ ) {
          
          if (esto1[i].item[0].id_medicamento == id){
            this.totalQty1 -= this.listFechas_distribucion[esto1[i].item[0].id].qty;
            delete this.listFechas_distribucion[esto1[i].item[0].id];
            
            fetch(this.url+'/pedidos/carrito_fehca/'+esto1[i].item[0].id)   
            .then(resp => resp.json())
            .then(resp =>{
              
              for(var J = 0; J < this.ListMedicamentos.length; J++){
                if (this.ListMedicamentos[J].id_fecha == resp[0].id){
                  this.ListMedicamentos[J].unidades = resp[0].cantidad_unidad
                  
                }
              }  
            })
          }
        }
      },

      generateArray1: function () {
          let arr = [];
          for (const id in this.listFechas_distribucion) {
              arr.push(this.listFechas_distribucion[id]);
          }
          return arr;
      },         

      add: function(item, id)  {
        let storedItem = this.distribucionList[id];
        if (!storedItem) {
            storedItem = this.distribucionList[id] = {
                item: item,
                qty: 0,
                price: 0
            };
            
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += 1*storedItem.item.price;            
      },

      reducir_cantidad (id){
        this.distribucionList[id].qty--;
        this.distribucionList[id].price -= this.distribucionList[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.distribucionList[id].item.price;

        if (this.distribucionList[id].qty <= 0) {
            delete this.distribucionList[id];
        }
        this.reducir_cantidad1(id)
      },

      eliminar_item(id) {
        this.totalQty -= this.distribucionList[id].qty;
        this.totalPrice -= this.distribucionList[id].price;
        delete this.distribucionList[id];
        this.eliminar_item1(id)
      },
      
      generateArray: function () {
          let arr = [];
          for (const id in this.distribucionList) {
              arr.push(this.distribucionList[id]);
          }
          return arr;
      },
      formSubmit(e) {
          e.preventDefault();
          if( this.generateArray() == "" || this.generateArray1() == ""){
              swal.fire(
                'Error!',
                '<label style="color:red;">Selecione productos por favor</label>',
                'error'
              )                
          }else{
            var data = {
              codigo:this.codigo,
              responsable:this.responsable,
              recibe:this.recibe,
              fechaLlegada:this.fechaLlegada,
              productos:this.generateArray(),
              id_personal:this.id_personal
            }
            var esto = {
              method: 'POST',
              body: JSON.stringify(data),
              headers:{
                'Content-type' : "application/json"
              }
            };
            fetch(this.url+'/distribucion/vueMedicamento',esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => { 
              console.log(data, " esto es el form post <<<<<<<<<")
              if(data.success == false){
                swal.fire(
                  'Error!',
                  '<label style="color:red;">'+data.msg+'</label>',
                  'error'
                )      
              }else{                
                this.reduce();
                this.reduce_fechas_cantidad();
                this.codigo = '';
                this.responsable= '';
                this.recibe = '';
                this.distribucionList = {};
                this.totalQty = 0;
                this.totalPrice = 0;

                this.listFechas_distribucion = {}
                this.totalQty1 = 0,

                swal.fire(
                  'Confirmado!',
                  '<label style="color:green;">'+ data.msg +'</label>',
                  'success'
                )
              }
              
            })
             
              
          } 
      
      },

      //ruta para mostrar las distribuciones que se hace
      Listdistribuciones: function (){
          axios
          .get(this.url+'/distribucion/vueDistribucion')
          .then(response => {
           
            this.listDistribucion = response.data;              
          })
      },
        
      //para reducir al estock    
      reduce(){
          var producto = this.generateArray();
          if (producto == ""){
              this.respuestaPost = "No se selecciono Producto <<<<<<<<<<<<<<"
          }else{
              axios.post(this.url+'/distribucion/vueReduceStock', {
                  producto: producto                
              })
              .then(function (response) {
                  console.log(response, "  <<< esto es reduce")
              })
              .catch(function (error) {
                  console.log(error)
              });
          }            
      },


      reduce_fechas_cantidad(){
        var list = this.generateArray1()
    
        for (var i = 0; i < list.length; i++){
          //console.log(esto[i].item[0].id, "  id" )        
          
          var data = {    
            cantidad_unidad : list[i].qty   
          }; 
          var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
          };
          fetch(this.url+'/distribucion/Vue_reduce_cantidad_fecha/'+ list[i].item[0].id,esto)
          .then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(data => { 
            console.log(data, "  esto es la respuesta del post")
          });
        }
      },


      onlyDistrubucion(id){
        fetch(this.url+'/distribucion/onlyDist/'+id)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
          this.oneDistrbucion = data[0]
        })
      }
    }
})

// falta reducir al stock inicial