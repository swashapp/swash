function addListener() {
	document.getElementById("clearRows").addEventListener("click", clearRows);	
}
function createRowColumn(row) {
  var column = document.createElement("td");
  row.appendChild(column);
  return column;
}

function addRow(row) {
  var newrow = document.createElement("tr");
  var checkColumn = createRowColumn(newrow);
  var statusColumn = createRowColumn(newrow);
  var methodColumn = createRowColumn(newrow);
  var domainColumn = createRowColumn(newrow);
  var fileColumn = createRowColumn(newrow);
  var causeColumn = createRowColumn(newrow);
  var typeColumn = createRowColumn(newrow);
  var transferredColumn = createRowColumn(newrow);
  var sizeColumn = createRowColumn(newrow);

  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkColumn.appendChild(checkbox);
  statusColumn.innerHTML = row.status;
  methodColumn.innerHTML = row.method;
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
            status: entry.response.status,
            method: entry.request.method,
            domain: url.hostname,
            file: url.pathname,
            type: 'tset',
            trabsferred: 'test',
            size: entry.response.bodySize
        }
        addRow(row);        
    }
}


window.onload = addListener
//var myInterval = setInterval(logRequests, 1000);
browser.devtools.network.onNavigated.addListener(logRequests);
