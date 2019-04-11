console.log("devtools_script.js");

var moduleName = "";
var filters = {"": true};
var rules = [];
var url_matches = [];
var netLog = [];
function wildcard(input, wc) {
	function regExpEscape (s) {
	  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\$&');
	}
	var regex = new RegExp('^' + wc.split(/\*+/).map(regExpEscape).join('.*') + '$');
	if(!input.match(regex))
		return false;
	return true;
}


function loadPanel() {
    let func = (event) => {filterRows(event, "")}
	document.getElementById("clearRows").addEventListener("click", clearRows);	
    document.getElementById("selectAll").addEventListener("change", selectAll);
    document.getElementById("filterAll").addEventListener("click", func);
	document.getElementById("sendToMarketplace").addEventListener("click", sendToMarketplace);
}

function loadFilters() {
	let bootstrapClasses = [
		'btn bg-color-1 btn-sm text-white',
		'btn bg-color-2 btn-sm',
		'btn bg-color-3 btn-sm',
		'btn bg-color-4 btn-sm',
		'btn bg-color-5 btn-sm'
		]    
    for(ruleIndex in rules) {
        addFilterButton(rules[ruleIndex].name, bootstrapClasses[ruleIndex<5?ruleIndex:4]); 
    }
}
function createRowColumn(row) {
  var column = document.createElement("td");
  row.appendChild(column);
  return column;
}


function filterRows(event, name) {
    let rows = document.querySelectorAll(".surfstreamr-rule-" + name);
    let btn = event.target;
    if(filters[name]) {
        btn.classList.remove("filterSelected");
		filters[name] = false;
        rows.forEach(function(row) {
			let res = false;
			for(let filter in filters)	{				
				if(filters[filter] && row.classList.contains("surfstreamr-rule-" + filter))
					res = true;
			}
			if(!res)
				row.classList.add("rowDisabled");
        })
    }
    else {
		filters[name] = true;
        btn.classList.add("filterSelected");                
        rows.forEach(function(row) {
            row.classList.remove("rowDisabled");
        })

    }
	selectAll();
}

function getSelectedRows() {
	let resRows = {};
	let rows = document.querySelectorAll(".surfstreamr-rule-");
	rows.forEach(function(row) {
		let select = row.getElementsByClassName('selectRow')[0];
		if(select.checked) {
			let id = row.id.split('-')[2];
			for(let m of netLog[id].matched) {
				if(!resRows[m])
					resRows[m] = []
				resRows[m].push(netLog[id].row)
			}			
		}
	})
	return resRows;
}

function addFilterButton(name, className) {
	filters[name] = false;
    let fb = document.getElementById("filterButtons");
    var button = document.createElement("button");
    button.addEventListener("click", function(event) {filterRows(event,  name)});
    button.setAttribute("class", className + " filterButton");
    button.setAttribute("id", "button-" + name);
    button.innerHTML = name.substr(0,7) + ((name.length>7)?'...':'')   
    fb.appendChild(button);
}

function selectAll() {
	let rows = document.querySelectorAll('.surfstreamr-rule-');
	rows.forEach(function(row) {
		let select = row.getElementsByClassName('selectRow')[0];
		select.checked = false;
		if(!row.classList.contains("rowDisabled"))
			select.checked = document.getElementById('selectAll').checked;
	})
}
function addRow(row) {
	let id = "surfstreamr-row-" + netLog.length;
    let bootstrapClasses = [
		'bg-color-1',
		'bg-color-2',
		'bg-color-3',
		'bg-color-4',
		'bg-color-5',
	]
  var newrow = document.createElement("tr");
  newrow.id = id;
  let visible = false;
  newrow.classList.add("surfstreamr-rule-");
  let matchList = [];
  if(filters[""]) {
	  visible = true;
  }
  for(ruleIndex in rules) {
	  if(matchRule(rules[ruleIndex], row)) {
		matchList.push(rules[ruleIndex].name);
		newrow.classList.add(bootstrapClasses[ruleIndex<5?ruleIndex:4]);
		newrow.classList.add("surfstreamr-rule-" + rules[ruleIndex].name)
		if(filters[rules[ruleIndex].name])
			visible = true;
		if(ruleIndex == 0) {
			newrow.classList.add("text-white");
		}
      }
  }
  netLog.push({row:row, matched:matchList});
  if(!visible)
	  newrow.classList.add("rowDisabled");
  var checkColumn = createRowColumn(newrow);
  checkColumn.setAttribute("class", "align-middle");
  checkColumn.setAttribute("align", "center");  
  var statusColumn = createRowColumn(newrow);
  var methodColumn = createRowColumn(newrow);
  var domainColumn = createRowColumn(newrow);
  var fileColumn = createRowColumn(newrow);
  var timeColumn = createRowColumn(newrow);
  var typeColumn = createRowColumn(newrow);
  var transferredColumn = createRowColumn(newrow);
  var sizeColumn = createRowColumn(newrow);

  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("class", "selectRow");
  checkColumn.appendChild(checkbox);
  statusColumn.innerHTML = "<div class='statusWrapper-" + row.status + "'>" + row.status + "</div>";
  methodColumn.innerHTML = row.method;
  timeColumn.innerHTML = row.time + " ms";
  domainColumn.innerHTML = row.domain;
  fileColumn.innerHTML = row.file;
  typeColumn.innerHTML = row.type;
  transferredColumn.innerHTML = row.transferred;
  sizeColumn.innerHTML = row.size;  

  
  var table = document.getElementById('netTable');
  var tbody = table.querySelector('tbody');  
  tbody.appendChild(newrow);
}

function clearRows() {
  var table = document.getElementById('netTable');
  var tbody = table.querySelector('tbody');    
  var new_tbody = document.createElement('tbody');
  tbody.parentNode.replaceChild(new_tbody, tbody);
  netLog = [];
}


async function logRequests() {
	let match = false;
	let res = await browser.devtools.inspectedWindow.eval("window.location.href");
	let currentUrl = res[0];
	for(let url of url_matches) {
		if(wildcard(currentUrl, url)) {
			match = true;
			break;
		}
	}
	if(!match)
		return;
    let harLog = await browser.devtools.network.getHAR();
	console.log(harLog);
    for (let entry of harLog.entries) {
		var url = new URL(entry.request.url);
        let row = {
            status: (entry.response.status > 0)? entry.response.status:'',
            method: entry.request.method,
            domain: url.hostname,
            file: url.pathname,
            time: entry.time,
            type: entry.response.content.mimeType.split('/')[1].split(/[\;\+]/)[0],
            transferred: (entry.response.status == 304)?'cached':(entry.response.bodySize > 0)?(entry.response.bodySize/1024).toFixed(2) + " kB":"0 B",
            size: (entry.response.content.size > 0)?(entry.response.content.size/1024).toFixed(2) + " kB":"0 B"
        }
        addRow(row);        
    }
}

function matchRule(rule, data) {
	let resp = true;
	for(cn of rule.conditions) {
		switch(cn.operator) {
			case '>':
				resp = resp&&(data[cn.object] > cn.value)
				break;
			case '>=':
				resp = resp&&(data[cn.object] >= cn.value)
				break;
			case '<':
				resp = resp&&(data[cn.object] < cn.value)
				break;
			case '<=':
				resp = resp&&(data[cn.object] <= cn.value)
				break;
			case '=':
				resp = resp&&(data[cn.object] == cn.value)
				break;
			case '!=':
				resp = resp&&(data[cn.object] != cn.value)
				break;
			case 'regEx':
				resp = resp&&(data[cn.object].match(cn.value))
				break;
			case 'contains':
				resp = resp&&(data[cn.object].indexOf(cn.value) >= 0)
				break;
		}
	}
	return resp;
}

function handleResponse(message) {
	console.log(`Message from the background script:  ${JSON.stringify(message)}`);  
	rules = message.devtools;
	moduleName = message.moduleName;
	url_matches = message.url_matches;
	loadFilters();	
}


function handleError(error) {
  console.log(`Error: ${error}`);
}




function loadConfig(moduleName) {
	let message = {
		obj: "Devtools",
		func: "injectRules",
		params: [moduleName]
	}

	browser.runtime.sendMessage(message).then(handleResponse, handleError);  
}

function sendToMarketplace() {
	let result = getSelectedRows();
	for(res in result) {
		let respMessage = {
			obj: "DataHandler",
			func: "handle",
			params: [{
					origin: "Devtools",
					header: {
						module: moduleName,
						function: "Devtools",
						collector: res
					},
					data: {
						out: {
							netlog: result[res]
						},
						schems: [
							{jpath:"$.netlog",type:"text"}
						]
					}
				}]
		}
		browser.runtime.sendMessage(respMessage);		
	}
}

window.onload = loadPanel
browser.devtools.network.onNavigated.addListener(logRequests);






