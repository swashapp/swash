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
    console.log(harLog);
    /*for (let entry of harLog.entries) {
        let row = {
            status: response.status,
            method: request.method,
            domain: request.url,
            file: request.url,
            type: 'tset',
            trabsferred: 'test',
            size: response.bodySize
        }
        addRow(row);        
    }*/
    browser.devtools.inspectedWindow.eval("document.readyState")
    .then(result => 
        {if (result[0] == "complete")         
            console.log(`HAR version: ${harLog.version}`);
        }
    );  
}

function addListener(){d
    let logRequestsButton = document.querySelector("#logButton");
    logRequestsButton.addEventListener("click", logRequests);
}

window.onload = addListener
var myInterval = setInterval(logRequests, 1000);
