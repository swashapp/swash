console.log("survey_script.js");
var css = `#survey-bt{
  position: fixed;
  right: 10px;
  bottom: 10px;
  padding: 10px;
  background-color: #1ab394;
  border : 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  z-index: 300;
}
#survey-bt:hover{
  background-color: #179d82;
}
#surveyModal{
  display: none;
  position: fixed;
  max-height: calc(100% - 100px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  z-index: 300;
  vertical-align: middle;  
  overflow: auto; 
  background-color: rgba(0,0,0,0.4); 	
}
`;

function send_msg(msg){
    browser.runtime.sendMessage(msg);
}

function showButton() {
  var bt = document.createElement('div');
  bt.id = 'survey-bt';
  bt.innerHTML = 'Survey';
  var body = document.getElementsByTagName('body')[0];
  var btnStyle = document.createElement('style');
  btnStyle.innerHTML=css;
  body.append(bt);
  body.append(btnStyle);
  bt.onclick = showModal;
}

showButton();


function showModal() {
	var display = document.getElementById('surveyModal').style.display;
	if(display == "block") 
		document.getElementById('surveyModal').style.display = 'none';
	else
		document.getElementById('surveyModal').style.display = 'block';
}


function handleResponse(message) {
	console.log(`Message from the background script:  ${message}`);
    var json = {pages: message.survey.pages};
	window.survey = new Survey.Model(json);
	var surveyModal = document.createElement('div');
	surveyModal.id = 'surveyModal';
	var surveyElement = document.createElement('div');	
	surveyElement.id = 'surveyElement';
	var surveyResult = document.createElement('div');	
	surveyResult.id = 'surveyResult';
	var body = document.getElementsByTagName('body')[0];
	body.append(surveyModal);
	surveyModal.append(surveyElement);
	surveyModal.append(surveyResult);
	survey
		.onComplete
		.add(function (result) {
			showModal();
			let respMessage = {
				obj: "DataHandler",
				func: "handle",
				params: [{
						origin: window.location.href,
						header: {
							module: message.moduleName,
							function: "Survey",
							collector: message.survey.name
						},
						data: {
							out: {
								survey: result.data
							},
							schems: [
								{jpath:"$.survey",type:"text"}
							]
						}
					}]
			}
			send_msg(respMessage);			
		});

	$("#surveyElement").Survey({model: survey});
}

function handleError(error) {
  console.log(`Error: ${error}`);
}





if (typeof sMessage === 'undefined') {
	let sMessage = {
		obj: "Survey",
		func: "injectSurvey",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(sMessage).then(handleResponse, handleError);  
}



