Vue.component('modal', {
  template: '#modal-template'
})

Vue.filter('numeral', function (value) {
    return numeral(value).format('0,0');
  })
const carMedicamentos = new Vue({
    el: '#carMedicamentos',    
    data : () => ({
      
      url:data_url.url_front_end,
      aljand:'aljand 321',
      mostrar:true,

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

      codigoCompra:'',
      responsable:'',
      boletaPago:'',
      
      fechaIngreso:'',
      proveedor:'',
      Observaciones:'',
      id_personal:'',
      respuestaPost:'',

      //pra medicamentos pag search
        
      searchMed: '',
      ListMedicamentos:[],
      filteredMeds: [],
      paginatedMeds: [],
      paginationMeds: {
          range: 5,
          currentPage: 1,
          itemPerPage: 5,
          ListMedicamentos: [],
          filteredMeds: [],
      },
       
  
    }),
    created:function() {
      fetch(this.url+'/pedidos/vuePedidos')
      .then(res => res.json())
      .then(res => {
        for(var i = 0; i < res.length; i++){
          this.ListMedicamentos.push({
            id : res[i].id,
            nombre : res[i].nombre,
            cantidad : res[i].cantidad,
            codificacion: res[i].codificacion,
            precio : res[i].precio,
            presentacion : res[i].presentacion,
            unidades : res[i].unidades,
            cant:0
          }) 
        }
      })
    },
    mounted(){
      this.fechaIngreso = moment().format('l')
    },
    ready() {   
      //esta parte es para el modal de buscar mecicamentos
      this.filteredMeds = this.ListMedicamentos
      this.buildPaginationMed()
      this.selectPageMed(1)  
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    },
  
    methods:{    
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        //esto
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
        agregar: function (){
            axios
            .get(this.url+'/pedidos/vuePedidos')
            .then(response => {
              this.resources = response.data              
            })
        },
        insertar: function (id, cantidad){
          
          if(cantidad == 0 || cantidad <= 0 || cantidad == ""){
            //this.msg = "Inserte una cantidad del producto"
            if(cantidad == 0 || cantidad == ""){
              this.alert = "Inserte una cantidad del producto"
            }else if(cantidad <= 0){
              this.alert = "Las cantidades no pueden ser negativas"
            }
            
          }  else {
            axios
          .get(this.url+'/pedidos/carrito/'+id)
          .then(response => {
            var car = {
              id: response.data.id,
              codificacion: response.data.codificacion,
              nombre: response.data.nombre,
              cantidad: response.data.cantidad,
              price: response.data.price
            }   
            this.itemsCar = car;
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
        
        formSubmit(e) {
            e.preventDefault();
            if( this.generateArray() == ""){
                swal.fire(
                  'Error!',
                  '<label style="color:red;">No se seleciono productos</label>',
                  'error'
                )
            }else{
              var data  = {
                codigoCompra:this.codigoCompra,
                boletaPago:this.boletaPago,
                responsable:this.responsable,
                fechaIngreso:this.fechaIngreso,
                proveedor:this.proveedor,
                productosDelPedido: this.generateArray(),
                Observaciones:this.Observaciones,
                subTotal:this.totalPrice,
                iva:this.totalPrice * 0.13,
                total:this.totalPrice + this.totalPrice * 0.13,
                id_personal:this.id_personal
              };
              var esto = {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers:{
                    'Content-type' : "application/json"
                  }
              };
              fetch(this.url+'/pedidos/PostCarrito',esto)
              .then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(data => { 
                if(data.success == false){
                  swal.fire(
                    'Error!',
                    '<label style="color:red;">'+data.message+'</label>',
                    'error'
                  )
                }else{
                  swal.fire(
                    'Confirmado',
                    '<label style="color:green;">'+data.message+'</label>',
                    'success'
                  )
                  this.codigoCompra = ""
                  this.boletaPago = ""
                 
                  this.proveedor = ""
                  this.Observaciones = ""
                  this.totalPrice = 0;
                  this.totalQty = 0;
                  this.listItems = {};   
                }
                
              })             
            } 
            setTimeout(()=>{
              this.respuestaPost = ""
            },1000);       
        },
        quitar(a,b){
            this.listItems = {};
        },
    }    
})