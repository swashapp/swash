var databaseHelper = (function() {
	'use strict';

	var dbName;
	var connection;
	async function init() {
		if(!connection) {
			dbName = 'SwashDBV3';
			connection = new JsStore.Connection();
			await initJsStore();			
		}
	}
	function getDbSchema() {
	  var tblMessage = {
		name: 'messages',
		columns: {
		  id: {
			  primaryKey: true,
			  autoIncrement: true
		  }, 
		  createTime: {
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Number
		  }, 
		  message: {			  
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Object
		  }
		}
	  };

	  var tblStats = {
		name: 'stats',
		columns: {
			moduleName: {			  
			  primaryKey: true  
		  }, 
		  messageCount: {			  
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Number
		  }, 
		  lastSent: {			  
			  notNull: true,
			  dataType: JsStore.DATA_TYPE.Number
		  }
		}
	  };
	  
	  var db = {
		  name: dbName,
		  tables: [tblMessage, tblStats]
	  }
	  return db;
	}

	async function initJsStore() {
		var isDbCreated = await connection.initDb(getDbSchema());
		if (isDbCreated) {
			console.log('Message database created');
		}
		else {
			console.log('Message database opened');
		}
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
					console.error(err);
				});
			}
		}).catch(function(err) {
			console.error(err);
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
			console.error(err);
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
	
	async function removeReadyMessages(time) {
		return connection.remove({
			from: 'messages',
			where: {
				createTime: {
					'<=': time
				}
			}
		}).then(function(rowsDeleted) {
		}).catch(function(err) {
			console.error(err);
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
			console.error(err);
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