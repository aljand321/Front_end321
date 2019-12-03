const ver_pedido =  new Vue({
    el:'#ver_pedido',
    data: () => ({
        url:data_url.url_front_end,
        msg: "",
        error: "",
        list:[],
        subTotal:0,

        id_pedido:'',
        pedido:'', 
        
        codigo_compra:'',
        cantidad:''
        
    }),
    methods:{
        ver(id){
            this.id_pedido = id;
            console.log("click")
            fetch(this.url+'/pedidos/vue_verPedido/'+id)   
            .then(resp => resp.json())
            .then(resp =>{
                this.codigo_compra = resp[0].codigoCompra         
                this.subTotal = resp[0].subTotal
                //this.list = resp[0].productosDelPedido
                var arr= []
                for(var i = 0; i < resp[0].productosDelPedido.length; i++){
                    arr.push({
                        item: {
                            id : resp[0].productosDelPedido[i].item.id,
                            codificacion : resp[0].productosDelPedido[i].item.codificacion,
                            nombre : resp[0].productosDelPedido[i].item.nombre,
                            price : resp[0].productosDelPedido[i].item.price
                        },
                        fehca_vencimineto: '',
                        qty : resp[0].productosDelPedido[i].qty,
                        price : resp[0].productosDelPedido[i].price
                    })
                }
                this.list = arr
                this.error = ""
                

                if(resp[0].ProductosAceptados != null){
                    this.pedido = resp[0].ProductosAceptados
                    this.msg = "Este pedido ya a sido aceptado y mandado a la base de datos"
                }
               
            })
            .catch(error => {
                console.error('Error:', error)
                res.send("no hay coneccion con el servidor");
            }) 
        },

        //esta funcion es para poder sacar de una tabla un pruducto sin que se repita
       /*  add(id, position){
            console.log(id, " id")
            var aux
            for(var i = 0; i < this.list.length; i++){
                if(this.list[i].item.id == id){
                    if(this.list_new.New_list == ""){
                        console.log("no hay nada")
                    }else{
                        for(var i = 0; i < this.list_new.New_list.length; i++){
                            if(this.list_new.New_list[i].item.id == id){
                              console.log("ya hay ese producto")
                              aux = "ya hay ese producto"                             
                            }
                        }

                    }
                    
                }
            }
             if(aux != "ya hay ese producto"){
                this.list_new.New_list.push(this.list[position])
            } 
        }, */

        add_one (id) {
            if (this.cantidad == ''){
                swal.fire(
                    'Error!',
                    '<label style="color:red;"> Inserte una cantidad por favor </label>',
                    'error'
                )
            }else{
                for( var i = 0 ; i < this.cantidad; i++){
                    this.list[id].qty++;
                    this.list[id].price += this.list[id].item.price * 1;   
                    this.subTotal  = this.subTotal*1 + this.list[id].item.price *1 ;
                }
                
                this.cantidad = '';
            }
             
            
        },

        reduceByOne (id) {
            console.log (this.list[id].qty)
            if (this.cantidad == ''){
                swal.fire(
                    'Error!',
                    '<label style="color:red;"> Inserte una cantidad por favor </label>',
                    'error'
                )
            }else{
                if (this.list[id].qty < this.cantidad){
                    swal.fire(
                        'Error!',
                        '<label style="color:red;"> La cantidad que quiere eliminar es mayor a la existente  </label>',
                        'error'
                    )
                }else{
                    for( var i = 0 ; i < this.cantidad; i++){                    
                        this.list[id].qty--;
                        this.list[id].price -= this.list[id].item.price * 1;   
                        this.subTotal  -= this.list[id].item.price *1 ; 
                        if (this.list[id].qty <= 0) {
                            //delete this.list[id];
                            this.list.splice(id,1)                        
                        }                    
                    }
                }                
                this.cantidad = ''
            }
            
        },

        removeItem(id) {            
            this.subTotal -= this.list[id].price;
            this.list.splice(id, 1)
        },
        update(e){
            e.preventDefault();
            var data
            for(var i = 0; i < this.list.length ; i++){
                if (this.list[i].fehca_vencimineto == ""){
                    swal.fire(
                        'Error!',
                        '<label style="color:red;"> Inserte fecha de vencimiento del producto  '+this.list[i].item.nombre+' </label>',
                        'error'
                    )
                    data = "error"
                }
            }
            if (data == "error"){
                data = ""
            }else{
                if(this.list == ""){
                    //this.error = "Por favor primero muestre la lista de Medicamentos"
                    swal.fire(
                        'Error!',
                        '<label style="color:red;">Por favor primero muestre la lista de Medicamentos</label>',
                        'error'
                    )
                }else{
                    data = {
                        ProductosAceptados:{
                            medicamentos: this.list,
                            subTotal:this.subTotal,
                            iva:this.subTotal * 0.13,
                            total:this.subTotal + this.subTotal * 0.13
                        } 
                    }
                    var esto = {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers:{
                          'Content-type' : "application/json"
                        }
                    };
                    fetch(this.url+'/pedidos/vue_update_pedido/'+this.id_pedido,esto)
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(data => { 
                        if (data.success == true){
                            this.msg = data.msg;
                            this.insertar();
                            this.update_cantidad();
                            this.ver(this.id_pedido);
                        } 
                    })  
                }
            }
            
            
        },
        insertar(){
           
            for(var i = 0; i < this.list.length; i++){
                 data = {
                    codigo_compra: this.codigo_compra,
                    fehca_vencimineto: this.list[i].fehca_vencimineto,
                    cantidad_unidad : this.list[i].qty,
                    precio :  this.list[i].price
                }
                var esto = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{
                      'Content-type' : "application/json"
                    }
                };
                fetch(this.url+'/pedidos/Vuecreate_pedido_medicamento/'+this.list[i].item.id,esto)
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(resp => {  
                    console.log(resp);
                }) 
            }
        },

        update_cantidad(){

            for(var i=0; i < this.list.length; i++){
                data = { unidades: this.list[i].qty }
                var esto = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{
                      'Content-type' : "application/json"
                    }
                };
                fetch(this.url+'/pedidos/Vue_add_unidades/'+this.list[i].item.id,esto)
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(resp => {  
                    console.log(resp);
                })
            }

        }
    }
})