var name = {
    url : 'http://localhost:3000',
    urlFarmacia : 'http://localhost:3500',
    pruebas: 'http://localhost:3600',
    cuadernos: 'http://localhost:4600',
    token:[],
    session:'',
    data_user:{}
}

function user_data1(data,id){
  let storedItem = name.data_user[id];
    if (!storedItem) {
      storedItem = name.data_user[id] = {
        data: data,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in name.data_user) {
      arr.push(name.data_user[id]);
  }
  return arr;
}

function remove_user12(id) {
  delete name.data_user[id];
  //delete datas.name.data_user[id]
}
    
exports.name = name ;

export { user_data1, remove_user12 };
