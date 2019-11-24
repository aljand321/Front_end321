Vue.filter('numeral', function (value) {
    return numeral(value).format('0,0');
})
const receta_cliente = new Vue({
    el: '.receta_cliente', 
    data : () => ({
        url:data_url.url_front_end,
        msg: '',

        listFechas_distribucion:{},
        totalQty1 : 0,

        alert: "",
        pass:"",

        msg_true_post:'',
        msg_false_post:'',

        //data post
        empleado:'',
        ci:'',
        medicamentos:'',
        id_user:'',
        id_cliente:'',


        medicamentos: [],
        itemsCar:[],
        qty:[],
        cantidadMedicamento:'',
        showModal: false,

        listItems : {},
        totalQty : 0,
        totalPrice : 0,
        iva:0,
        total:0,

        searchMed: '',
        ListMedicamentos:[],
        filteredMeds: [],
        paginatedMeds: [],
        paginationMeds: {
            range: 5,
            currentPage: 1,
            itemPerPage: 2,
            ListMedicamentos: [],
            filteredMeds: [],
        },
    }),
    mounted(){
      fetch(this.url+'/farmacia/Vue_medicamentos_farmacia')
      .then(res => res.json())
      .then(res => {
          console.log(res, "  esto es lo que quiero ver")
          for(var i = 0; i < res.length; i++){
            this.ListMedicamentos.push({
              id_fecha:res[i].id,
              id : res[i].medicamento.id,
              nombre : res[i].medicamento.nombre,
              cantidad : res[i].cantidad_unidad,
              codificacion: res[i].medicamento.codificacion,
              precio : res[i].medicamento.precio_compra,
              presentacion : res[i].medicamento.presentacion,
              fecha_v: -(moment().diff(res[i].fehca_vencimineto, 'days')),
              cant:0
            }) 
          }
      })       
    },
    ready() {   
        //esta parte es para el modal de buscar mecicamentos
        this.filteredMeds = this.ListMedicamentos
        this.buildPaginationMed()
        this.selectPageMed(1)  
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    },
    methods:{ 
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

        insertar1(id_med,id,cantidad){
          console.log(cantidad, "   ssd")
         if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
           if(cantidad == 0 || cantidad == ""){
             this.alert = "Inserte una cantidad del producto";
             this.pass = ""
           }else if(cantidad <= 0){
             this.alert = "Las cantidades no pueden ser negativas";
             this.pass = ""
           }
         }else{
           fetch(this.url+'/farmacia/vue_One_fecha_cantidad/'+id)   
           .then(resp => resp.json())
           .then(resp =>{
             if (resp == ""){
               this.alert = "No se puede insertar no existe";
               this.pass = ""
             }else{
               var med_cant;
               for(var i = 0; i < this.ListMedicamentos.length; i++){
                 if (this.ListMedicamentos[i].id_fecha == id){
                   med_cant = this.ListMedicamentos[i].cantidad - cantidad                   
                 }
               } 
               if (med_cant < 0){
                 this.alert = "No se puede insertar es cantidad no existe";
                 this.pass = "";
               }else{
                 this.pass = "Se inserto productos"
                 this.alert = ""
                 for(var i = 0; i< cantidad; i++){
                   this.add1(resp,id);
                 } 
                 axios
                 .get(this.url+'/farmacia/vue_medicamento/'+id_med)
                 .then(response => {
                   //console.log(response.data, " esto es insertar ")
                     var car = {
                      id: response.data[0].id,
                      codificacion: response.data[0].codificacion,
                      nombre: response.data[0].nombre,
                      //cantidad: response.data[0].cantidad_unidad,
                      price: response.data[0].precio_compra
                        
                     } 
                                  
                     for(var i = 0; i< cantidad; i++){
                       this.add(car,id_med);
                     }                         
                 })               
                 for(var i = 0; i < this.ListMedicamentos.length; i++){
                    if (this.ListMedicamentos[i].id_fecha == id){
                      this.ListMedicamentos[i].cantidad = this.ListMedicamentos[i].cantidad - cantidad
                    }
                 } 
               }
             }
           })
         }
        },

        add1: function(item, id)  {
          let storedItem = this.listFechas_distribucion[id];
          if (!storedItem) {
              storedItem = this.listFechas_distribucion[id] = {
                  item: item,
                  qty: 0
              };
              
          }
          storedItem.qty++;
          this.totalQty1++;         
        },

        reducir_cantidad1 (id) {
        
          var esto = this.generateArray1()
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
              this.ListMedicamentos[i].cantidad = this.ListMedicamentos[i].cantidad + 1
              console.log(this.ListMedicamentos[i].cantidad, "  esto es ")
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
              
              fetch(this.url+'/farmacia/vue_One_fecha_cantidad/'+esto1[i].item[0].id)   
              .then(resp => resp.json())
              .then(resp =>{
                console.log(resp, "  zzzzlksad")
                for(var J = 0; J < this.ListMedicamentos.length; J++){
                  if (this.ListMedicamentos[J].id_fecha == resp[0].id){
                    this.ListMedicamentos[J].cantidad = resp[0].cantidad_unidad
                    console.log(this.ListMedicamentos[J].cantidad, " <<<<<<<<<asdasd " )
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

        insert: function (id, cantidad){
            if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
              //this.msg = "Inserte una cantidad del producto"
              if(cantidad == 0 || cantidad == ""){
                this.alert = "Inserte una cantidad del producto"
              }else if(cantidad <= 0){
                this.alert = "Las cantidades no pueden ser negativas"
              }
      
            }else{
              axios
              .get(this.url+'/farmacia/vue_medicamento/'+id)
              .then(response => {
                console.log(response.data[0].cantidad_unidad, " esto es un medicamentos insertado <<<<")
                var numero = response.data[0].cantidad_unidad - cantidad
                if(numero <= 0){
                  this.alert = " No se puede insertar ya no hay esa cantidad de " + response.data[0].nombre + " en stock"
                  this.pass = ""
                }else{
                  var car = {
                    id: response.data[0].id,
                    codificacion: response.data[0].codificacion,
                    nombre: response.data[0].nombre,
                    //cantidad: response.data[0].cantidad_unidad,
                    price: response.data[0].precio_compra
                  }   
                  this.pass = " Se insertaron  "+cantidad + " productos" + " de " + car.nombre
                  this.alert = ""
                  for(var i=0; i< cantidad; i++){
                    this.add(car,id);
                  }  
                  this.cantidad = 0 
                }
                
              })   
  
            }                      
        },
          add: function(item, id)  {
            let storedItem = this.listItems[id];
            if (!storedItem) {
              storedItem = this.listItems[id] = {
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

        reduceByOne (id) {
            this.listItems[id].qty--;
            this.listItems[id].price -= this.listItems[id].item.price;
            this.totalQty--;
            this.totalPrice -= this.listItems[id].item.price;
    
            if (this.listItems[id].qty <= 0) {
                delete this.listItems[id];
            }
            this.reducir_cantidad1(id)
        },
  
        removeItem(id) {
            this.totalQty -= this.listItems[id].qty;
            this.totalPrice -= this.listItems[id].price;
            delete this.listItems[id];
            this.eliminar_item1(id);
        },
  
        generateArray: function () {
            let arr = [];
            for (const id in this.listItems) {
                arr.push(this.listItems[id]);
            }
            return arr;
        }, 

        //registrer venta cliente
        register(e){
          e.preventDefault();
          if( this.generateArray() == "" || this.generateArray1() == "" ){
            this.msg_false_post = "No se seleciono un producto"
            console.log("No se seleciono un producto")
          }else{
            var datos = {
              
              empleado:this.empleado,
              ci:this.ci,
              medicamentos:{
                medicamentos:this.generateArray(),
                totalQty : this.totalQty,
                totalPrice : this.totalPrice, 
                iva : this.totalPrice * 0.18,
                total : this.totalPrice + this.totalPrice * 0.18                  
              },
              id_user:this.id_user

            }
            var esto = {
              method: 'POST',
              body: JSON.stringify(datos),
              headers:{
                'Content-type' : "application/json"
              }
            };
            fetch(this.url+'/farmacia/register_venta_cliente/'+this.id_cliente,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
              console.log(data, "esto es lo que quiero ver")
              if(data.success == true){
                this.msg_true_post = data.msg
                this.update_cantidad();
                this.reduce_cantidad();
                this.msg_false_post = ""
                this.listItems = {}
              }else{
                this.msg_false_post = data.msg
                this.msg_true_post = ""
              }
              
            })
          }
        },

        update_cantidad(){
          var lista  = this.generateArray()
          for(var i = 0; i < lista.length; i++){
            console.log(lista[i].qty, lista[i].item.id)
          
            var datos = {
              cantidad:lista[i].qty
            }
            var esto = {
              method: 'post',
              body: JSON.stringify(datos),
              headers:{
                'Content-type' : "application/json"
              }
            };
            fetch(this.url+'/farmacia/vue_update_cantidad/'+lista[i].item.id,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
              console.log(data)
            })
  
          }
        },
        reduce_cantidad(){
          var list = this.generateArray1()
          
          for (var i = 0; i < list.length; i++){
            console.log(list[i].qty , "  id", list[i].item[0].id )        

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
            fetch(this.url+'/farmacia/vue_reduce_catidad_fecha/'+ list[i].item[0].id,esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => { 
              console.log(data, "  esto es la respuesta del post")
            }); 
          }
          
        }
    }
})