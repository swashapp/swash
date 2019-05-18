console.log("survey_script.js");

var surveyScript = (function () {	
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
	#surfstreamr-surveyModal{
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

	#surfstreamr-surveyOptionsMain {
		display: none;
		position: fixed;
		max-height: calc(100% - 100px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		z-index: 300;
		vertical-align: middle;  
		padding: 1em 1em 5em;
		background-color: #fff;
		border-top: 2px solid #1ab394;
		font-family: Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif;
		font-size: 14px;
		min-width: 200px;
		min-height: 100px;    
	}

	#surfstreamr-surveyOptions{
		width: 100%;
		padding: .5em 1em 1.5em;
		box-sizing: border-box;
		overflow: auto;
		float: none;
		display: inline-block;
		vertical-align: top;
		background-color: #f4f4f4;
		border-bottom: 1px solid #e7e7e7;
		margin-bottom: 5px;
		clear: both;
	}

	#surfstreamr-surveyOptions span {
		position: static;
		box-sizing: inherit;
		font-weight: 700;
		font-size: 1em;
		color: #6d7072;
	}

	#surfstreamr-surveySelectWrapper {
		width: 100%;
		position: relative;
		display: inline-block;
		background-color: #fff;	
	}

	#surfstreamr-surveySelectWrapper::before {
		padding: 1em;
		position: absolute;
		right: 1px;
		right: 0;
		top: 1px;
		background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzNCAzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzQgMzQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIxMiwxNiAxNCwxNCAxNywxNyAyMCwxNCAyMiwxNiAxNywyMSAiLz4KPC9zdmc+Cg==);
		content: "";
		background-repeat: no-repeat;
		background-position: 50%;
		background-color: #1ab394;
	}

	#surfstreamr-selectSurvey {
		display: block;
		background: transparent;
		-moz-appearance: none;
		padding-right: 2.5em;
		height: calc(2em + 1px);
		box-sizing: border-box;
		font-size: 1em;
		line-height: 2em;
		padding-left: 1em;
		border: 1px solid #e7e7e7;
		color: #6d7072;
		font-family: sans-serif;
		margin: 0;
		width: 100%;
		position: relative;
		touch-action: manipulation;
	}



	#surfstreamr-startButton {
		background-color: #179d82;   
		float: right;
		font-size: .85em;
		font-weight: 700;
		line-height: 2em;
		border: none;
		min-width: 100px;
		cursor: pointer;
		padding: 0 2em;
		border-radius: 2px;
		color: #fff;
		margin-top: 3px;
		
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
		var display1 = document.getElementById('surfstreamr-surveyModal').style.display;
		var display2 = document.getElementById('surfstreamr-surveyOptionsMain').style.display;
		if(display1 == "block" || display2 == "block") {
			document.getElementById('surfstreamr-surveyModal').style.display = 'none';
			document.getElementById('surfstreamr-surveyOptionsMain').style.display = 'none';
		}
		else {		
			document.getElementById('surfstreamr-surveyOptionsMain').style.display = 'block';
		}
	}

	function startSurvey(message) {
		let selectSurvey = document.getElementById('surfstreamr-selectSurvey');
		let surveyId = selectSurvey.options[selectSurvey.selectedIndex].value;
		if(!surveyId)
			return;
		document.getElementById('surfstreamr-surveyOptionsMain').style.display = 'none';
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
								collector: message.surveys[surveyId].name
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
		if(!message || !message.surveys || message.surveys.length == 0)
			return;
		surveys = message.surveys
		var surveyModal = document.createElement('div');
		surveyModal.id = 'surfstreamr-surveyModal';
		var surveyOptionsMain = document.createElement('div');
		surveyOptionsMain.id = 'surfstreamr-surveyOptionsMain';
		var surveyOptions = document.createElement('div');
		surveyOptions.id = 'surfstreamr-surveyOptions';
		var surveyElement = document.createElement('div');	
		surveyElement.id = 'surfstreamr-surveyElement';
		var surveyResult = document.createElement('div');	
		surveyResult.id = 'surfstreamr-surveyResult';
		var body = document.getElementsByTagName('body')[0];
		body.append(surveyModal);
		body.append(surveyOptionsMain);
		surveyOptionsMain.append(surveyOptions);
		surveyModal.append(surveyElement);
		surveyModal.append(surveyResult);
		
		
		var frag = document.createDocumentFragment();
		var title = document.createElement('span');	
		title.id = 'surfstreamr-title';
		title.innerText = "Choose The Survey You Are Going To Do";

		
		var surveySelectWrapper = document.createElement('div');	
		surveySelectWrapper.id = 'surfstreamr-surveySelectWrapper';
		var selectSurvey = document.createElement("select");
		selectSurvey.id = 'surfstreamr-selectSurvey';
		
		
		var startButton = document.createElement("button");
		startButton.id = "surfstreamr-startButton"
		startButton.innerHTML = 'Start Survey';
		startButton.onclick = function(){startSurvey(message)};

		selectSurvey.options.add( new Option("Choose...","") );
		for(let surveyId in surveys) {
		   selectSurvey.options.add( new Option(surveys[surveyId].name,surveyId) );       
		}

		frag.appendChild(title);
		surveySelectWrapper.appendChild(selectSurvey);
		frag.appendChild(surveySelectWrapper);
		surveyOptions.appendChild(frag);
		surveyOptionsMain.appendChild(startButton);
		showButton();
	}

	function handleError(error) {
	  console.log(`Error: ${error}`);
	}
	
	return {
		handleResponse: handleResponse,
		handleError: handleError
	}
}());

if(typeof window.surfStreamrContentMessage === 'undefined') {
	window.surfStreamrSurveyMessage = {
		obj: "Survey",
		func: "injectSurvey",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(window.surfStreamrSurveyMessage).then(surveyScript.handleResponse, surveyScript.handleError);  	
}