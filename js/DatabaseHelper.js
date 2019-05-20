console.log("DatabaseHelper.js");

var DatabaseHelper = (function() {
	'use strict';

	var dbName;
	var connection;
	function init() {
		if(!connection) {
			dbName = 'SurfStreamrDB';
			connection = new JsStore.Instance();
			initJsStore();			
		}
	}
	function getDbSchema() {
	  var tblMessage = {
		name: 'messages',
		columns: [
		  {
			  name: 'id',
			  primaryKey: true,
			  autoIncrement: true
		  }, 
		  {
			  name: 'createTime',
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Number
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
		  tables: [tblMessage]
	  }
	  return db;
	}

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
	function insertMessage(message) {		
		let currentTime = Number((new Date()).getTime());
		var row = {
			createTime: currentTime,
			message: message
		}
		//since Id is autoincrement column, so the row will be automatically generated.
		connection.insert({
			into: 'messages',
			values: [row]
		}).then(function(rowsInserted) {
		}).catch(function(err) {
			console.log(err);
		});

	}

	async function getAllMessages() {
		let messages = await connection.select({
			from: 'messages',
		})
		return messages
	}
	
	async function getReadyMessages(time) {
		let rows = await connection.select({
			from: 'messages',
			where: {
				createTime: {
					'<=': time
				}
			}
		})
		return rows
	}
	
	function removeReadyMessages(time) {
		connection.remove({
			from: 'messages',
			where: {
				createTime: {
					'<=': time
				}
			}
		}).then(function(rowsDeleted) {
		}).catch(function(err) {
			console.log(err);
		});	
	}

	function removeMessage(id) {
		connection.remove({
			from: 'messages',
			where: {
				id: id
			}
		}).then(function(rowsDeleted) {
		}).catch(function(err) {
			console.log(err);
		});	
	}
	
    return {
        init: init,
		insertMessage: insertMessage,
		getAllMessages:getAllMessages,
		getReadyMessages: getReadyMessages,
		removeReadyMessages: removeReadyMessages,
		removeMessage: removeMessage
    };
}());
export {DatabaseHelper};