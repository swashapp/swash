console.log("DatabaseHelper.js");
var dbName ='messages';
function getDbSchema() {
  var tblProduct = {
    name: 'Product',
    columns: [
      {
          name: 'id',
          primaryKey: true,
          autoIncrement: true
      }, 
      {
          name: 'createTime',
          notNull: true,
          dataType: JsStore.DATA_TYPE.DateTime
      }, 
      {
          name: 'message',
          notNull: true,
          dataType: JsStore.DATA_TYPE.Object
      }
    ]
  };
  var db = {
      name: dbName,
      tables: [tblProduct]
  }
  return db;
}

var connection = new JsStore.Instance(new Worker('jsstore.worker.js'));
function initJsStore() {
    connection.isDbExist(dbName).then(function(isExist) {
        if (isExist) {
            connection.openDb(dbName);
        } else {
            var database = getDbSchema();
            connection.createDb(database);
        }
    }).catch(function(err) {
        console.error(err);
    })
}
initJsStore();

var value = {
    itemName: 'Blue Jeans',
    price: 2000,
    quantity: 1000
}

//since Id is autoincrement column, so the value will be automatically generated.
connection.insert({
    into: 'Product',
    values: [value]
}).then(function(rowsInserted) {
    if (rowsInserted > 0) {
        alert('successfully added');
    }
}).catch(function(err) {
    console.log(err);
    alert(err.message);
});


connection.select({
    from: 'Product',
    where: {
        id: 5
    }
}).then(function(results) {
    // results will be array of objects
    alert(results.length + 'record found');
}).catch(function(err) {
    console.log(err);
    alert(err.message);
});

connection.update({ 
    in: 'Product',
    where: {
        itemName: {
            like: '%black%'
        }
    },
    set: {
        quantity: 2000
    }
}).then(function(rowsUpdated) {
    alert(rowsUpdated + ' rows updated');
}).catch(function(err) {
    console.log(err);
});


connection.remove({
    from: 'Product',
    where: {
        id: 10
    }
}).then(function(rowsDeleted) {
    alert(rowsDeleted + ' record deleted');
}).catch(function(err) {
    console.log(err);
});
