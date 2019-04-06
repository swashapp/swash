console.log("survey_script.js");
var surveys = [];
var css = `#surfstreamr-survey-bt{
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
#surfstreamr-survey-bt:hover{
  background-color: #179d82;
}
#surfstreamr-surveyOptions, #surfstreamr-surveyModal{
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

#surfstreamr-surveyOptions{
    min-width: 500px;
    min-height: 200px;    
    background-color: rgb(255,255,255,1);
}

#surfstreamr-selectSurvey {
    margin-left: auto;
    margin-right: auto;
    border : 1px solid black;
    border-radius: 5px;
    font-weight: 300;
    position: absolute;
    top: 30%;
    left: 40%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
    font-size: 1em;
}

#surfstreamr-startButton {
    background-color: #1ab394;
    border : 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 40%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
    font-size: 1em;
}

#surfstreamr-title {
    color: black;
    font-weight: 700;
    transform: translate(-50%, -50%);
    position: relative;
    margin-left: 20%;
    font-size: 1em;
}
`;

function send_msg(msg){
    browser.runtime.sendMessage(msg);
}

function showButton() {
    var bt = document.createElement('div');
    bt.id = 'surfstreamr-survey-bt';
    bt.innerHTML = 'Survey';
    var body = document.getElementsByTagName('body')[0];
    var btnStyle = document.createElement('style');
    btnStyle.innerHTML=css;
    body.append(bt);
    body.append(btnStyle);
    bt.onclick = showModal;  
}



function showModal() {    
	var display = document.getElementById('surfstreamr-surveyModal').style.display;
	if(display == "block") {
		document.getElementById('surfstreamr-surveyModal').style.display = 'none';
        document.getElementById('surfstreamr-surveyOptions').style.display = 'none';
    }
	else {		
        document.getElementById('surfstreamr-surveyOptions').style.display = 'block';
    }
}

function startSurvey() {
    let selectSurvey = document.getElementById('surfstreamr-selectSurvey');
    let surveyId = selectSurvey.options[selectSurvey.selectedIndex].value;
    document.getElementById('surfstreamr-surveyOptions').style.display = 'none';
    document.getElementById('surfstreamr-surveyModal').style.display = 'block';
    var json = {pages: surveys[surveyId].pages};
	window.survey = new Survey.Model(json);
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

	$("#surfstreamr-surveyElement").Survey({model: survey});
}

function handleResponse(message) {
    if(!message)
        return;
    surveys = message.surveys
	var surveyModal = document.createElement('div');
	surveyModal.id = 'surfstreamr-surveyModal';
    var surveyOptions = document.createElement('div');
    surveyOptions.id = 'surfstreamr-surveyOptions';
    surveyOptions.className = 'sv_select_wrapper';
	var surveyElement = document.createElement('div');	
	surveyElement.id = 'surfstreamr-surveyElement';
	var surveyResult = document.createElement('div');	
	surveyResult.id = 'surfstreamr-surveyResult';
	var body = document.getElementsByTagName('body')[0];
	body.append(surveyModal);
    body.append(surveyOptions);
	surveyModal.append(surveyElement);
	surveyModal.append(surveyResult);
    
    
    var frag = document.createDocumentFragment();
  	var title = document.createElement('span');	
	title.id = 'surfstreamr-title';
    title.innerText = "Choose The Survey You Are Going To Do";

    var selectSurvey = document.createElement("select");
    selectSurvey.id = 'surfstreamr-selectSurvey';
    selectSurvey.className = 'sv_q_dropdown_control';
    
    var startButton = document.createElement("button");
    startButton.id = "surfstreamr-startButton"
    startButton.innerHTML = 'Start Survey';
    startButton.onclick = startSurvey;

    for(let surveyId in surveys) {
       selectSurvey.options.add( new Option(surveys[surveyId].name,surveyId) );        
    }

    frag.appendChild(title);
    frag.appendChild(selectSurvey);
    frag.appendChild(startButton);
    surveyOptions.appendChild(frag);
    showButton();
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