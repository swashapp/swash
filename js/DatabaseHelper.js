console.log("databaseHelper.js");

var databaseHelper = (function() {
	'use strict';

	var dbName;
	var connection;
	function init() {
		if(!connection) {
			dbName = 'SwashDB';
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

	  var tblStats = {
		name: 'stats',
		columns: [
		  {
			  name: 'moduleName',
			  primaryKey: true  
		  }, 
		  {
			  name: 'messageCount',
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Number
		  }, 
		  {
			  name: 'lastSent',
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Number
		  }
		]
	  };
	  
	  var db = {
		  name: dbName,
		  tables: [tblMessage, tblStats]
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

	function updateMessageCount(moduleName) {		
		let currentTime = Number((new Date()).getTime());		
		return connection.update({
			in: 'stats',
			set: {
				'messageCount': {
					'+': 1
				},
				'lastSent': currentTime
			},
			where: {
				moduleName: moduleName,				
			}
			
		}).then(function(rowsUpdated) {
			if(rowsUpdated === 0) {
				let row = {
					moduleName: moduleName,
					lastSent: currentTime,
					messageCount: 1,					
				}
				//since Id is autoincrement column, so the row will be automatically generated.
				connection.insert({
					into: 'stats',
					values: [row]
				}).then(function(rowsInserted) {
				}).catch(function(err) {
					console.log(err);
				});
			}
		}).catch(function(err) {
			console.log(err);
		});
	}

	async function getMessageCount(moduleName) {
		let rows = await connection.select({
			from: 'stats',
			where: {
				moduleName: moduleName
			}
		})
		return (rows && rows[0] && rows[0]['messageCount'])?rows[0]['messageCount']:0
	}

	async function getTotalMessageCount() {
		let rows = await connection.select({
			from: 'stats',
			aggregate: {
				sum: 'messageCount'
			}
		})
		return (rows && rows[0] && rows[0]['sum(messageCount)'])?rows[0]['sum(messageCount)']:0
	}

	async function getLastSentDate() {
		let rows = await connection.select({
			from: 'stats',
			aggregate: {
				max: 'lastSent'
			}
		})
		return (rows && rows[0] && rows[0]['max(lastSent)'])?rows[0]['max(lastSent)']:0
	}

	function insertMessage(message) {		
		let currentTime = Number((new Date()).getTime());
		var row = {
			createTime: currentTime,
			message: message
		}
		//since Id is autoincrement column, so the row will be automatically generated.
		return connection.insert({
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
		return connection.remove({
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
		return connection.remove({
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
		updateMessageCount,
		getMessageCount,
		getTotalMessageCount,
		getLastSentDate,
        init,
		insertMessage,
		getAllMessages,
		getReadyMessages,
		removeReadyMessages,
		removeMessage,
    };
}());
export {databaseHelper};