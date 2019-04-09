function addListener() {
	document.getElementById("clearRows").addEventListener("click", clearRows);	
    document.getElementById("selectAll").addEventListener("change", selectAll);	
}
function createRowColumn(row) {
  var column = document.createElement("td");
  row.appendChild(column);
  return column;
}

function selectAll() {
    let rows = document.querySelectorAll('.selectRow');
    if(document.getElementById('selectAll').checked) 
    {
            rows.forEach(function(row) {
                row.checked = true;
            })
    } else {
            rows.forEach(function(row) {
                row.checked = false;
            })
    }
}
function addRow(row) {

	let bootstrapClasses = [
		'bg-primary text-white',
		'bg-secondary text-white',
		'bg-success text-white',
		'bg-danger text-white',
		'bg-warning',
		'bg-info text-white',
		'bg-light',
		'bg-dark text-white',
		'bg-white'
	]
	
  var newrow = document.createElement("tr");
  for(ruleIndex in rules) {
	  if(matchRule(rules[ruleIndex], row))
		newrow.setAttribute("class", bootstrapClasses[ruleIndex<8?ruleIndex:7]);
  }
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
  tbody.parentNode.replaceChild(new_tbody, tbody)  
}


async function logRequests() {      
    let harLog = await browser.devtools.network.getHAR();
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
    console.log(harLog);
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


window.onload = addListener
//var myInterval = setInterval(logRequests, 1000);
browser.devtools.network.onNavigated.addListener(logRequests);
let rules = [
	{
		name: 'rule1',
		conditions: [
			{
				object: 'status',
				operator: '!=',
				value:	200
			},
			{
				object: 'status',
				operator: '!=',
				value:	304
			}
		]
	},
	{
		name: 'rule2',
		conditions: [
			{
				object: 'size',
				operator: '=',
				value:	0
			}
		]
	},
	{
		name: 'rule3',
		conditions: [
			{
				object: 'time',
				operator: '>',
				value:	2000
			}
		]
	}
]