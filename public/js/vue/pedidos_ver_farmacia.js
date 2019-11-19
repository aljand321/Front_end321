
Vue.component('modal', {
  template: '#modal-template'
})

Vue.filter('numeral', function (value) {
  return numeral(value).format('0,0');
})
console.log(data_url)
const ver_pedido_farmacia =  new Vue({
  el:'#ver_pedido_farmacia',
  data: () => ({
      url:data_url.url_front_end,
      msg: "",
      msg_false:'',

      listFechas_distribucion:{},
      totalQty1 : 0,

      id_pedido:'',

      alert: "",
      pass:"",

      data_pedido:'',
      list:'',
      aceptados_list:'', // aqui esta los productos que almacen esta enviando a farmacia
      lista_med_aceptados:{},


      //pra medicamentos pag search
      
      searchMed: '',
      ListMedicamentos:[],
      filteredMeds: [],
      paginatedMeds: [],
      paginationMeds: {
          range: 5,
          currentPage: 1,
          itemPerPage: 4,
          ListMedicamentos: [],
          filteredMeds: [],
      },

      listItems : {}, // esto el pedido que esta mandando almacen a farmacia
      totalQty : 0,
      totalPrice : 0,
  }),
  mounted() {
    fetch(this.url+'/almacen/Vue_one_pedido_farmacia/'+this.id_pedido)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(resp => {
      if(resp[0].medicamento_mandado_almacen != null){
        this.aceptados_list = resp[0].medicamento_mandado_almacen
      
        this.lista_med_aceptados = resp[0].medicamento_mandado_almacen.lista_med
      }
    
        this.data_pedido = resp
        var arr= []
        for(var i = 0; i < resp[0].medicamentos.list_meds.length; i++){
            arr.push({
                item: {
                    id : resp[0].medicamentos.list_meds[i].item.id,
                    codificacion : resp[0].medicamentos.list_meds[i].item.codificacion,
                    nombre : resp[0].medicamentos.list_meds[i].item.nombre,
                    price : resp[0].medicamentos.list_meds[i].item.price
                },
                fehca_vencimineto: '',
                qty : resp[0].medicamentos.list_meds[i].qty,
                price : resp[0].medicamentos.list_meds[i].price
            })
        }
        this.list = arr
    }) 
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
  methods:{
   
    /*
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                         esta parte es para el modal de buscar mecicamentos
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    */
  insertar1(id_med,id,cantidad,index){
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

      
    add: function(item, id, position)  {
      let storedItem = this.listItems[id];
      if (!storedItem) {
        storedItem = this.listItems[id] = {
          item: item,
          position, // esta es la posision en la que se encuentra en el modal vue o el filtrador de productos para poder rebertir la cantidad de productos
          qty: 0,
          price: 0
        };
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQty++;
      this.totalPrice += 1*storedItem.item.price;
    
    },
    reducir_cantidad (id) {
      this.listItems[id].qty--;
      this.listItems[id].price -= this.listItems[id].item.price;
      this.totalQty--;
      this.totalPrice -= this.listItems[id].item.price;
    
      if (this.listItems[id].qty <= 0) {
          delete this.listItems[id];
      }
      this.reducir_cantidad1(id)
    },

    eliminar_item(id) {
      this.totalQty -= this.listItems[id].qty;
      this.totalPrice -= this.listItems[id].price;
      delete this.listItems[id];
      this.eliminar_item1(id)
    },

    generateArray: function () {
      let arr = [];
      for (const id in this.listItems) {
          arr.push(this.listItems[id]);
      }
      return arr;
    },
    
    update_pedido_almacen(e){
      e.preventDefault();
      var data  = {
        medicamento_mandado_almacen:{
          
          lista_med:this.generateArray(),
          totalQty : this.totalQty,
          totalPrice : this.totalPrice,
          
        }
      };
      var esto = {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-type' : "application/json"
          }
      };
      fetch(this.url+'/almacen/Vue_update_peidodo_almacen_of_farmacia/'+this.id_pedido,esto)
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(data => {
        console.log(data, "   <<<<<<<<<<<<<<<<<<<<<<<<<")
        if(data.success == true){
          this.msg = data.msg;
          this.msg_false = "";
          swal.fire(
            'Success!',
            '<label style="color:green;">'+data.msg+'</label>',
            'success'
          )
        
          this.reduce();
          this.get_pedido();
          this.reduce_fechas_cantidad();
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
    get_pedido(){
      fetch(this.url+'/almacen/Vue_one_pedido_farmacia/'+this.id_pedido)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(resp => {
        console.log(resp, " <<<<<<<<<<<<<ooioioioio<<<<<")
        this.aceptados_list = resp[0].medicamento_mandado_almacen
        this.lista_med_aceptados = resp[0].medicamento_mandado_almacen.lista_med
      }) 
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
}


})
