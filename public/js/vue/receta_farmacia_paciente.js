Vue.filter('numeral', function (value) {
    return numeral(value).format('0,0');
})
const receta_paciente = new Vue({
  el: '.receta_paciente', 
  data : () => ({
    url:data_url.url_front_end,
    msg: 'aljand',

    list2 : '',
   

    listFechas_distribucion:{},
    totalQty1 : 0,

    alert: "",
    pass:"",

    msg_true_post: '',
    msg_false_post: '',

    false_msg_product:[],
    product_false:[],

    id_receta:'',
    id_user:'',

    //data_post
    codigo_venta:'',
    empleado:'',
    historial:'',
    tipo_consulta:'',
    nombre_doctor:'',

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
    fetch(this.url+'/farmacia/vue_one_receta/'+this.id_receta)
    .then(resp => resp.json())
    .then(data_receta_paciente => { 
      
      var arr = []
      for(var i = 0; i < data_receta_paciente[0].medicamentos.length; i++){
        if (data_receta_paciente[0].medicamentos[i].id != 0){
          fetch(this.url+'/farmacia/Vue_one_medicamento_fecha/'+data_receta_paciente[0].medicamentos[i].id)
          .then(resp => resp.json())
          .then(resp => {
            for (var j = 0; j < resp[0].cantidad_fechas.length; j++){
              arr.push({
                id:resp[0].cantidad_fechas[j].id,
                fehca_vencimineto: resp[0].cantidad_fechas[j].fehca_vencimineto,
                cantidad_unidad: resp[0].cantidad_fechas[j].cantidad_unidad,
                precio:resp[0].cantidad_fechas[j].precio,
                id_medicamento:resp[0].cantidad_fechas[j].id_medicamento,
              });  
            }
          }) 
          this.insert_men_receta1(data_receta_paciente[0].medicamentos[i].id,data_receta_paciente[0].medicamentos[i].cantidad);
        }else{
          console.log("esto es el otro", data_receta_paciente[0].medicamentos[i].id );
        }
        this.insert_men_receta(data_receta_paciente[0].medicamentos[i].id,data_receta_paciente[0].medicamentos[i].cantidad,data_receta_paciente[0].medicamentos[i].medicamento)
      } 
      console.log(arr.length, " esto es el array ")
      this.list2 = arr
    })
  },
  created:function() {
    fetch(this.url+'/farmacia/Vue_medicamentos_farmacia')
    .then(res => res.json())
    .then(res => {
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

    //falta farmacia en la parte de las fechas de vencimineto no se esta pudiendo ya que no genera el array
    insert_men_receta1(id_med,cantidad){
      console.log(this.list2, " esto es lo que quiero ver <<<<")
      var ver = []
      var cant = cantidad , aux
      var  mayor = 0
      var id_fecha = 0
      for(var i = 0; i < this.list2.length; i++){
        console.log(this.list2[i], ' esto es ')
       /*  if (this.list_fecha_cantidad[i].id_medicamento == id_med){
          console.log(this.list_fecha_cantidad[i].cantidad_unidad, ' esto es ')
           mayor = this.list_fecha_cantidad[i].cantidad_unidad
          id_fecha = this.list_fecha_cantidad[i].id 
          
        } */
      }
      //console.log(mayor, " esto es el mayor ")
      /* while (cant >= 0 ){
        
        cant = cant - 5
        console.log(cant, " esto es <<", id_med)
        for(var i = 0; i < this.list_fecha_cantidad.length; i++){
          if (this.list_fecha_cantidad[i].id_medicamento == id_med){
            mayor = this.list_fecha_cantidad[i].cantidad_unidad
            id_fecha = this.list_fecha_cantidad[i].id
            
          }
        }
        cant = cant - mayor
        ver.push({
          id_fecha: id_fecha,
          id: id_med,
          cantidad: cant

        })
        console.log (id_fecha, "id", cant, " cantidad ", mayor)
        this.insertar1(id_med,id_fecha,cant)  
      }     */ 
      //console.log(cant, "  <<<>>>>");
      /* for (var i = 0; i < this.list_fecha_cantidad.length; i++){
        if (this.list_fecha_cantidad[i].id == id_med){
          console.log(id_med, "id_med", this.list_fecha_cantidad[i].cantidad, " cantidad", this.list_fecha_cantidad[i].medicamento, 'id', id)
        }
      } */
    },

        insert_men_receta: function (id, cantidad,nom_medicamento){
          if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
            //this.msg = "Inserte una cantidad del producto"
            if(cantidad == 0 || cantidad == ""){
              this.alert = "Inserte una cantidad del producto"
            }else if(cantidad <= 0){
              this.alert = "Las cantidades no pueden ser negativas"
            }
    
          }  else {
            axios
            .get(this.url+'/farmacia/vue_medicamento/'+id)
            .then(response => {
              //console.log(response, "  esto inserta 2")
              if( response.data.success == false){
                this.product_false.push({
                  product:"No existe el producto "+nom_medicamento
                })
              }else{
                var numero = response.data[0].cantidad_unidad - cantidad
                if(numero <= 0){
                  this.false_msg_product.push({
                    cantidad_requerida: cantidad,
                    cantidad_actual: response.data[0].cantidad_unidad,
                    nombre: response.data[0].nombre
                  })
                }else{
                  var car = {
                    id: response.data[0].id,
                    codificacion: response.data[0].codificacion,
                    nombre: response.data[0].nombre,
                    //cantidad: response.data[0].cantidad_unidad,
                    price: response.data[0].precio_compra
                  }   
                  for(var i=0; i< cantidad; i++){
                    this.add(car,id);
                  }  
                  this.cantidad = 0 
                }
              }              
              
            })   

          }                      
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
        insert: function (id, cantidad){
          if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
            //this.msg = "Inserte una cantidad del producto"
            if(cantidad == 0 || cantidad == ""){
              this.alert = "Inserte una cantidad del producto"
            }else if(cantidad <= 0){
              this.alert = "Las cantidades no pueden ser negativas"
            }
    
          }  else {
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
        },
  
        generateArray: function () {
            let arr = [];
            for (const id in this.listItems) {
                arr.push(this.listItems[id]);
            }
            return arr;
        },  

        reg_receta_paciente(e){
          e.preventDefault();
          if( this.generateArray() == ""){
            this.msg_false_post = "No se seleciono un producto"
          }else{
            var datos = {
              codigo_venta:this.codigo_venta,
              empleado:this.empleado,
              historial:this.historial,
              tipo_consulta:this.tipo_consulta,
              nombre_doctor:this.nombre_doctor,
              medicamentos:{
                medicamentos:this.generateArray(),
                totalQty : this.totalQty,
                totalPrice : this.totalPrice, 
                iva : this.totalPrice * 0.18,
                total : this.totalPrice + this.totalPrice * 0.18                  
              },
              id_receta:this.id_receta,
              id_user:this.id_user,
            }
            var esto = {
              method: 'POST',
              body: JSON.stringify(datos),
              headers:{
                'Content-type' : "application/json"
              }
            };
            fetch(this.url+'/farmacia/vue_reg_receta_paciente',esto)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
              console.log(data, "esto es lo que quiero ver")
              if(data.success == true){
                this.msg_true_post = data.msg
                this.update_cantidad()
                this.msg_false_post = ""
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
      }
    }
})