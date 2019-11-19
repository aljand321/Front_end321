Vue.filter('numeral', function (value) {
    return numeral(value).format('0,0');
})

const pedido_medicametos = new Vue({
    el: '#pedido_medicametos',    
    data : () => ({
      url:data_url.url_front_end,
      msg: "aljand321",

      id_user:'',

      respuestaPost_true:'',
      respuestaPost_false:'',

      trimestre:'',
      responsable:'',
      destino:'',
      
      alert: "",
      pass:"",

      medicamentos: [],
      itemsCar:[],
      qty:[],
      cantidadMedicamento:'',
      showModal: false,
        
      listItems : {},
      totalQty : 0,
      totalPrice : 0,

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
    created:function() {
        fetch(this.url+'/farmacia/Vue_medicamentos_farmacia1')
        .then(res => res.json())
        .then(res => {
            for(var i = 0; i < res.length; i++){
              this.ListMedicamentos.push({
                id : res[i].id,
                nombre : res[i].nombre,
                cantidad : res[i].cantidad_unidad,
                codificacion: res[i].codificacion,
                precio : res[i].precio_compra,
                presentacion : res[i].presentacion,
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

         //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    insert: function (id, cantidad){
      if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
        //this.msg = "Inserte una cantidad del producto"
        if(cantidad == 0 || cantidad == ""){
          this.alert = "Inserte una cantidad del producto"
          this.pass = ""
        }else if(cantidad <= 0){
          this.alert = "Las cantidades no pueden ser negativas"
          this.pass = ""
        }

      }  else {
        axios
        .get(this.url+'/farmacia/vue_medicamento/'+id)
        .then(response => {
          console.log(response)
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
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    reg_pedido(e){
      e.preventDefault();
      if( this.generateArray() == ""){
        this.respuestaPost_false = "No se seleciono un producto"
      }else{
        var data  = {
          trimestre : this.trimestre,
          responsable : this.responsable,
          destino : this.destino,
          medicamentos : {
            list_meds : this.generateArray(),
            totalPrice :  this.totalPrice,
            total_cantidad : this.totalQty
          },
          id_user : this.id_user
        };
        var esto = {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-type' : "application/json"
            }
        };
        fetch(this.url+'/farmacia/vue_post_pedidos',esto)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => { 
          if(data.success  == true){
            this.respuestaPost_true = data.msg;
            this.trimestre = ""
            this.responsable = ""
            this.destino = ""
            this.totalPrice = 0;
            this.totalQty = 0;
            this.listItems = {}; 
            this.respuestaPost_false = ""
          }else{
            this.respuestaPost_false = data.msg;
            this.respuestaPost_true = ""
          }
        })             
      } 
    }
  }
   
  
})